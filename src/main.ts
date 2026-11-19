import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration for Swagger
  const config = new DocumentBuilder()
    .setTitle('STEPS Public AI APIs')
    .setDescription('STEPS Public AI APIs - AI capabilities for problem solving')
    .setVersion('1.0')
    .addTag('AI')
    .addTag('Prompts')
    .addBearerAuth(undefined, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const configService = app.get(ConfigService);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
