import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { exception } from 'console';
import { Error, Model, ObjectId } from 'mongoose';
import { throwError } from 'rxjs';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { MONGO_ERROR_TYPES } from 'src/shared/enums/mongodb.errors';
import { EncryptDecryptService } from 'src/shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { ForgotPasswordDto, ResetPasswordDTO, UsersDto } from './user.dto';
import { IUserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @Inject(MODAL_ENUMS.USERS) private readonly userModel: Model<IUserDocument>,
        private readonly encryptDecryptService: EncryptDecryptService) {
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
        const userDetails = await this.userModel.findOne({ username: forgotPassword.username }).select('-password');
        if (!userDetails) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return userDetails;
    }

    async updateUserPassword(recordPayload: UsersDto): Promise<IUserDocument> {
        const userDetails = await this.userModel.findByIdAndUpdate({ _id: recordPayload._id }, { password: recordPayload.password }).select('-password');
        if (!userDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return userDetails;
    }

    async resetPassword(resetPayload: ResetPasswordDTO, userId: string): Promise<IUserDocument> {
        if (resetPayload.newPassword !== resetPayload.confirmPassword) {
            throw new HttpException('New password and confirm password are not matching each other', HttpStatus.NOT_ACCEPTABLE);
        }
        const userDetails = await this.userModel.findById(userId).exec();
        if (!userDetails) {
            throw new HttpException('No user found', HttpStatus.NOT_FOUND);
        }
        const isBothPasswordSame = await this.encryptDecryptService.comparePasswords(resetPayload.oldPassword, userDetails.password);
        if (!isBothPasswordSame) {
            throw new HttpException('Existing Password Does not match', HttpStatus.NOT_ACCEPTABLE);
        }
        const encryptedPassword = await this.encryptDecryptService.generateHashing(resetPayload.newPassword);
        const resetPasswordDetails = this.userModel.findByIdAndUpdate(userId, { password: encryptedPassword }).select('-password');
        if (!resetPasswordDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return resetPasswordDetails;
    }
}
