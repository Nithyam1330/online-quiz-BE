import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { ForgotPasswordDto, ResetPasswordDTO, UsersDto } from './user.dto';
import { UserService } from './user.service';
import { EncryptDecryptService } from 'src/shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { EmailSenderService } from 'src/shared/services/email-sender/email-sender.service';
import { IUserDocument } from './user.schema';

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
        this.emailService.sendMail(
            userPayload.username,
            'Registration with Meat',
            'Use the below login details',
            {
                username: userPayload.username,
                password: randomPassword
            });
        const generatedPassword = await this.encryptDecryptService.generateHashing(randomPassword);
        userPayload.password = generatedPassword;
        return this.userService.createUser(userPayload).then((res: IUserDocument) => {
            const obj = res.toObject()
            delete obj.password;
            return this.responseHandler.successReponseHandler('User Created Succesfully', obj);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id')
    async getUserByUserID(@Param('id') userId: string) {
        return this.userService.getUserByUserID(userId).then((res: IUserDocument) => {
            delete res.password;
            return this.responseHandler.successReponseHandler('Get User details is succesful', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put('forgot-password')
    async forgotPassword(@Body() passwordBody: ForgotPasswordDto) {
        return await this.userService.forgotPassword(passwordBody).then(async (res: IUserDocument) => {
            const randomPassword = this.encryptDecryptService.generateRandomPassword();
            this.emailService.sendMail(
                passwordBody.username,
                'Your New password',
                'As per Your request we have updated your password: Please use below credentials',
                {
                    username: passwordBody.username,
                    password: randomPassword
                });
            const generatedPassword = await this.encryptDecryptService.generateHashing(randomPassword);
            res['password'] = generatedPassword;
            return this.userService.updateUserPassword(res).then((userRes: IUserDocument) => {
                return this.responseHandler.successReponseHandler('Password send to your mail id... Please check', userRes);
            })
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put('reset-password/:id')
    async resetPassword(@Body() passwordBody: ResetPasswordDTO, @Param('id') userId: string) {
        return this.userService.resetPassword(passwordBody, userId).then((res: IUserDocument) => {
            this.emailService.sendMail(
                res.username,
                'Reset Password',
                'As per Your request we have updated your password');
                delete res.password;
            return this.responseHandler.successReponseHandler('Reset Password is successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
