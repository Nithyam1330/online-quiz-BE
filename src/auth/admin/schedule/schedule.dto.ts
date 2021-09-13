/* eslint-disable prettier/prettier */
import { Type } from "@nestjs/common";
import { IsDefined, IsIn } from "class-validator";
import { Schema } from "mongoose";

export class CreateScheduleDto {
    _id?: string;
    
    @IsDefined()
    startTime: Date;
    
    @IsDefined()
    endTime: Date;
    
    @IsDefined()
    positionApplied: string
    
    @IsDefined()
    candidateId: string

    @IsDefined()
    technologyKeys: string[]
    
    @IsDefined()
    createdBy: string

    @IsDefined()
    updatedBy: string

    quizStartTimeByCandidate: Date  = null;

    @IsDefined()
    totalNoOfQuestions: number

    @IsDefined()
    cutOff: number

    @IsDefined()
    submitId: string

    totalScore: number = null;

    @IsDefined()
    assessmentDuration: number;

    @IsDefined()
    applicationId: string;
}