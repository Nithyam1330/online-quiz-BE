import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { FeedbackProviders } from './feedback.provider';
import { UserModule } from 'src/auth/user/user.module';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  providers: [
    FeedbackService,
    ...FeedbackProviders
  ],
  controllers: [FeedbackController],
  imports: [SharedModule,JwtAuthModule, UserModule, ApplicationsModule],
  exports: [ FeedbackService,
    ...FeedbackProviders]
})
export class FeedbackModule {}