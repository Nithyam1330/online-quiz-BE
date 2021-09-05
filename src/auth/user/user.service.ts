/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { JwtAuthService } from 'src/shared/services/jwt-auth/jwt-auth.service';
import { Utils } from 'src/shared/services/Utils/Utils';
import { ForgotPasswordDto, LoginDTO, ResetPasswordDTO, UsersDto, UpdateUsersDto } from './user.dto';
import { IUserDocument } from './user.schema';


@Injectable()
export class UserService {
    constructor(
        @Inject(MODAL_ENUMS.USERS) private readonly userModel: Model<IUserDocument>,
        private jwtAuthService: JwtAuthService
    ) {
    }

    async createUser(userRequest: UsersDto): Promise<IUserDocument | UnprocessableEntityException> {
        try {
            if (userRequest.password !== userRequest.confirmPassword) {
                throw new HttpException('Password and confirm password shoud be equal', HttpStatus.NOT_ACCEPTABLE);
            }
            const createdUser = new this.userModel(userRequest);
            return createdUser.save();
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getUserByUserID(userId: string): Promise<IUserDocument | UnprocessableEntityException> {
        try {
            const userDetails = this.userModel.findById(userId).select('-password');
            if (!userDetails) {
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);
            }
            return userDetails;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async forgotPassword(forgotPassword: ForgotPasswordDto): Promise<IUserDocument | NotFoundException | UnprocessableEntityException> {
        try {
            const userDetails = await this.userModel.findOne({ email: forgotPassword.email });
            if (!userDetails) {
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);
            }
            return userDetails;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async updateUserPassword(recordPayload: UsersDto): Promise<UsersDto | UnprocessableEntityException> {
        try {
            const userDetails = await this.userModel.findByIdAndUpdate({ _id: recordPayload._id }, { password: recordPayload.password });
            if (!userDetails) {
                throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
            }
            return recordPayload;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async resetPassword(resetPayload: ResetPasswordDTO, userId: string): Promise<IUserDocument | UnprocessableEntityException> {
        try {
            if (!Utils.isValidInput(resetPayload.newPassword) || !Utils.isValidInput(resetPayload.confirmPassword)) {
                throw new HttpException('New password and confirm password are mandatory and required', HttpStatus.NOT_ACCEPTABLE);
            }
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
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }


    }


    async login(loginPayload: LoginDTO): Promise<any | UnprocessableEntityException> {
        try {
            const userDetails = await this.userModel.find({ email: loginPayload.email });
            if (userDetails.length <= 0) {
                throw new HttpException('Invalid User credentials', HttpStatus.UNAUTHORIZED);
            }
            // const isPasswordMatches = await this.encryptDecryptService.comparePasswords(loginPayload.password ,userDetails[0].password);
            const isPasswordMatches = loginPayload.password === userDetails[0].password;
            if (!isPasswordMatches) {
                throw new HttpException('Invalid User credentials', HttpStatus.UNAUTHORIZED);
            }
            const authToken = await this.jwtAuthService.generateJWT(loginPayload);
            const userWithAuthToken = { ...userDetails[0].toObject(), ...authToken };
            return userWithAuthToken;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async updateUserDetails(recordPayload: UpdateUsersDto, updateId: string): Promise<UpdateUsersDto | UnprocessableEntityException> {
        try {
            const userDetails = await this.userModel.findByIdAndUpdate({ _id: updateId }, recordPayload);
            if (!userDetails) {
                throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
            }
            return recordPayload;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }
}
