import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicEntity } from './entities/clinic.entity';
import { OtpEntity } from '../auth/entity/otp.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from '../s3/s3.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    TypeOrmModule.forFeature([ClinicEntity, OtpEntity, CategoryEntity]),
  ],
  controllers: [ClinicController],
  providers: [ClinicService, CategoryService, JwtService, S3Service],
  exports: [ClinicService, JwtService, TypeOrmModule, S3Service],
})
export class ClinicModule {}
