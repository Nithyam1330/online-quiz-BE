/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { IApplicationsDocument } from './applications.schema';
import { ApplicationsDto, ApplicationStatusUpdateDTO } from './applications.dto';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';
import { UserDetailsService } from 'src/auth/user-details/user-details.service';
import { UserService } from 'src/auth/user/user.service';

@Injectable()
export class ApplicationsService {
    constructor(
        @Inject(MODAL_ENUMS.APPLICATIONS) private readonly applicationsModel: Model<IApplicationsDocument>,
        private currentopeningsService: CurrentOpeningsService,
        private usersService: UserService
    ) { }

    async applyForOpening(applicationPayload: ApplicationsDto): Promise<ApplicationsDto | NotFoundException | UnprocessableEntityException> {
        const application = new this.applicationsModel(applicationPayload);
        await this.currentopeningsService.checkCurrentOpeningWithActiveStatus(applicationPayload.currentOpeningId);
        await this.checkAlreadyAppliedStatus(applicationPayload.currentOpeningId, applicationPayload.userId);
        await this.currentopeningsService.incrementAppliedCount(applicationPayload.currentOpeningId);
        return application.save();
    }

    async checkAlreadyAppliedStatus(currentOpeningId: string, applicantId: string): Promise<void> {
        const applicationDetails = await this.applicationsModel.find({ userId: applicantId, currentOpeningId: currentOpeningId });
        if (applicationDetails.length > 0) {
            throw new HttpException(`Already Applied`, HttpStatus.NOT_MODIFIED);
        }
    }

    async getAllApplications(): Promise<any | UnprocessableEntityException> {
        const applicationsData = await this.applicationsModel.find({}).exec();
        const openingIds = applicationsData.map(obj => obj.currentOpeningId);
        const openings = await this.currentopeningsService.getCurrentOpeningsByIDList(openingIds);
        const userIds = applicationsData.map(obj => obj.userId);
        const users = await this.usersService.getUsersByIds(userIds);
        if (!applicationsData) {
            throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
        }
       const payload = {
           applicationInfo: applicationsData,
           user_details:users,
           opening_details: openings
       }
        return payload;
    }

    async getAllApplicationByUserId(userId: string): Promise<ApplicationsDto[] | UnprocessableEntityException> {
        const applicationsData = await this.applicationsModel.find({ userId: userId }).exec();
        if (!applicationsData) {
            throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
        }
        return applicationsData;
    }

    async getAllApplicationByOpening(openingId: string): Promise<ApplicationsDto[] | UnprocessableEntityException> {
        const applicationsData = await this.applicationsModel.find({ currentOpeningId: openingId }).exec();
        if (!applicationsData) {
            throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
        }
        return applicationsData;
    }

    async deleteApplication(applicationId: string): Promise<ApplicationsDto | NotFoundException | UnprocessableEntityException> {
        const result = await this.applicationsModel.findByIdAndDelete(applicationId).exec();
        if (!result) {
            throw new HttpException('Nothing has Deleted', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    async updateApplicationStatus(applicationId: string, applicationStatusdto: ApplicationStatusUpdateDTO): Promise<ApplicationsDto | UnprocessableEntityException> {
        const applicationsData = await this.applicationsModel.findOneAndUpdate({_id: applicationId}, {status: applicationStatusdto.status});
        if (!applicationsData) {
            throw new HttpException('Unable to update', HttpStatus.NOT_MODIFIED);
        }
        return applicationsData;
    }
}

