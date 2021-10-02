/* eslint-disable prettier/prettier */
import { IApplicationImageDocument } from './application-images.schema';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { ApplicationImagesDTO } from './application-images.dto';
import { APPLICATION_STATUS } from './../../shared/enums/app.properties';
import { ApplicationsService } from './../admin/applications/applications.service';


@Injectable()
export class ApplicationImageService {
    constructor(
        @Inject(MODAL_ENUMS.APPLICATION_IMAGES) private readonly applicationImageModel: Model<IApplicationImageDocument>,
        private readonly applicationsService: ApplicationsService
    ) {
    }

    async uploadImage(applicationImagePayload: ApplicationImagesDTO): Promise<ApplicationImagesDTO | UnprocessableEntityException> {
        const applicationInfo = await this.applicationsService.getApplicationByIDAndStatus(applicationImagePayload.applicationId, { status: APPLICATION_STATUS.SUBMITTED });
        if (!applicationInfo) {
            throw new HttpException('Cant Upload image for a application which is not in scheduled status', HttpStatus.NOT_MODIFIED);
        }
        const applicationsData = await this.applicationImageModel.find({ applicationId: applicationImagePayload.applicationId }).exec();
        if (applicationsData.length <= 0) {
            const application = new this.applicationImageModel(applicationImagePayload);
            return application.save();
        }
        const applicationUpdate = await this.applicationImageModel.findOneAndUpdate({ applicationId: applicationImagePayload.applicationId }, { imageDataUrl: applicationImagePayload.imageDataUrl });
        if (!applicationUpdate) {
            throw new HttpException('Unable to update', HttpStatus.NOT_MODIFIED);
        }
        applicationUpdate.imageDataUrl = applicationImagePayload.imageDataUrl;
        return applicationUpdate;
    }


    async getImageByApplicationId(applicationId: string): Promise<ApplicationImagesDTO | UnprocessableEntityException> {
        const applicationsData = await this.applicationImageModel.find({ applicationId: applicationId }).exec();
        if (applicationsData.length <= 0) {
            throw new HttpException('Unable to get', HttpStatus.NOT_FOUND);
        }
        return applicationsData[0];
    }

    async deleteImageByApplicationId(applicationId: string): Promise<ApplicationImagesDTO | UnprocessableEntityException> {
        const result = await this.applicationImageModel.findOneAndDelete({applicationId: applicationId}).exec();
        if (!result) {
            throw new HttpException('Nothing has Deleted', HttpStatus.NOT_FOUND);
        }
        return result;
    }
}