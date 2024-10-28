import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Keys } from './common/env/env';
import { SwaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(Keys.COOKIE_SECRET));
  SwaggerConfigInit(app);
  await app.listen(3000, () => {
    console.log('http://localhost:3000');
    console.log(`swagger: http://localhost:/swagger`);
  });
}
bootstrap();
