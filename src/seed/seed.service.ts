import {  Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {

  }

  // async newSeed() {
  //   await this.insertNewProducts()
  //   return `This action returns all seed`;
  // }

  private async insertNewProducts(user:User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.productService.create( product, user ) );
    });

    await Promise.all( insertPromises );

    return true;
  }

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'Insercion del Seed Exitosa'
  }

  private async insertUsers(){
    const seedUser = initialData.users;
    const users: User[] = []
    seedUser.forEach( user => {
      const {password, ...userData} = user
      users.push(this.userRepository.create({...userData, 
        password: bcrypt.hashSync(password, 10)}))
    }) 
    const userData = await this.userRepository.save(users);
    return userData[0];
  }

  private async deleteTables() {

    await this.productService,this.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute()

  }


  async deleteAllProducts() {
    const response = await this.productService.deleteAllProducts()
    const products = initialData.products;

    const insertPromise = []

    // products.forEach(product => {
    //   insertPromise.push(this.productService.create(product, user))

    // })
    await Promise.all(insertPromise);

    return 'Hey se elimino exitosamente todos los registros de la tabla productos'
  }
}
