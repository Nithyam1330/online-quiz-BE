import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import {Document} from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator'
@Schema({
    timestamps: true
})
export class TechnologySchemaCreator {
    @Prop({required: true, unique: true})
    technologyKey: string;

    @Prop({required: true})
    name: string;
}

export type ITechnologyDocument = TechnologySchemaCreator & Document;
export const TechnologySchema = SchemaFactory.createForClass(TechnologySchemaCreator).plugin(uniqueValidators)