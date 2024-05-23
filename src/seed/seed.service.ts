import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ) {

  }

  async newSeed() {
    await this.insertNewProducts()
    return `This action returns all seed`;
  }

  private async insertNewProducts() {

  }

  async deleteAllProducts() {
    const response = await this.productService.deleteAllProducts()
    const products = initialData.products;

    const insertPromise = []

    products.forEach(product => {
      insertPromise.push(this.productService.create(product))

    })
    await Promise.all(insertPromise);

    return 'Hey se elimino exitosamente todos los registros de la tabla productos'
  }
}
