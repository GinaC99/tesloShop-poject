import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessageressocketModule } from './messageressocket/messageressocket.module';
import { MessageressocketModule } from './messageressocket/messageressocket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // 
      synchronize: true // sincroniza las entidades, en produccion no se deja esto en true
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessageressocketModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
