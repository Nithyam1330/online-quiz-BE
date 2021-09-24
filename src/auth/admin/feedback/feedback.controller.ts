import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { CreateFeedbackDto } from './feedback.dto';
import { FeedbackService } from './feedback.service';

@UseGuards(JwtAuthGuard)
@Controller('feedback')
export class FeedbackController {
    constructor(
        private feedbackService: FeedbackService,
        private responseHandler: ResponseHandlerService
    ) {}

    @Post('')
    async submitFeedback(@Body() feedbackPayload: CreateFeedbackDto) {
        return this.feedbackService.submitFeedback(feedbackPayload).then(res => {
            return this.responseHandler.successReponseHandler('Feedback saved Successfully', res);
        }).catch((error: Error) => {
            console.log('error',error);
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get()
    async getAllFeedbacks() {
        return this.feedbackService.getAllFeedbacks().then(res=> {
            return this.responseHandler.successReponseHandler('Get all Feedbacks successful', res);
        }).catch((err: Error) => {
            return this.responseHandler.errorReponseHandler(err);
        })
    }

    @Delete(':id')
    async deleteFeedback(@Param('id') feedbackId: string) {
        return this.feedbackService.deleteFeedback(feedbackId).then(res => {
            return this.responseHandler.successReponseHandler('Feedback deleted successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':id')
    async updateFeedback(@Body() feedbackPayload: CreateFeedbackDto, @Param('id') feedbackId: string) {
        return this.feedbackService.updateFeedback(feedbackPayload,feedbackId).then(res => {
            return this.responseHandler.successReponseHandler('Feedback updated successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id')
    async getFeedbackByFeedbackId(@Param('id') feedbackId: string) {
        return this.feedbackService.getFeedbackById(feedbackId).then(res => {
            return this.responseHandler.successReponseHandler('Get Feedback by ID successful', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get('/users/:id')
    async getAllFeedbacksByUserId(@Param('id') userId: string) {
        return this.feedbackService.getAllFeedbacksByUserId(userId).then(res => {
            return this.responseHandler.successReponseHandler('Get All Feedbacks by User ID successful', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get('/applications/:id')
    async getAllFeedbackByApplicationId(@Param('id') applicationId: string) {
        return this.feedbackService.getAllFeedbacksByApplicationId(applicationId).then(res => {
            return this.responseHandler.successReponseHandler('Get All Feedbacks by Application ID successful', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
