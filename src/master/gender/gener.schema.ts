import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as uniqueValidator from 'mongoose-unique-validator'
@Schema()
export class Gender {
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    gender_id: number;
}

export type IGender = Gender & Document;

export const GenderSchema = SchemaFactory.createForClass(Gender).plugin(uniqueValidator);