import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { CreateQuestionDto } from './questions.dto';
import { QuestionsService } from './questions.service';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
    constructor(
        private questionsService: QuestionsService,
        private responseHandler: ResponseHandlerService
    ) {}

    @Post('')
    async createQuestions(@Body() questionsPayload: CreateQuestionDto) {
        return this.questionsService.createQuestions(questionsPayload).then(res => {
            return this.responseHandler.successReponseHandler('Questions Inserted Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get()
    async getAllQuestions() {
        return this.questionsService.getAllQuestions().then(res=> {
            return this.responseHandler.successReponseHandler('Get all questions successful', res);
        }).catch((err: Error) => {
            return this.responseHandler.errorReponseHandler(err);
        })
    }

    @Delete(':id')
    async deleteQuestion(@Param('id') questionId: string) {
        return this.questionsService.deleteQuestion(questionId).then(res => {
            return this.responseHandler.successReponseHandler('question deleted successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':id')
    async updateQuestion(@Body() questionsPayload: CreateQuestionDto, @Param('id') questionId: string) {
        return this.questionsService.updateQuestion(questionsPayload,questionId).then(res => {
            return this.responseHandler.successReponseHandler('question updated successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
