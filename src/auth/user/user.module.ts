import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProviders } from './user.provider';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  providers: [
    UserService,
  ...UserProviders],
  controllers: [UserController],
  imports: [SharedModule]
})
export class UserModule {}
