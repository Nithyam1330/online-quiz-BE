/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { SubmitService } from './submit.service';

@UseGuards(JwtAuthGuard)
@Controller('submit')
export class SubmitController {
    constructor(
        private readonly responseHandler: ResponseHandlerService,
        private readonly submitService: SubmitService,
    ) { }

    @Get(':id')
    async getSubmitById(@Param('id') submitId: string) {
        return this.submitService.getSubmitById(submitId).then(res => {
            return this.responseHandler.successReponseHandler('Get submit by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put('update-answers/:submitId/:applicationID')
    async updateSchedule(@Param('submitId') submitId: string,@Param('applicationID') applicationID: string, @Body() schedulePayload: any) {
        return this.submitService.updateSubmitAnswers(submitId, applicationID, schedulePayload).then(res => {
            return this.responseHandler.successReponseHandler('Update answers by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
