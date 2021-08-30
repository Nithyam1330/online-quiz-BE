import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import {Document, Types, Schema as MongooseSchema} from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator'

@Schema({
    timestamps: true
})
export class ScheduleSchemaCreator {
    @Prop({required: true})
    startTime: Date;

    @Prop({required: true})
    endTime: Date;

    @Prop({required: true})
    positionApplied: string

    @Prop({required: true})
    technologyKeys: string[]

    @Prop({required: true})
    candidateId: string

    @Prop({required: true})
    createdBy: string
    
    @Prop({required: true})
    updatedBy: string
    
    @Prop({ default: null})
    quizStartTimeByCandidate: Date 

    @Prop({required: true,min: 10, max:100})
    totalNoOfQuestions: number

    @Prop({required: true, min: 3, max: 100})
    cutOff: number 

    @Prop({required: true})
    submitId: string

    @Prop({default: 'scheduled'})
    status: string

    @Prop({default: null})
    totalScore: number

}

export type IScheduleDocument = ScheduleSchemaCreator & Document;
export const ScheduleSchema = SchemaFactory.createForClass(ScheduleSchemaCreator).plugin(uniqueValidators)