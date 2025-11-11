import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser.default());


app.enableCors({
   credentials: true,
    allowHeaders: [
      "Origin",
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Requested-With",
      "X-Request-ID",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    origin: ['http://localhost:3001', 'https://your-frontend-domain.com'], 
});


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
