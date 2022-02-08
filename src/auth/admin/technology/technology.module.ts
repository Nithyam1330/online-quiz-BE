import { forwardRef, Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { CurrentOpeningsModule } from '../current-openings/current-openings.module';
import { TechnologyController } from './technology.controller';
import { TechnologyProviders } from './technology.provider';
import { TechnologyService } from './technology.service';

@Module({
  providers: [
    TechnologyService,
    ...TechnologyProviders
  ],
  controllers: [TechnologyController],
  imports: [forwardRef(() => CurrentOpeningsModule),SharedModule,JwtAuthModule],
  exports: [ TechnologyService,
    ...TechnologyProviders]
})
export class TechnologyModule {}
