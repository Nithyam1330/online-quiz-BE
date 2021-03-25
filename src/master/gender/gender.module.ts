import { Module } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';
import { GenderProviders } from './gender.provider';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  providers: [
    GenderService,
    ...GenderProviders
  ],
  controllers: [GenderController],
  imports: [SharedModule],
  exports: [GenderService, ...GenderProviders]
})
export class GenderModule {}
