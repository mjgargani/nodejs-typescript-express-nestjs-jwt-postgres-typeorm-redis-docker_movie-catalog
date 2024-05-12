import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Movie Catalog API')
    .setDescription('Movie Catalog CRUD API with JWT authentication')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.getOrThrow<number>('PORT') || 3000);
}
bootstrap();
