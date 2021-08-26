import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';
import { QuestionsService } from '../questions/questions.service';
import { SubmitService } from '../submit/submit.service';
import { CreateScheduleDto } from './schedule.dto';
import { IScheduleDocument } from './schedule.schema';

@Injectable()
export class ScheduleService {
    constructor(
        @Inject(MODAL_ENUMS.SCHEDULES) private readonly scheduleModel: Model<IScheduleDocument>,
        private currentOpeningsService: CurrentOpeningsService,
        private submitService: SubmitService,
        private questionsService: QuestionsService,

    ) { }

    async createSchedule(schedulePayload: CreateScheduleDto): Promise<CreateScheduleDto> {
        try {
            let technologiesLength = schedulePayload.technologyKeys.length;
            let noOfQuestions = Math.floor(schedulePayload.totalNoOfQuestions / technologiesLength);
            let remaining = schedulePayload.totalNoOfQuestions - (noOfQuestions * technologiesLength);
            let questions = [];
            for (let technology of schedulePayload.technologyKeys) {
                let questionsSize = technology == schedulePayload.technologyKeys[0] ? noOfQuestions + remaining : noOfQuestions;
                let currentQuestions = await this.questionsService.getNNumberofQuestionsByTechnology(technology, questionsSize);
                questions = [...questions, ...currentQuestions];
            }
            let formattedQuestions = {};
            for (let question of questions) {
                formattedQuestions[question._id] = null;
            }
            let submitInfo = await this.submitService.createSubmit({ userId: schedulePayload.candidateId, questions: formattedQuestions })
            await this.currentOpeningsService.incrementScheduledCount(schedulePayload.positionApplied)
            schedulePayload.submitId = submitInfo._id;
            const schedule = new this.scheduleModel(schedulePayload);
            return schedule.save();
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllSchedules(): Promise<CreateScheduleDto[]> {
        try {
            const scheduleDetails = await this.scheduleModel.find().select({
                "status": 1,
                "technologyKeys":1,
                "_id": 1,
                "startTime": 1,
                "endTime": "1970-01-19T20:43:25.885Z",
                "positionApplied": 1,
                "candidateId": 1,
                "totalNoOfQuestions": 1,
                "submitId":1,
                "cutOff": 1
            }).exec();
            return scheduleDetails;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async deleteSchedule(id: string): Promise<CreateScheduleDto | NotFoundException> {
        const scheduleDetails = await this.scheduleModel.findByIdAndDelete(id).exec();
        if (!scheduleDetails) {
            throw new HttpException('Nothing has deleted', HttpStatus.NOT_FOUND);
        }
        return scheduleDetails;

    }

    async updateSchedule(id: string, schedulePayload: CreateScheduleDto): Promise<CreateScheduleDto> {
        const scheduleDetails = await this.scheduleModel.findOneAndUpdate({ _id: id }, schedulePayload).exec();
        if (!scheduleDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return scheduleDetails;
    }

    async getScheduleById(id: string): Promise<CreateScheduleDto | NotFoundException> {
        const scheduleData = await this.scheduleModel.findById(id).exec();
        if (!scheduleData) {
            throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
        }
        return scheduleData;
    }

}
