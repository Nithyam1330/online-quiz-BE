import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../../../shared/services/jwt-auth/jwt-auth.module';
import { SharedModule } from '../../../shared/shared.module';
import { CurrentOpeningsModule } from '../current-openings/current-openings.module';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleProviders } from './schedule.provider';
import { ScheduleService } from './schedule.service';

@Module({
  providers: [
    ScheduleService,
    ...ScheduleProviders
  ],
  controllers: [ScheduleController],
  imports: [SharedModule,JwtAuthModule, CurrentOpeningsModule],
  exports: [ ScheduleService,
    ...ScheduleProviders]
})
export class ScheduleModule {}