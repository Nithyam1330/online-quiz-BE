import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { CategoryModule } from '../category/category.module';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryProviders } from './sub-category.provider';
import { SubCategoryService } from './sub-category.service';

@Module({
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    ...SubCategoryProviders
  ],
  imports: [
    SharedModule,
    JwtAuthModule,
    CategoryModule
  ]
})
export class SubCategoryModule {}
