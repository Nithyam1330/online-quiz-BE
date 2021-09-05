/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { IApplicationsDocument } from './applications.schema';
import { ApplicationsDto } from './applications.dto';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';

@Injectable()
export class ApplicationsService {
    constructor(
        @Inject(MODAL_ENUMS.APPLICATIONS) private readonly applicationsModel: Model<IApplicationsDocument>,
        private currentopeningsService: CurrentOpeningsService
    ) { }

    async applyForOpening(applicationPayload: ApplicationsDto): Promise<ApplicationsDto | NotFoundException | UnprocessableEntityException> {
        await this.currentopeningsService.checkCurrentOpeningWithActiveStatus(applicationPayload.currentOpeningId);
        await this.checkAlreadyAppliedStatus(applicationPayload.currentOpeningId, applicationPayload.userId);
        await this.currentopeningsService.incrementAppliedCount(applicationPayload.currentOpeningId);
        const application = new this.applicationsModel(applicationPayload);
        return application.save();
    }

    async checkAlreadyAppliedStatus(currentOpeningId: string, applicantId: string): Promise<void> {
        const applicationDetails = await this.applicationsModel.find({ applicantId: applicantId, currentOpeningId: currentOpeningId });
        if (applicationDetails) {
            throw new HttpException(`Already Applied`, HttpStatus.NOT_MODIFIED);
        }
    }

    async getAllApplications(): Promise<ApplicationsDto[] | UnprocessableEntityException> {
        const applicationsData = await this.applicationsModel.find({}).exec();
        if (!applicationsData) {
            throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
        }
        return applicationsData;
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
}

