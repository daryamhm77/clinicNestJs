import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utility/pagination.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private s3Service: S3Service,
  ) {}
  async create(categoryDto: CreateCategoryDto, image: Express.Multer.File) {
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      'clinic-image',
    );
    const { slug, description, title } = categoryDto;
    const category = await this.findBySlug(slug);
    if (category) throw new ConflictException('already exist category');
    await this.categoryRepository.insert({
      title,
      description,
      slug,
      image: Location,
      imageKey: Key,
    });
    return {
      message: 'Category Created Successfully:)',
    };
  }
  async findAll(pageDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(pageDto.page, pageDto.limit);
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      select: {
        title: true
      },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }
  async findBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }
  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('category not found');
    return category;
  }
  async update(
    updateDto: UpdateCategoryDto,
    image: Express.Multer.File,
    id: number,
  ) {
    const { title, description, slug } = updateDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<CategoryEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        'clinic-image',
      );
      if (Location) {
        updateObject['image'] = Location;
        updateObject['imageKey'] = Key;
        if (category?.imageKey) {
          await this.s3Service.deleteFile(category?.imageKey);
        }
      }
    }
    if (title) updateObject['title'] = title;
    if (description) updateObject['description'] = description;
    if (slug) {
      const category = await this.findBySlug(slug);
      if (category && category.id !== id) {
        throw new ConflictException('this slug is already existed!');
      }
      updateObject['slug'] = slug;
    }
    await this.categoryRepository.update({ id }, updateObject);
    return {
      message: 'updated successfully',
    };
  }
  async remove(id: number) {
    const category = await this.findOneById(id);
    if (category) {
      await this.categoryRepository.delete({ id });
      return {
        message: 'deleted successfully',
      };
    }
  }
}
