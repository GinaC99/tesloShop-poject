import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepositori: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Creacion del producto')
    this.logger.log('-------------------------------------------')
    try {
      const product = this.productRepositori.create(createProductDto);
      this.logger.log("🚀 ~ ProductsService ~ create ~ product:", JSON.stringify(product));
      await this.productRepositori.save(product);
      return product;
    } catch (error) {
      this.handlerException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Busqueda de todos los productos')
    this.logger.log('-------------------------------------------')
    const { offset = 0, limit = 10 } = paginationDto;
    const dataProducts: Product[] = await this.productRepositori.find({
      take: limit,
      skip: offset

    });
    if (dataProducts.length === 0) throw new NotFoundException('No se encontro informacion')
    return dataProducts;

  }

  async findOne(term: string) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Busqueda de un producto por id')
    this.logger.log('-------------------------------------------')
    let dataProduct: Product;

    if (isUUID(term))
      dataProduct = await this.productRepositori.findOneBy({ id: term });

    else {
      dataProduct = await this.productRepositori.findOneBy({ slug: term });
      const queryBuilder = this.productRepositori.createQueryBuilder();
      dataProduct = await queryBuilder
      .where('UPPER(title) =:title or slug=:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne();

    }
    if (!dataProduct)
      throw new NotFoundException(`No se encontro el producto ${term}`);

    return dataProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Actualizacion de un producto')
    this.logger.log('-------------------------------------------')
    const productData = await this.productRepositori.preload({
      id,
      ...updateProductDto
    })
    if (!productData) throw new NotFoundException(`No se encuntro el registro ${id} para realizar la actualizacio`)
    await this.productRepositori.save(productData);
      return `Actualizacion realiza`;
  }

  async remove(id: string) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Eliminacion de un producto')
    this.logger.log('-------------------------------------------')

    const { affected } = await this.productRepositori.delete(id);
    if (affected === 0) throw new NotFoundException(`El registro ${id} no existe`);
    return 'Eliminacion finalizada';

  }


  private handlerException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new InternalServerErrorException('Hey algo salio mal, revisa los logs');
  }
}
