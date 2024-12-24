import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductDto } from '../../dto/product.dto';
import { ResponseData } from '../../global/globalClass';
import { HttpMessage, HttpStatus } from '../../global/globalEnum';
import { Product } from 'src/models/product.model';
import { JwtAuthGuard } from '../../module/auth/jwt-auth.guard';
import { ValidationPipe } from '../../validation.pipe';
import { LoggerService } from '../../common/scoped/logger.service';
import { RolesGuard } from '../auth/roles.guard';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  @CacheTTL(5) // TTL 120 giây cho route này
  @CacheKey('products') // Key 'all_products' cho dữ liệu cache
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<
    ResponseData<{
      data: ProductEntity[];
      total: number;
      page: number;
      limit: number; // TODO: modeling response data
    }>
  > {
    const products = await this.productService.getProducts(page, limit);
    return new ResponseData<{
      data: ProductEntity[];
      total: number;
      page: number;
      limit: number;
    }>(products, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(new Error('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async createProduct(
    @Body(new ValidationPipe()) productDto: ProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ResponseData<Product>> {
    if (image) {
      productDto = {
        ...productDto,
        image: image.filename,
        price: Number(productDto.price),
      };
    }

    return new ResponseData<Product>(
      plainToClass(
        ProductEntity,
        await this.productService.createProduct(productDto),
      ),
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseData<Product>> {
    console.log('get product', id);

    return new ResponseData<Product>(
      await this.productService.getProduct(id),
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @Put(':id')
  async updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() productDto: ProductDto,
  ): Promise<ResponseData<Product>> {
    return new ResponseData<Product>(
      await this.productService.updateProduct(id, productDto),
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<ResponseData<boolean>> {
    await this.productService.deleteProduct(id);
    return new ResponseData<boolean>(
      true,
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS,
    );
  }
}
