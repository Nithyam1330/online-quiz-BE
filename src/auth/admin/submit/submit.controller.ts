import { Body, Controller, Post, Get, Param, Put, Delete, Patch } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { SubmitService } from './submit.service';

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

    @Patch('update-answers/:id')
    async updateSchedule(@Param('id') id: string, @Body() schedulePayload: any) {
        return this.submitService.updateSubmitAnswers(id, schedulePayload).then(res => {
            return this.responseHandler.successReponseHandler('Update answers by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
