import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import {Document, Types, Schema as MongooseSchema} from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator'

export interface IOption {
    key: string;
    value: string;
}

@Schema({
    timestamps: true
})
export class QuestionSchemaCreator {
    @Prop({required: true})
    question: string;

    @Prop({required: true})
    answerKey: string;

    @Prop({required: true})
    options: IOption[]

    @Prop({required: true})
    technologyKey: string

    @Prop({required: true})
    createdBy: string

    @Prop({required: true})
    updatedBy: string 
}

export type IQuestionDocument = QuestionSchemaCreator & Document;
export const QuuestionSchema = SchemaFactory.createForClass(QuestionSchemaCreator).plugin(uniqueValidators)