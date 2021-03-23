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
  imports: [SharedModule,JwtAuthModule],
  exports: [UserService]
})
export class UserModule { }
