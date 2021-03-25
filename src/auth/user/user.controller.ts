import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { ForgotPasswordDto, LoginDTO, ResetPasswordDTO, UsersDto } from './user.dto';
import { UserService } from './user.service';
import { EncryptDecryptService } from 'src/shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { EmailSenderService } from 'src/shared/services/email-sender/email-sender.service';
import { IUserDocument } from './user.schema';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { v4 as uuidv4 } from 'uuid';
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly responseHandler: ResponseHandlerService,
        private readonly encryptDecryptService: EncryptDecryptService,
        private readonly emailService: EmailSenderService) {

    }

    @Post('register')
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
        // const generatedPassword = await this.encryptDecryptService.generateHashing(randomPassword);
        userPayload.password = randomPassword;
        userPayload.uid = uuidv4();
        return this.userService.createUser(userPayload).then((res: IUserDocument) => {
            const obj = res.toObject()
            // delete obj.password;
            return this.responseHandler.successReponseHandler('User Created Succesfully', obj);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @UseGuards(JwtAuthGuard)
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
            // const generatedPassword = await this.encryptDecryptService.generateHashing(randomPassword);
            res['password'] = randomPassword;
            return this.userService.updateUserPassword(res).then((userRes: IUserDocument) => {
                return this.responseHandler.successReponseHandler('Password send to your mail id... Please check', userRes);
            })
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @UseGuards(JwtAuthGuard)
    @Put('reset-password/:id')
    async resetPassword(@Body() resetBody: ResetPasswordDTO, @Param('id') userId: string) {
        return this.userService.resetPassword(resetBody, userId).then((res: IUserDocument) => {
            this.emailService.sendMail(
                res.username,
                'Reset Password',
                'As per Your request we have updated your password');
            return this.responseHandler.successReponseHandler('Reset Password is successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Post('login')
    async login(@Body() loginBody:LoginDTO) {
        return this.userService.login(loginBody).then((res: any) => {
            this.emailService.sendMail(
                res.username,
                'Login Update',
                `You have logged in just now at ${new Date()}`);
                // delete res.password;
            return this.responseHandler.successReponseHandler('Logged in successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
