import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryProviders } from './category.provider';
import { SharedModule } from 'src/shared/shared.module';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';

@Module({
  providers: [
    CategoryService,
    ...CategoryProviders
  ],
  controllers: [CategoryController],
  imports: [SharedModule,JwtAuthModule]
})
export class CategoryModule { }
