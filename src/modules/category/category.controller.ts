import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { FormType } from 'src/common/enum/form-type.enum';
import { ApiConsumes } from '@nestjs/swagger';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(UploadFileS3('image'))
  @ApiConsumes(FormType.Multipart)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get()
  @Pagination()
  findAll(@Query() pagination: PaginationDto) {
    return this.categoryService.findAll(pagination);
  }
  @Get('/by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Patch(':id')
  @UseInterceptors(UploadFileS3('image'))
  @ApiConsumes(FormType.Multipart)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.categoryService.update(updateCategoryDto, image, id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
