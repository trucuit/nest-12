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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoggerService } from 'src/common/scoped/logger.service';
import { ProductDto } from 'src/dto/product.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Product } from 'src/models/product.model';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';
import { ValidationPipe } from 'src/validation.pipe';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // Bảo vệ toàn bộ controller bằng xác thực JWT và RolesGuard
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly loggerService: LoggerService,
  ) {}

  @Roles('admin')
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

  @Roles('admin')
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
    try {
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
  async getProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseData<Product>> {
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() productDto: ProductDto,
  ): Promise<ResponseData<Product>> {
    try {
      return new ResponseData<Product>(
        await this.productService.updateProduct(id, productDto),
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
  async deleteProduct(@Param('id') id: string): Promise<ResponseData<boolean>> {
    try {
      await this.productService.deleteProduct(id);
      return new ResponseData<boolean>(
        true,
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
