/* eslint-disable prettier/prettier */
import { CurrentOpeningsDto, FilterCurrentOpeningsByStatusDTO } from './current-openings.dto';
import { CurrentOpeningsService } from './current-openings.service';
import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';

@Controller('current-openings')
export class CurrentOpeningsController {
    constructor(
        private readonly responseHandler: ResponseHandlerService,
        private readonly currentOpeningsService: CurrentOpeningsService
    ) { }

    @Post()
    async createCurrentOpenings(@Body() currentOpeningsPayload: CurrentOpeningsDto) {
        return this.currentOpeningsService.createNewOpenings(currentOpeningsPayload).then(res => {
            return this.responseHandler.successReponseHandler('Current Opening Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Post('filterByStatus')
    async getAllCurrentOpeningsByFilter(@Body() status: FilterCurrentOpeningsByStatusDTO) {
        return this.currentOpeningsService.getAllCurrentOpeningsByFilter(status).then(res => {
            return this.responseHandler.successReponseHandler('Get All Current Openings by filter Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get()
    async getAllCurrentOpenings() {
        return this.currentOpeningsService.getAllCurrentOpenings().then(res => {
            return this.responseHandler.successReponseHandler('Get All Current Openings Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id')
    async getCurrentOpeningById(@Param('id') currentOpeningsId: string) {
        return this.currentOpeningsService.getCurrentOpeningsByID(currentOpeningsId).then(res => {
            return this.responseHandler.successReponseHandler('Get Current Openings by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':id')
    async updateCurrentOpenings(@Param('id') currentOpeningsId: string, @Body() currentOpeningsPayload: CurrentOpeningsDto) {
        return this.currentOpeningsService.updateCurrentOpeningsByID(currentOpeningsId, currentOpeningsPayload).then(res => {
            return this.responseHandler.successReponseHandler('Update Current Openings by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':id/update-status')
    async updateStatusById(@Param('id') currentOpeningsId: string, @Body() status: FilterCurrentOpeningsByStatusDTO) {
        return this.currentOpeningsService.updateStatusById(currentOpeningsId, status).then(res => {
            return this.responseHandler.successReponseHandler(' Current Openings status updated by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Delete(':id')
    async deleteCurrentOpeningsById(@Param('id') currentOpeningsId: string) {
        return this.currentOpeningsService.deleteCurrentOpeningsById(currentOpeningsId).then(res => {
            return this.responseHandler.successReponseHandler(' Current Openings by id deleted Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
