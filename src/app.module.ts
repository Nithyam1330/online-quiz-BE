import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './auth/admin/category/category.module';
import { SubCategoryModule } from './auth/admin/sub-category/sub-category.module';
import { UserDetailsModule } from './auth/user-details/user-details.module';
import { UserModule } from './auth/user/user.module';
import { GenderModule } from './master/gender/gender.module';
import { RolesModule } from './master/roles/roles.module';
import { SMTP_CONFIG } from './shared/enums/app.properties';
import { ResponseHandlerService } from './shared/services/response-handler/response-handler.service';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [
    RolesModule,
    SharedModule,
    GenderModule,
    UserModule,
    UserDetailsModule,
    // CategoryModule,
    // SubCategoryModule,
    MailerModule.forRoot({
      transport: SMTP_CONFIG
    })
  ],
  controllers: [AppController],
  providers: [AppService, ResponseHandlerService],
})
export class AppModule {}
