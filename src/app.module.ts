import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ClinicModule } from './modules/clinic/clinic.module';
import { CategoryModule } from './modules/category/category.module';
import { S3Module } from './modules/s3/s3.module';
// import { PlannerModule } from './planner/planner.module';
// import { PlannerModule } from './modules/planner/planner.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'doriskick',
      database: 'clinic',
      autoLoadEntities: false,
      synchronize: false,
      entities: [
        'dist/**/**/**/*.entity{.ts,.js}',
        'dist/**/**/*.entity{.ts,.js}',
      ],
    }),
    AuthModule,
    ClinicModule,
    CategoryModule,
    S3Module,
    // PlannerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
