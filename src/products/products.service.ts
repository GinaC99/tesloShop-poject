import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepositori: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly prodcutImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Creacion del producto')
    this.logger.log('-------------------------------------------')
    try {
      const { image = [], ...productDetails } = createProductDto;
      const product = this.productRepositori.create({
        ...productDetails,
        image: image.map(image => this.prodcutImageRepository.create({ url: image }))
      });
      await this.productRepositori.save(product);
      return { ...product, image };
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
      skip: offset,
      relations: {
        image: true
      }

    });
    if (dataProducts.length === 0) throw new NotFoundException('No se encontro informacion')
    return dataProducts.map(({ image, ...products }) => ({
      ...products, image: image.map(({ url }) => url)
    }));

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
      const queryBuilder = this.productRepositori.createQueryBuilder('prod'); // createQueryBuilder('prod'), esto es para crear un alias
      dataProduct = await queryBuilder
        .where('UPPER(title) =:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        })
        .leftJoinAndSelect('prod.image', 'prodImages')
        .getOne();

    }
    if (!dataProduct)
      throw new NotFoundException(`No se encontro el producto ${term}`);

    return dataProduct;
  }

  async findOneClean(term: string) {
    const { image = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      image: image.map(({ url }) => url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Actualizacion de un producto')
    this.logger.log('-------------------------------------------')

    const { image = [], ...toUpdate } = updateProductDto;


    // !! Esta parte no carga las relaciones
    const productData = await this.productRepositori.preload({
      id,
      ...toUpdate
    })
    if (!productData) throw new NotFoundException(`No se encuntro el registro ${id} para realizar la actualizacio`)

    // Create query runner
    // !! El query runner lo utilizo para devolver las transacciones realizadas en bd
    // !! Queda pendiente investigar hacerca del TYPEORM y el qury runner para interiozar los conceptos
    const queryRuner = this.dataSource.createQueryRunner()
    await queryRuner.connect();
    await queryRuner.startTransaction();



    try {
      if (image) {
        await queryRuner.manager.delete(ProductImage, {
          product: { id } // id del producto, esta es la relacion del product
        })
        productData.image = image.map(image => this.prodcutImageRepository.create({url: image}))
      }

      await queryRuner.manager.save(productData)
      await queryRuner.commitTransaction()
      await queryRuner.release()
      // await this.productRepositori.save(productData);
      return this.findOneClean(id);

    } catch (error) {
      await queryRuner.rollbackTransaction()
      await queryRuner.release()
      this.handlerException(error)
    }

  }

  async remove(id: string) {
    this.logger.log('-------------------------------------------')
    this.logger.log('Eliminacion de un producto')
    this.logger.log('-------------------------------------------')

    const { affected } = await this.productRepositori.delete(id);
    if (affected === 0) throw new NotFoundException(`El registro ${id} no existe`);
    return 'Eliminacion finalizada';

  }
  async deleteAllProducts(){
    const query = this.productRepositori.createQueryBuilder('product')
    try {
      
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handlerException(error);
    }
  }

  private handlerException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new InternalServerErrorException('Hey algo salio mal, revisa los logs');
  }
}
