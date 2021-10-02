/* eslint-disable prettier/prettier */
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({
    timestamps: true
})
export class ApplicationImageSchemaCreator {
    @Prop({ required: true})
    imageDataUrl: string;

    @Prop({required: true})
    applicationId: string;
}

export type IApplicationImageDocument = ApplicationImageSchemaCreator & Document;
export const ApplicationImageSchema = SchemaFactory.createForClass(
    ApplicationImageSchemaCreator,
)
