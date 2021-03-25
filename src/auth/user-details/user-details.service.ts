import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IGenderDocument } from 'src/master/gender/gener.schema';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { IUserDocument } from '../user/user.schema';
import { UsersDetailsDto } from './user-details.dto';
import { IUserDetailsDocument } from './user-details.schema';

@Injectable()
export class UserDetailsService {
    constructor(
        @Inject(MODAL_ENUMS.USER_DETAILS) private readonly userDetailsModal: Model<IUserDetailsDocument>,
        @Inject(MODAL_ENUMS.USERS) private readonly usersModel: Model<IUserDocument>,
        @Inject(MODAL_ENUMS.GENDER_MODEL) private readonly genderModel: Model<IGenderDocument>) { }

    async updateUserDetails(userDetailsPayload: UsersDetailsDto, userId: string): Promise<UsersDetailsDto> {
        const userProfileDetails = await this.userDetailsModal.find({userId: userId}).exec();
        if (userProfileDetails.length > 0) {
            throw new HttpException('Profile Details already exist you cant creat a new one', HttpStatus.NOT_ACCEPTABLE);
        }
        const userDetails = await this.usersModel.findById(userId).select('-password');
        if (!userDetails) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        const genderDetails = await this.genderModel.find({gender_id: userDetailsPayload.gender_id}).exec();
        if (genderDetails.length<=0) {
            throw new HttpException('Gender Not Found', HttpStatus.NOT_FOUND);
        }
        userDetailsPayload.userId = userId;
        userDetailsPayload.fullName =userDetailsPayload.firstName + ' ' + userDetailsPayload.lastName;
        const userDetailsModel = new this.userDetailsModal(userDetailsPayload);
        return userDetailsModel.save();
    }

    async putUserDetails(userDetailsPayload: UsersDetailsDto, userId: string): Promise<UsersDetailsDto> {
        const userProfileDetails = await this.userDetailsModal.find({userId: userId}).exec();
        if (userProfileDetails.length <= 0) {
            throw new HttpException('Can not update profile details... Profile Not found', HttpStatus.NOT_FOUND);
        }
        const userDetails = await this.usersModel.findById(userId).select('-password');
        if (!userDetails) {
            throw new HttpException('User does Not found', HttpStatus.NOT_FOUND);
        }
        const genderDetails = await this.genderModel.find({gender_id: userDetailsPayload.gender_id}).exec();
        if (genderDetails.length<=0) {
            throw new HttpException('Gender Not Found', HttpStatus.NOT_FOUND);
        }
        userDetailsPayload.fullName =userDetailsPayload.firstName + ' ' + userDetailsPayload.lastName;
        const userProfileUpdated = await this.userDetailsModal.findOneAndUpdate({userId: userId}, userDetailsPayload).exec();
        return userDetailsPayload;
    }

    async getUserDetails(userId: string): Promise<UsersDetailsDto[] | []> {
        const userProfileDetails = await this.userDetailsModal.find({userId: userId}).exec();
        return userProfileDetails;
    }
}
