import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

    // Enable global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Enable global validation
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false,
        validationError: { target: false },
      }),
    );

    // Enable CORS
    app.enableCors();

    // Swagger/OpenAPI Configuration
    const config = new DocumentBuilder()
      .setTitle('Kapal Lawd Articles API')
      .setDescription(
        'A comprehensive NestJS API with JWT authentication, user management, articles, and comments',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .addTag('Authentication', 'User authentication and authorization')
      .addTag('Users', 'User management operations')
      .addTag('Articles', 'Article CRUD operations')
      .addTag('Comments', 'Comment management operations')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'Kapal Lawd Articles API Documentation',
    });

    const port = process.env.PORT || 3005;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(
      `Swagger documentation available at: http://localhost:${port}/api/docs`,
    );
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}
void bootstrap();
