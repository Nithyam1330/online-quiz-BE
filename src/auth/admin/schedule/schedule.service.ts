/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';
import { CreateScheduleDto } from './schedule.dto';
import { IScheduleDocument } from './schedule.schema';

@Injectable()
export class ScheduleService {
    constructor(
        @Inject(MODAL_ENUMS.SCHEDULES) private readonly scheduleModel: Model<IScheduleDocument>,
        private currentOpeningsService:CurrentOpeningsService 

    ) {}

    async createSchedule(schedulePayload: CreateScheduleDto): Promise<CreateScheduleDto> {
        //Update user status pending, will do once user registration completed
        const schedule = new this.scheduleModel(schedulePayload);
        await this.currentOpeningsService.incrementScheduledCount(schedulePayload.positionApplied)
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
