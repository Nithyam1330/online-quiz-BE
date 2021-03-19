import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './master/roles/roles.module';
import { ResponseHandlerService } from './shared/services/response-handler/response-handler.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [DatabaseModule, RolesModule, SharedModule],
  controllers: [AppController],
  providers: [AppService, ResponseHandlerService],
})
export class AppModule {}
