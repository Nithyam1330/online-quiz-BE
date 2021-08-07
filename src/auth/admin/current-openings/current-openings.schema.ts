import { STATUS, IStatus } from 'src/shared/enums/app.properties';
import { IsIn } from 'class-validator';
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from 'mongoose'
import * as uniqueValidators from 'mongoose-unique-validator'
@Schema({
    timestamps: true
})
export class CurrentOpeningsSchemaCreator {
    @Prop({ required: true })
    technologyKeys: string[];

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    openingCount: number;

    @Prop({ required: true, default: 0 })
    appliedCount: number;

    @Prop({ required: true, default: 0 })
    scheduledCount: number;

    @Prop({ required: true, default: 0 })
    onHoldCount: number;

    @Prop({ required: true, default: 0})
    hiredCount: number;

    @Prop({ required: true})
    createdBy: string

    @Prop({ required: true})
    updatedBy: string

    @Prop()
    @IsIn(Object.keys(STATUS))
    status: IStatus
}

export type ICurrentOpeningsDocument = CurrentOpeningsSchemaCreator & Document;
export const CurrentOpeningsSchema = SchemaFactory.createForClass(CurrentOpeningsSchemaCreator).plugin(uniqueValidators)

