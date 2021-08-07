import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { QuestionsController } from './questions.controller';
import { QuestionsProviders } from './questions.provider';
import { QuestionsService } from './questions.service';

@Module({
  providers: [
    QuestionsService,
    ...QuestionsProviders
  ],
  controllers: [QuestionsController],
  imports: [SharedModule,JwtAuthModule],
  exports: [ QuestionsService,
    ...QuestionsProviders]
})
export class QuestionsModule {}
