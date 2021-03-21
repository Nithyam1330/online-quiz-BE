import { Inject, Injectable } from '@nestjs/common';
import {  Model, ObjectId } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { UsersDto } from './user.dto';
import { IUserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(@Inject(MODAL_ENUMS.USERS) private readonly userModel: Model<IUserDocument>) {
    }

    async createUser(userRequest: UsersDto): Promise<IUserDocument> {
        const createdUser = new this.userModel(userRequest);
        return createdUser.save();
    }

    async getUserByUserID(userId: string) {
        const userDetails = this.userModel.findById(userId).exec();
        return userDetails;
    }
}
