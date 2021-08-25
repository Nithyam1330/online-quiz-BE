/* eslint-disable prettier/prettier */
import { CurrentOpeningsModule } from './../admin/current-openings/current-openings.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProviders } from './user.provider';
import { SharedModule } from 'src/shared/shared.module';
import { JwtAuthModule } from 'src/shared/services/jwt-auth/jwt-auth.module';

@Module({
  providers: [
    UserService,
    ...UserProviders],
  controllers: [UserController],
  imports: [SharedModule,JwtAuthModule, CurrentOpeningsModule],
  exports: [UserService, ...UserProviders]
})
export class UserModule { }
