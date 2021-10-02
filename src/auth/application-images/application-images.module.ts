/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';
import { ApplicationImageService } from './application-images.service';
import { ApplicationImageProviders } from './application-images.provider';
import { ApplicationImagesController } from './application-images.controller';
import { ApplicationsModule } from '../admin/applications/applications.module';

@Module({
    providers: [
        ApplicationImageService,
        ...ApplicationImageProviders
    ],
    controllers: [ApplicationImagesController],
    imports: [SharedModule, JwtAuthModule, ApplicationsModule],
    exports: [ApplicationImageService, ...ApplicationImageProviders]
})
export class ApplicationImageModule { }
