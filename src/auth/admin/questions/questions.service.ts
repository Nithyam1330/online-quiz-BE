import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { CreateQuestionDto } from './questions.dto';
import { IQuestionDocument } from './questions.schema';

@Injectable()
export class QuestionsService {
    constructor(
        @Inject(MODAL_ENUMS.QUESTIONS) private readonly questionsModel: Model<IQuestionDocument>,
    ) { }

    async createQuestions(questionsPayload: CreateQuestionDto): Promise<CreateQuestionDto | UnprocessableEntityException> {
        try {
            const question = new this.questionsModel(questionsPayload);
            return question.save();
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async getAllQuestions(): Promise<CreateQuestionDto[] | UnprocessableEntityException> {
        try {
            const questionDetails = await this.questionsModel.find().select('-answerKey').exec();
            return questionDetails;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }


    }

    async deleteQuestion(questionId: string): Promise<IQuestionDocument | NotFoundException | UnprocessableEntityException> {
        try {
            const result = await this.questionsModel.findByIdAndDelete(questionId).exec();
            return result;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async updateQuestion(questionsPayload: CreateQuestionDto, questionId: string): Promise<CreateQuestionDto | UnprocessableEntityException | NotFoundException> {
        try {
            const questionDetails = await this.questionsModel.findOneAndUpdate({ _id: questionId }, questionsPayload).exec();
            if (!questionDetails) {
                throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
            }
            return questionsPayload;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async getNNumberofQuestionsByTechnology(technology: string, noOfQuestions: number): Promise<{_id: string}[]> {
         let questions = await this.questionsModel.aggregate([
            {$match: {technologyKey: technology}},
            {$sample: {size: noOfQuestions}},
            {$project: {_id: 1}}
          ])
          if(!questions) {
            throw new HttpException('Questions not found', HttpStatus.NOT_FOUND);
          }
        return questions;
    }

    async getMultipleQuestionsByIds(questionIds: string[]): Promise<CreateQuestionDto[]> {
        let questions = await this.questionsModel.find({'_id': { $in: questionIds}},{ question: 1,options: 1, _id: 1 })
        return questions;
    }
}
