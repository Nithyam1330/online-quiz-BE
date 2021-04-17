import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IGenderDocument } from 'src/master/gender/gener.schema';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { EncryptDecryptService } from 'src/shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { IUserDocument } from '../user/user.schema';
import { AddressDTO, UsersDetailsDto } from './user-details.dto';
import { IUserDetailsDocument } from './user-details.schema';

@Injectable()
export class UserDetailsService {
    constructor(
        @Inject(MODAL_ENUMS.USER_DETAILS) private readonly userDetailsModal: Model<IUserDetailsDocument>,
        @Inject(MODAL_ENUMS.USERS) private readonly usersModel: Model<IUserDocument>,
        @Inject(MODAL_ENUMS.GENDER_MODEL) private readonly genderModel: Model<IGenderDocument>,
        private readonly encryptDecryptService: EncryptDecryptService) { }

    async updateUserDetails(userDetailsPayload: UsersDetailsDto, userId: string): Promise<UsersDetailsDto> {
        const userProfileDetails = await this.userDetailsModal.find({ userId: userId }).exec();
        if (userProfileDetails.length > 0) {
            throw new HttpException('Profile Details already exist you cant creat a new one', HttpStatus.NOT_ACCEPTABLE);
        }
        const userDetails = await this.usersModel.findById(userId).select('-password');
        if (!userDetails) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        const genderDetails = await this.genderModel.find({ gender_id: userDetailsPayload.gender_id }).exec();
        if (genderDetails.length <= 0) {
            throw new HttpException('Gender Not Found', HttpStatus.NOT_FOUND);
        }
        userDetailsPayload.userId = userId;
        userDetailsPayload.fullName = userDetailsPayload.firstName + ' ' + userDetailsPayload.lastName;
        const userDetailsModel = new this.userDetailsModal(userDetailsPayload);
        return userDetailsModel.save();
    }

    async putUserDetails(userDetailsPayload: UsersDetailsDto, userId: string): Promise<UsersDetailsDto> {
        const userProfileDetails = await this.userDetailsModal.find({ userId: userId }).exec();
        if (userProfileDetails.length <= 0) {
            throw new HttpException('Can not update profile details... Profile Not found', HttpStatus.NOT_FOUND);
        }
        const userDetails = await this.usersModel.findById(userId).select('-password');
        if (!userDetails) {
            throw new HttpException('User does Not found', HttpStatus.NOT_FOUND);
        }
        const genderDetails = await this.genderModel.find({ gender_id: userDetailsPayload.gender_id }).exec();
        if (genderDetails.length <= 0) {
            throw new HttpException('Gender Not Found', HttpStatus.NOT_FOUND);
        }
        userDetailsPayload.fullName = userDetailsPayload.firstName + ' ' + userDetailsPayload.lastName;
        const userProfileUpdated = await this.userDetailsModal.findOneAndUpdate({ userId: userId }, userDetailsPayload).exec();
        return userDetailsPayload;
    }

    async getUserDetails(userId: string): Promise<UsersDetailsDto[] | []> {
        const userProfileDetails = await this.userDetailsModal.find({ userId: userId }).exec();
        return userProfileDetails;
    }

    async addAddress(userId: string, addressBody: AddressDTO) {
        addressBody['address_id'] = this.encryptDecryptService.generateRandomPassword();
        const userProfileDetails = await this.userDetailsModal.findOneAndUpdate({ userId: userId }, { "$push": { addresses: addressBody } }).exec();
        if (!userProfileDetails) {
            throw new HttpException('Did not modified .. Please check', HttpStatus.NOT_MODIFIED);
        }
        return addressBody;
    }

    async getAllAddress(userId: string): Promise<AddressDTO[] | []> {
        const allAddress = await this.userDetailsModal.find({ userId: userId }).select("addresses");
        if (allAddress.length <= 0) {
            throw new HttpException('No Records found', HttpStatus.NOT_FOUND);
        }
        return allAddress[0].addresses;
    }

    async getAddressByAddressID(userId: string, address_id: string): Promise<AddressDTO> {
        const allAddress = await this.userDetailsModal.aggregate([
            { $match: { 'addresses.address_id': address_id } },
            {
                $project: {
                    addresses: {
                        $filter: {
                            input: "$addresses",
                            as: "addresses",
                            cond: { $eq: ["$$addresses.address_id", address_id] }
                        }
                    }
                }
            }
        ])
        if (!allAddress.length || !allAddress[0].addresses || !allAddress[0].addresses.length) {
            throw new HttpException('No Records found', HttpStatus.NOT_FOUND);
        }
        return allAddress[0].addresses[0];
    }

    async updateAddressByIndex(userId: string, address_id: string, addressPayload: AddressDTO): Promise<AddressDTO> {
        addressPayload['address_id'] = address_id
        const allAddress = await this.userDetailsModal.findOneAndUpdate(
            {
                userId: userId,
                addresses: {
                    $elemMatch: {
                        address_id: {
                            $eq: address_id
                        }
                    }
                }
            },
            {
                $set: {
                    "addresses.$": addressPayload
                }
            });
        if (!allAddress) {
            throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED);
        }
        if (allAddress.addresses.length <= 0) {
            throw new HttpException('No Addresses found', HttpStatus.NOT_FOUND);
        }

        return addressPayload;
    }

    async deleteAddressByAddressID(userId: string, address_id: string) {
        const allAddress = await this.userDetailsModal.findOneAndUpdate(
            {
                userId: userId,
            },
            {
                $pull: {
                    addresses: {
                        address_id: {
                            $eq: address_id
                        }
                    }
                }
            });
        if (!allAddress) {
            throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED);
        }
        const result = await this.getAllAddress(userId);
        return result;
    }
}
