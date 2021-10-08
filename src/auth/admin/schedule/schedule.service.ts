/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';
import { QuestionsService } from '../questions/questions.service';
import { SubmitService } from '../submit/submit.service';
import { TechnologyService } from '../technology/technology.service';
import { CreateScheduleDto } from './schedule.dto';
import { IScheduleDocument } from './schedule.schema';
import { APPLICATION_STATUS } from './../../../shared/enums/app.properties';
import { ApplicationsService } from './../applications/applications.service';
import { json } from 'express';
@Injectable()
export class ScheduleService {
    constructor(
        @Inject(MODAL_ENUMS.SCHEDULES) private readonly scheduleModel: Model<IScheduleDocument>,
        private currentOpeningsService: CurrentOpeningsService,
        private submitService: SubmitService,
        private questionsService: QuestionsService,
        private technologyService: TechnologyService,
        private applicationService: ApplicationsService

    ) { }

    async createSchedule(schedulePayload: CreateScheduleDto): Promise<CreateScheduleDto> {
        try {
            const technologiesLength = schedulePayload.technologyKeys.length;
            const noOfQuestions = Math.floor(schedulePayload.totalNoOfQuestions / technologiesLength);
            const remaining = schedulePayload.totalNoOfQuestions - (noOfQuestions * technologiesLength);
            let questions = [];
            for (const technology of schedulePayload.technologyKeys) {
                const questionsSize = technology == schedulePayload.technologyKeys[0] ? noOfQuestions + remaining : noOfQuestions;
                const currentQuestions = await this.questionsService.getNNumberofQuestionsByTechnology(technology, questionsSize);
                questions = [...questions, ...currentQuestions];
            }
            const formattedQuestions = {};
            for (const question of questions) {
                formattedQuestions[question._id] = null;
            }
            const submitInfo = await this.submitService.createSubmit({ userId: schedulePayload.candidateId, questions: formattedQuestions })
            await this.currentOpeningsService.incrementScheduledCount(schedulePayload.positionApplied)
            schedulePayload.submitId = submitInfo._id;

            const applicationIdStatus = await this.applicationService.updateApplicationStatus(schedulePayload.applicationId, {status: APPLICATION_STATUS.SCHEDULED});
            const schedule = new this.scheduleModel(schedulePayload);
            return schedule.save();
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllSchedules(): Promise<CreateScheduleDto[] | NotFoundException> {
        try {
            const scheduleDetails = await this.scheduleModel.find().select({
                "status": 1,
                "technologyKeys": 1,
                "_id": 1,
                "startTime": 1,
                "endTime": 1,
                "positionApplied": 1,
                "candidateId": 1,
                "totalNoOfQuestions": 1,
                "submitId": 1,
                "cutOff": 1,
                "assessmentDuration": 1,
                "applicationId": 1
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

    async updateScheduleByApplicationId(schedulePayload: CreateScheduleDto): Promise<CreateScheduleDto> {
        const scheduleDetails = await this.scheduleModel.findOneAndUpdate({ applicationId: schedulePayload.applicationId, status:APPLICATION_STATUS.SCHEDULED.toLowerCase() }, schedulePayload).exec();
        if (!scheduleDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return schedulePayload;
    }

    async getScheduleById(id: string): Promise<any | NotFoundException> {
        try {
            const scheduleDetails = await this.scheduleModel.findById(id).exec();
            const technologyDetails = await this.technologyService.getTechnologiesByIDList(scheduleDetails.technologyKeys);
            return {
                scheduleDetails,
                technologyDetails
            }
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllSchedulesByUserId(id: string): Promise<any | NotFoundException> {
        try {

            const scheduleDetails = await this.scheduleModel.find({ candidateId: id }).select({
                "status": 1,
                "technologyKeys": 1,
                "_id": 1,
                "startTime": 1,
                "endTime": 1,
                "positionApplied": 1,
                "candidateId": 1,
                "totalNoOfQuestions": 1,
                "submitId": 1,
                "cutOff": 1,
                "assessmentDuration": 1,
                "applicationId": 1
            }).exec();
            let technologykeys = []
            for (const schedule of scheduleDetails) {
                technologykeys = [...technologykeys, ...schedule.technologyKeys]
            }
            const technologyDetails = await this.technologyService.getTechnologiesByIDList(technologykeys);
            return {
                scheduleDetails,
                technologyDetails
            }
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }


    async getScheduleByApplicationId(applicationId: string): Promise<any | NotFoundException> {
        try {            
            const scheduleDetails = await this.scheduleModel.find({ applicationId: applicationId }).exec();
            let technologykeys = []
            for (const schedule of scheduleDetails) {
                technologykeys = [...technologykeys, ...schedule.technologyKeys]
            }
            const technologyDetails = await this.technologyService.getTechnologiesByIDList(technologykeys);
            return {
                scheduleDetails,
                technologyDetails
            }
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    async getScheduleStats(applicationId: string): Promise<any> {
            let scheduleResponse= await this.getScheduleByApplicationId(applicationId); 
            if(scheduleResponse && scheduleResponse.scheduleDetails && scheduleResponse.scheduleDetails[0])  {
                let scheduleDetails = scheduleResponse.scheduleDetails[0];
                if(scheduleDetails.status !== APPLICATION_STATUS.SUBMITTED) {
                     throw new HttpException(`Application not submitted yet!`, HttpStatus.NOT_FOUND);
                }
                let questionDetails = await this.submitService.getSubmitQuestionsById(scheduleDetails.submitId);
                if(!questionDetails) {
                    throw new HttpException('Somethig went wrong', HttpStatus.NOT_FOUND)
                }
                let totalNoOfQues = scheduleDetails.totalNoOfQuestions;
                let cutOff = scheduleDetails.cutOff;
                let notAnswered = totalNoOfQues - questionDetails.length;
                let correct = 0;
                let wrong = 0;
                for(let question of questionDetails) {
                    //@ts-ignore
                    if(question.answerKey == question.yourAnswer) {
                        correct = correct + 1;
                    //@ts-ignore
                    } else if(question.yourAnswer === null) {
                        notAnswered = notAnswered +1;
                    } else {
                        wrong = wrong +1;
                    }
                }
                return {
                    applicationId,
                    correct,
                    wrong,
                    notAnswered,
                    cutOff,
                    totalNoOfQues
                }
            } 
            throw new HttpException('Schedule with application id not found', HttpStatus.NOT_FOUND);
            
    }

}
