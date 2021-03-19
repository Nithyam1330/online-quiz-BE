import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Gender {
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    gender_id: number;
}

export type IGender = Gender & Document;

export const GenderSchema = SchemaFactory.createForClass(Gender);