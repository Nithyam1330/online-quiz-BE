import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {  Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { EncryptDecryptService } from 'src/shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { JwtAuthService } from 'src/shared/services/jwt-auth/jwt-auth.service';
import { ForgotPasswordDto, LoginDTO, ResetPasswordDTO, UsersDto } from './user.dto';
import { IUserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @Inject(MODAL_ENUMS.USERS) private readonly userModel: Model<IUserDocument>,
        private readonly encryptDecryptService: EncryptDecryptService,
        private jwtAuthService: JwtAuthService) {
    }

    async createUser(userRequest: UsersDto): Promise<IUserDocument> {
        const createdUser = new this.userModel(userRequest);
        return createdUser.save();
    }

    async getUserByUserID(userId: string): Promise<IUserDocument> {
        const userDetails = this.userModel.findById(userId).select('-password');
        if (!userDetails) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return userDetails;
    }

    async forgotPassword(forgotPassword: ForgotPasswordDto): Promise<IUserDocument | NotFoundException> {
        const userDetails = await this.userModel.findOne({ username: forgotPassword.username });
        if (!userDetails) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return userDetails;
    }

    async updateUserPassword(recordPayload: UsersDto): Promise<UsersDto> {
        const userDetails = await this.userModel.findByIdAndUpdate({ _id: recordPayload._id }, { password: recordPayload.password });
        if (!userDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return recordPayload;
    }

    async resetPassword(resetPayload: ResetPasswordDTO, userId: string): Promise<IUserDocument> {
        if (resetPayload.newPassword !== resetPayload.confirmPassword) {
            throw new HttpException('New password and confirm password are not matching each other', HttpStatus.NOT_ACCEPTABLE);
        }
        const userDetails = await this.userModel.findById(userId).exec();
        if (!userDetails) {
            throw new HttpException('No user found', HttpStatus.NOT_FOUND);
        }
        // const isBothPasswordSame = await this.encryptDecryptService.comparePasswords(resetPayload.oldPassword, userDetails.password);
        const isBothPasswordSame = resetPayload.oldPassword === userDetails.password;
        if (!isBothPasswordSame) {
            throw new HttpException('Existing Password Does not match', HttpStatus.NOT_ACCEPTABLE);
        }
        // const encryptedPassword = await this.encryptDecryptService.generateHashing(resetPayload.newPassword);
        const resetPasswordDetails = this.userModel.findByIdAndUpdate(userId, { password: resetPayload.newPassword });
        if (!resetPasswordDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return resetPasswordDetails;
    }


    async login(loginPayload: LoginDTO): Promise<any> {
        const userDetails = await this.userModel.find({username: loginPayload.username});
        if (userDetails.length <= 0) {
            throw new HttpException('Invalid User credentials', HttpStatus.UNAUTHORIZED);
        }
        // const isPasswordMatches = await this.encryptDecryptService.comparePasswords(loginPayload.password ,userDetails[0].password);
        const isPasswordMatches = loginPayload.password === userDetails[0].password;
        if (!isPasswordMatches) {
            throw new HttpException('Invalid User credentials', HttpStatus.UNAUTHORIZED);
        }
        const authToken = await this.jwtAuthService.generateJWT(loginPayload);
        const userWithAuthToken = {...userDetails[0].toObject(), ...authToken};
        return userWithAuthToken;
    }
}
