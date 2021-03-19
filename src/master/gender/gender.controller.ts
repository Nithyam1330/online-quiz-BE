import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { GenderService } from './gender.service';
import { IGender } from './gener.schema';

@Controller('gender')
export class GenderController {
    constructor(
        private readonly genderService: GenderService,
        private readonly responseHandlerService: ResponseHandlerService) {
    }

    @Post('')
    async createGender(@Body() payload: IGender) {
        return this.genderService.createGender(payload).then((res: IGender) => {
            return this.responseHandlerService.successReponseHandler('Gender Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        })
    }

    @Get()
    async getAllGendersList() {
        return this.genderService.getAllGendersList().then((res: IGender[]) => {
            return this.responseHandlerService.successReponseHandler('Get all genders is successfull', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        })
    }

    @Get(':id')
    async getGenderByID(@Param('id') genderID: string) {
        return this.genderService.getGenderByID(genderID).then((res: IGender) => {
            return this.responseHandlerService.successReponseHandler('Get gender by id is successfull', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        })
    }

    @Patch(':id')
    async updateGenderByID(@Param('id') genderID: string, @Body() payload: IGender) {
        return this.genderService.updateGenderByID(genderID, payload).then((res: IGender) => {
            return this.responseHandlerService.successReponseHandler('Update by ID is successful', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        })
    }

    @Delete(':id')
    async deleteGenderByID(@Param('id') genderID: string) {
        return this.genderService.deleteGenderByID(genderID).then((res: IGender) => {
            return this.responseHandlerService.successReponseHandler('Delete by ID is successful', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        })
    }
}
