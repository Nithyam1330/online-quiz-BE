import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EmailSenderService } from './services/email-sender/email-sender.service';
import { EncryptDecryptService } from './services/encrypt-decrypt/encrypt-decrypt.service';
import { ResponseHandlerService } from './services/response-handler/response-handler.service';

@Module({
    imports: [DatabaseModule],
    providers: [ResponseHandlerService, EncryptDecryptService, EmailSenderService],
    exports: [ResponseHandlerService, DatabaseModule, EncryptDecryptService, EmailSenderService]
})
export class SharedModule {}
