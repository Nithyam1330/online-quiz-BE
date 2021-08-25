import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { CurrentOpeningsModule } from '../current-openings/current-openings.module';
import { QuestionsModule } from '../questions/questions.module';
import { SubmitController } from './submit.controller';
import { SubmitProviders } from './submit.provider';
import { SubmitService } from './submit.service';

@Module({
  providers: [
    SubmitService,
    ...SubmitProviders
  ],
  controllers: [SubmitController],
  imports: [SharedModule,JwtAuthModule, CurrentOpeningsModule, QuestionsModule],
  exports: [ SubmitService,
    ...SubmitProviders]
})
export class SubmitModule {}
