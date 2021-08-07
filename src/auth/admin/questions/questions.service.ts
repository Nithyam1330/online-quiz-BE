import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { CreateQuestionDto } from './questions.dto';
import { IQuestionDocument } from './questions.schema';

@Injectable()
export class QuestionsService {
    constructor(
        @Inject(MODAL_ENUMS.QUESTIONS) private readonly questionsModel: Model<IQuestionDocument>,
    ) {}

    async createQuestions(questionsPayload: CreateQuestionDto): Promise<CreateQuestionDto> {
        const question = new this.questionsModel(questionsPayload);
        return question.save();
    }

    async getAllQuestions(): Promise<CreateQuestionDto[]> {
        const questionDetails = await this.questionsModel.find().select('-answerKey').exec();
        return questionDetails;
    }

    async deleteQuestion(questionId: string): Promise<IQuestionDocument | NotFoundException> {
        const result = await this.questionsModel.findByIdAndDelete(questionId).exec();
        return result;
    }

    async updateQuestion(questionsPayload: CreateQuestionDto, questionId: string): Promise<CreateQuestionDto> {
        const questionDetails = await this.questionsModel.findOneAndUpdate({_id: questionId}, questionsPayload).exec();
        if (!questionDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return questionsPayload;
    }


}
