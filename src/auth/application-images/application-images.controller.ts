/* eslint-disable prettier/prettier */
import { Controller, Param, Post } from '@nestjs/common';
import { ApplicationImagesDTO } from './application-images.dto';
import { ResponseHandlerService } from './../../shared/services/response-handler/response-handler.service';
import { ApplicationImageService } from './application-images.service';
import { Body, Delete, Get } from '@nestjs/common';

@Controller('application-images')
export class ApplicationImagesController {
    constructor(private applicationImagesService: ApplicationImageService,
        private responseHandler: ResponseHandlerService) {

    }
    @Post()
    async uploadAppplicationImage(@Body() applicationImagePayload: ApplicationImagesDTO) {
        return this.applicationImagesService.uploadImage(applicationImagePayload).then(res => {
            return this.responseHandler.successReponseHandler('Application Image has been uploaded Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':applicationId')
    async getImageByApplicationId(@Param('applicationId') applicationId: string) {
        return this.applicationImagesService.getImageByApplicationId(applicationId).then(res => {
            return this.responseHandler.successReponseHandler('Get Application image by application id is Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Delete(':applicationId')
    async deleteImageByApplicationId(@Param('applicationId') applicationId: string) {
        return this.applicationImagesService.deleteImageByApplicationId(applicationId).then(res => {
            return this.responseHandler.successReponseHandler('Application image by application id is deleted Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
