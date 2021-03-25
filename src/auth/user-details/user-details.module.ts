import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { UserDetailProviders } from './user-details.providers';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from '../user/user.module';
import { GenderModule } from 'src/master/gender/gender.module';

@Module({
  providers: [
    UserDetailsService,
    ...UserDetailProviders
  ],
  controllers: [UserDetailsController],
  imports: [SharedModule, UserModule, GenderModule]
})
export class UserDetailsModule { }
