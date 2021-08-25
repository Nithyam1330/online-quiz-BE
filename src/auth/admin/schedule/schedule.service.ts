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
        private currentOpeningsService:CurrentOpeningsService,
        private submitService: SubmitService,
        private questionsService: QuestionsService,

    ) {}

    async createSchedule(schedulePayload: CreateScheduleDto): Promise<CreateScheduleDto> {
        // Update user status pending, will do once user registration completed
    let technologiesLength = schedulePayload.technologyKeys.length;
    let noOfQuestions = Math.floor(schedulePayload.totalNoOfQuestions/technologiesLength);
    let remaining = schedulePayload.totalNoOfQuestions - (noOfQuestions * technologiesLength);
    let questions = [];
    for(let technology of schedulePayload.technologyKeys) {
        let questionsSize = technology == schedulePayload.technologyKeys[0] ? noOfQuestions+ remaining : noOfQuestions;
        let currentQuestions = await this.questionsService.getNNumberofQuestionsByTechnology(technology, questionsSize);
        questions=[...questions, ...currentQuestions];
    }
    let formattedQuestions = {};
    for(let question of questions) {
        formattedQuestions[question._id] = null;
    }
    let submitInfo = await this.submitService.createSubmit({userId: schedulePayload.candidateId,questions: formattedQuestions })
        await this.currentOpeningsService.incrementScheduledCount(schedulePayload.positionApplied)
        schedulePayload.submitId = submitInfo._id;
        const schedule = new this.scheduleModel(schedulePayload);
        return schedule.save();
    }

    async getAllSchedules(): Promise<CreateScheduleDto[]> {
        const scheduleDetails = await this.scheduleModel.find().exec();
        return scheduleDetails;
    }

    async deleteSchedule(id: string): Promise<CreateScheduleDto | NotFoundException> {
        const result = await this.scheduleModel.findByIdAndDelete(id).exec();
        return result;
    }

    async updateSchedule(id: string, schedulePayload: CreateScheduleDto): Promise<CreateScheduleDto> {
        const scheduleDetails = await this.scheduleModel.findOneAndUpdate({_id: id}, schedulePayload).exec();
        if (!schedulePayload) {
            console.log(scheduleDetails)
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return schedulePayload;
    }

    async getScheduleById(id: string): Promise<CreateScheduleDto | NotFoundException> {
        try {
            const scheduleData = await this.scheduleModel.findById(id).exec();
            return scheduleData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

}
