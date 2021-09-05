/* eslint-disable prettier/prettier */
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator';
import { APPLICATION_STATUS } from './../../../shared/enums/app.properties';

@Schema({
    timestamps: true
})
export class ApplicationsSchemaCreator {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    currentOpeningId: string;
    
    @Prop({required: true})
    status: APPLICATION_STATUS;
}

export type IApplicationsDocument = ApplicationsSchemaCreator & Document;
export const ApplicationsSchema = SchemaFactory.createForClass(ApplicationsSchemaCreator).plugin(uniqueValidators)

