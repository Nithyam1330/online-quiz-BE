import { STATUS, IStatus } from 'src/shared/enums/app.properties';
import { IsIn } from 'class-validator';
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator'
@Schema({
    timestamps: true
})
export class ApplicationsSchemaCreator {
    @Prop({ required: true })
    applicantId: string;

    @Prop({ required: true })
    currentOpeningId: string;
    
}

export type IApplicationsDocument = ApplicationsSchemaCreator & Document;
export const ApplicationsSchema = SchemaFactory.createForClass(ApplicationsSchemaCreator).plugin(uniqueValidators)

