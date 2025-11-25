import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import { WinstonLogger } from './common/logger/winston-logger.provider';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new WinstonLogger(),
    });
    app.useGlobalFilters(new AllExceptionsFilter());

    const config = new DocumentBuilder()
        .setTitle('Orders API')
        .setDescription('API documentation for Users, Orders, and Organizations')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
