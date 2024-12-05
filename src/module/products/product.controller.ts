import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { LoggerService } from 'src/common/scoped/logger.service';
import { ProductDto } from 'src/dto/product.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Product } from 'src/models/product.model';
import { ValidationPipe } from 'src/validation.pipe';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly loggerService: LoggerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProducts(@Req() request: Request): Promise<ResponseData<Product[]>> {
    this.loggerService.log(`Received GET /users request from ${request.ip}`);

    try {
      return new ResponseData<Product[]>(
        await this.productService.getProducts(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch {
      return new ResponseData<Product[]>(
        [],
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  async createProduct(
    @Body(new ValidationPipe()) productDto: ProductDto,
  ): Promise<ResponseData<Product>> {
    try {
      return new ResponseData<Product>(
        plainToClass(
          ProductEntity,
          await this.productService.createProduct(productDto),
        ),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch {
      return new ResponseData<Product>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<ResponseData<Product>> {
    try {
      return new ResponseData<Product>(
        await this.productService.getProduct(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch {
      return new ResponseData<Product>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Put(':id')
  async updateProduct(
    @Body() productDto: ProductDto,
  ): Promise<ResponseData<Product>> {
    try {
      return new ResponseData<Product>(
        await this.productService.updateProduct(productDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch {
      return new ResponseData<Product>(
        null,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    }
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string): ResponseData<boolean> {
    try {
      return new ResponseData<boolean>(
        this.productService.deleteProduct(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch {
      return new ResponseData<boolean>(
        null,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    }
  }
}
