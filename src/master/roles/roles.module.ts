import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RolesController } from './roles.controller';
import { RolesProviders } from './roles.providers';
import { RolesService } from './roles.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    RolesService,
    ...RolesProviders
  ],
  controllers: [
    RolesController
  ]
})
export class RolesModule {}
