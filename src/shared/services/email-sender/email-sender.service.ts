import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

interface ICredentials {
    username: string;
    password: string;
}
@Injectable()
export class EmailSenderService {
    constructor(private readonly mailerService: MailerService) {

    }
    sendMail(toEmail: string, subjectInput: string, textOtherThanCredentials: string, sendCredentials: ICredentials) {
        this.mailerService.sendMail({
            to: toEmail,
            from: 'svsudowindo@gmail.com',
            subject: subjectInput,
            text: `${textOtherThanCredentials} \nUsername: ${sendCredentials.username} \nPassword: ${sendCredentials.password}`
        }).then(() => { }).catch(() => { })
    }
}
