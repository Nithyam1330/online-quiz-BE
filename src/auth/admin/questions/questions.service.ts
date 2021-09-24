/* eslint-disable prettier/prettier */
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

    async questionsBulkUpload(questionsString: CreateQuestionDto[]): Promise<CreateQuestionDto[]| UnprocessableEntityException> {
        try {
            let questionDetails = await this.questionsModel.insertMany(questionsString);
            return questionDetails;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

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
            const questionDetails = await this.questionsModel.find().select({ '_id': 1, 'question': 1, 'technologyKey': 1, 'options': 1 }).exec();
            return questionDetails;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async deleteQuestion(questionId: string): Promise<IQuestionDocument | NotFoundException | UnprocessableEntityException> {
        const result = await this.questionsModel.findByIdAndDelete(questionId).exec();
        if (!result) {
            throw new HttpException('Nothing has Deleted', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    async updateQuestion(questionsPayload: CreateQuestionDto, _id: string): Promise<CreateQuestionDto | UnprocessableEntityException | NotFoundException> {
        const questionDetails = await this.questionsModel.findOneAndUpdate({ _id: _id }, questionsPayload).exec();
        if (!questionDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return questionsPayload;
    }

    async getNNumberofQuestionsByTechnology(technology: string, noOfQuestions: number): Promise<{ _id: string }[]> {
        const questions = await this.questionsModel.aggregate([
            { $match: { technologyKey: technology } },
            { $sample: { size: noOfQuestions } },
            { $project: { _id: 1 } }
        ])
        if (!questions) {
            throw new HttpException('Questions not found', HttpStatus.NOT_FOUND);
        }
        return questions;
    }

    async getMultipleQuestionsByIds(questionIds: string[]): Promise<CreateQuestionDto[]> {
        const questions = await this.questionsModel.find({ '_id': { $in: questionIds } }, { question: 1, options: 1, _id: 1, technologyKey:1 })
        if (!questions) {
            throw new HttpException('Questions not found', HttpStatus.NOT_FOUND);
        }
        return questions;
    }

    async getQuestionById(id: string): Promise<CreateQuestionDto | NotFoundException> {
        const questionDetails = await this.questionsModel.findOne({ _id: id}).exec();
        if (!questionDetails) {
            throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
        }
        return questionDetails;
    }
}
