import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator'

@Schema({
    timestamps: true
})
export class FeedbackSchemaCreator {
    @Prop({required: true})
    applicationId: string;

    @Prop({required: true})
    userId: string

    @Prop({required: true,min: 1, max:5})
    starRating: number

    @Prop({required: false})
    feedBack: string
}

export type IFeedbackDocument = FeedbackSchemaCreator & Document;
export const FeedbackSchema = SchemaFactory.createForClass(FeedbackSchemaCreator).plugin(uniqueValidators)