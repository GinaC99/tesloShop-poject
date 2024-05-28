import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }))

  const config = new DocumentBuilder()
    .setTitle('Prueba documentacion Nest')
    .setDescription('Uso de nest con TypeScript, implementando las buenas practicas')
    .setVersion('1.0.0')
    .addTag('nest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document)

  await app.listen(process.env.PORT);
}
bootstrap();
