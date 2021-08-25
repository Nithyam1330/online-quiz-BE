import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import {Document, Types, Schema as MongooseSchema} from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator'

export interface IQuestion {
    [key: string]: string;
}

@Schema({
    timestamps: true
})

export class SubmitSchemaCreator {
    @Prop({required: true})
    userId: string;

    @Prop({type: Object})
    questions: IQuestion
}

export type ISubmitDocument = SubmitSchemaCreator & Document;
export const SubmitSchema = SchemaFactory.createForClass(SubmitSchemaCreator).plugin(uniqueValidators)