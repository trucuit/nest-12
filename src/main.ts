import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { AuthGuard } from './guard/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalGuards(new AuthGuard());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
