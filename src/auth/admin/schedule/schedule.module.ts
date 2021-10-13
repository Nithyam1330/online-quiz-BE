/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserDetailsModule } from 'src/auth/user-details/user-details.module';
import { JwtAuthModule } from '../../../shared/services/jwt-auth/jwt-auth.module';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationsModule } from '../applications/applications.module';
import { CurrentOpeningsModule } from '../current-openings/current-openings.module';
import { QuestionsModule } from '../questions/questions.module';
import { SubmitModule } from '../submit/submit.module';
import { TechnologyModule } from '../technology/technology.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleProviders } from './schedule.provider';
import { ScheduleService } from './schedule.service';
import { UserModule } from './../../user/user.module';

@Module({
  providers: [
    ScheduleService,
    ...ScheduleProviders
  ],
  controllers: [ScheduleController],
  imports: [
    SharedModule,
    JwtAuthModule,
    CurrentOpeningsModule,
    SubmitModule,
    QuestionsModule,
    TechnologyModule,
  ApplicationsModule,
  UserModule
],
  exports: [ ScheduleService,
    ...ScheduleProviders]
})
export class ScheduleModule {}
