import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';
import { CreateQuestionDto } from '../questions/questions.dto';
import { QuestionsService } from '../questions/questions.service';
import { CreateSubmitDto } from './submit.dto';
import { ISubmitDocument } from './submit.schema';

@Injectable()
export class SubmitService {
    constructor(
        @Inject(MODAL_ENUMS.SUBMIT) private readonly submitModel: Model<ISubmitDocument>,
        private questionService: QuestionsService

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


    async updateSubmitAnswers(id: string, questions: any): Promise<CreateSubmitDto | NotFoundException> {
        try {
            const submitDetails = await this.submitModel.findById(id).exec();
            if (submitDetails && submitDetails.questions) {
                let updatedQuestions = { ...submitDetails.questions, ...questions };
                const scheduleDetails = await this.submitModel.findOneAndUpdate({ _id: id }, { questions: updatedQuestions }).exec();
                if (!scheduleDetails) {
                    console.log(scheduleDetails)
                    throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
                }
                scheduleDetails.questions = updatedQuestions;
                return scheduleDetails;
            }
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getSubmitById(id: string): Promise<CreateQuestionDto[]> {
        try {
            const submitData = await this.submitModel.findById(id).exec();
            let questions = await this.questionService.getMultipleQuestionsByIds(Object.keys(submitData.questions))
            let updatedQuestions = [];
            for (let question of questions) {
                updatedQuestions.push({ answerValue: submitData.questions[question._id], options: question.options, question: question.question, _id: question._id })
            }
            return updatedQuestions;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

}
