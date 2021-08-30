import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationsProviders } from './applications.provider';
import { CurrentOpeningsModule } from '../current-openings/current-openings.module';

@Module({
    controllers: [ApplicationsController],
    providers: [
        ApplicationsService,
        ...ApplicationsProviders
    ],
    imports: [
        SharedModule,
        JwtAuthModule,
        ApplicationsModule,
        CurrentOpeningsModule
    ],
    exports: [
        ApplicationsService,
        ...ApplicationsProviders
    ]
})
export class ApplicationsModule {}
