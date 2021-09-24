/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { CreateQuestionDto } from '../questions/questions.dto';
import { QuestionsService } from '../questions/questions.service';
import { CreateSubmitDto } from './submit.dto';
import { ISubmitDocument } from './submit.schema';
import { APPLICATION_STATUS } from 'src/shared/enums/app.properties';
import { ApplicationsService } from './../applications/applications.service';

@Injectable()
export class SubmitService {
    constructor(
        @Inject(MODAL_ENUMS.SUBMIT) private readonly submitModel: Model<ISubmitDocument>,
        private questionService: QuestionsService,
        private applicationsService:ApplicationsService

    ) { }

    async createSubmit(submitPayload: CreateSubmitDto): Promise<CreateSubmitDto> {
        try {
            const submit = new this.submitModel(submitPayload);
            return submit.save();
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }


    async updateSubmitAnswers(submitId: string,applicationID: string, questions: any): Promise<CreateSubmitDto | NotFoundException> {
        const submitDetails = await this.submitModel.findById(submitId).exec();
        if (submitDetails && submitDetails.questions) {
            const updatedQuestions = { ...submitDetails.questions, ...questions };
            const scheduleDetails = await this.submitModel.findOneAndUpdate({ _id: submitId }, { questions: updatedQuestions }).exec();
            if (!scheduleDetails) {
                throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
            }
            await this.applicationsService.updateApplicationStatus(applicationID, {status: APPLICATION_STATUS.SUBMITED});
            scheduleDetails.questions = updatedQuestions;
            return scheduleDetails;
        }
        throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
    }

    async getSubmitById(id: string): Promise<CreateQuestionDto[]> {
        const submitData = await this.submitModel.findById(id).exec();
        const questions = await this.questionService.getMultipleQuestionsByIds(Object.keys(submitData.questions))
        const updatedQuestions = [];
        for (const question of questions) {
            updatedQuestions.push({ answerValue: submitData.questions[question._id], options: question.options, question: question.question, _id: question._id, technology: question.technologyKey })
        } if (!updatedQuestions) {
            throw new HttpException(`Not found`, HttpStatus.NOT_FOUND);
        }
        return updatedQuestions;
    }

}
