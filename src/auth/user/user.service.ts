import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { exception } from 'console';
import {  Error, Model, ObjectId } from 'mongoose';
import { throwError } from 'rxjs';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { MONGO_ERROR_TYPES } from 'src/shared/enums/mongodb.errors';
import { ForgotPasswordDto, UsersDto } from './user.dto';
import { IUserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(@Inject(MODAL_ENUMS.USERS) private readonly userModel: Model<IUserDocument>) {
    }

    async createUser(userRequest: UsersDto): Promise<IUserDocument> {
        const createdUser = new this.userModel(userRequest);
        return createdUser.save();
    }

    async getUserByUserID(userId: string): Promise<IUserDocument> {
        const userDetails = this.userModel.findById(userId).exec();
        if(!userDetails){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return userDetails;
    }

    async forgotPassword(forgotPassword: ForgotPasswordDto): Promise<IUserDocument | NotFoundException> {
        const userDetails = await this.userModel.findOne({username: forgotPassword.username}).exec();
        if(!userDetails) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return userDetails;
    }

    async updateUserPassword(recordPayload: UsersDto): Promise<IUserDocument> {
        const userDetails = await this.userModel.findOneAndUpdate({_id: recordPayload._id}, {password: recordPayload.password}).exec();
        if(!userDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return userDetails;
    }
}
