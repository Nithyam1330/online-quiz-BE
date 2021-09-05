/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get, Param, UseGuards, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { ApplicationsDto, ApplicationStatusUpdateDTO } from './applications.dto';
import { ApplicationsService } from './applications.service';

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
    constructor(
        private readonly responseHandler: ResponseHandlerService,
        private readonly applicationsService: ApplicationsService
    ) { }

    @Post()
    async applyForOpening(@Body() applicationPayload: ApplicationsDto) {
        return this.applicationsService.applyForOpening(applicationPayload).then(res => {
            return this.responseHandler.successReponseHandler('Application Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get()
    async getAllApplications() {
        return this.applicationsService.getAllApplications().then(res => {
            return this.responseHandler.successReponseHandler('Get All Applications Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id/opening')
    async getApplicationsByOpeningId(@Param('id') currentOpeningsId: string) {
        return this.applicationsService.getAllApplicationByOpening(currentOpeningsId).then(res => {
            return this.responseHandler.successReponseHandler('Get Applications by opening Id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id/user')
    async getApplicationsByUserId(@Param('id') userId: string) {
        return this.applicationsService.getAllApplicationByUserId(userId).then(res => {
            return this.responseHandler.successReponseHandler('Get Applications by opening Id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put('update-status/:id')
    async updateApplicationStatus(@Param('id') applicationId: string, @Body() applicationStatusdto: ApplicationStatusUpdateDTO) {
        return this.applicationsService.updateApplicationStatus(applicationId, applicationStatusdto).then(res => {
            return this.responseHandler.successReponseHandler('Get Applications by opening Id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}

