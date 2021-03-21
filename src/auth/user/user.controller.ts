import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { UsersDto } from './user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { EncryptDecryptService } from 'src/shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { EmailSenderService } from 'src/shared/services/email-sender/email-sender.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly responseHandler: ResponseHandlerService,
        private readonly encryptDecryptService: EncryptDecryptService,
        private readonly emailService: EmailSenderService) {

    }

    @Post('')
    async createUser(@Body() userPayload: UsersDto) {
        const randomPassword = this.encryptDecryptService.generateRandomPassword();
        console.log('random password', randomPassword);
        this.emailService.sendMail(
            userPayload.username,
            'Registration with Meat',
            'Use the below login details',
            {
                username: userPayload.username,
                password: randomPassword
            });
        const generatedPassword = await this.encryptDecryptService.generateHashing(randomPassword);
        console.log('generated hash password', generatedPassword);
        userPayload.password = generatedPassword;
        // return;
        return this.userService.createUser(userPayload).then((res: UsersDto) => {
            return this.responseHandler.successReponseHandler('User Created Succesfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id')
    async getUserByUserID(@Param('id') userId: string) {
        return this.userService.getUserByUserID(userId).then((res: UsersDto) => {
            return this.responseHandler.successReponseHandler('Get User details is succesful', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
