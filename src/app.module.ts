/* eslint-disable prettier/prettier */
import { CurrentOpeningsModule } from './auth/admin/current-openings/current-openings.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { QuestionsModule } from './auth/admin/questions/questions.module';
import { TechnologyModule } from './auth/admin/technology/technology.module';
import { UserDetailsModule } from './auth/user-details/user-details.module';
import { UserModule } from './auth/user/user.module';
import { GenderModule } from './master/gender/gender.module';
import { RolesModule } from './master/roles/roles.module';
import { SMTP_CONFIG } from './shared/enums/app.properties';
import { ResponseHandlerService } from './shared/services/response-handler/response-handler.service';
import { SharedModule } from './shared/shared.module';
import { ScheduleModule } from './auth/admin/schedule/schedule.module';
import { SubmitModule } from './auth/admin/submit/submit.module';
import { ApplicationsModule } from './auth/admin/applications/applications.module';
import { FeedbackModule } from './auth/admin/feedback/feedback.module';
import { AppController } from './app.controller';
import { ApplicationImageModule } from './auth/application-images/application-images.module';
import { ZoomSignatureService } from './shared/services/zoom-signature/zoom-signature.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    RolesModule,
    SharedModule,
    GenderModule,
    UserModule,
    UserDetailsModule,
    QuestionsModule,
    TechnologyModule,
    CurrentOpeningsModule,
    ScheduleModule,
    SubmitModule,
    ApplicationsModule,
    FeedbackModule,
    ApplicationImageModule,
    MailerModule.forRoot({
      transport: SMTP_CONFIG
    }),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, ResponseHandlerService, ZoomSignatureService],
})
export class AppModule {}
