import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const app_name = configService.get('app_name');

  //swagger setup
  const options = new DocumentBuilder()
    .setTitle('Fetching data API')
    .setDescription('API for fetching data')
    .setVersion('1.0.0')
    .addTag('fetch-data')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(app_name, app, document);

  const port = configService.get('port');
  // app.setGlobalPrefix(app_name);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
