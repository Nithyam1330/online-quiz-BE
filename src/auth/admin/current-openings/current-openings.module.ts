import { TechnologyModule } from './../technology/technology.module';
import { CurrentOpeningsProviders } from './current-openings.provider';
import { CurrentOpeningsService } from './current-openings.service';
import { CurrentOpeningsController } from './current-openings.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';

@Module({
    controllers: [CurrentOpeningsController],
    providers: [
        CurrentOpeningsService,
        ...CurrentOpeningsProviders
    ],
    imports: [
        SharedModule,
        JwtAuthModule,
        TechnologyModule
    ],
    exports: [
        CurrentOpeningsService,
        ...CurrentOpeningsProviders
    ]
})
export class CurrentOpeningsModule { }
