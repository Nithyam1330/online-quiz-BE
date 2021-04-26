import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import {Document} from 'mongoose'
import { IStatus, STATUS } from "src/shared/enums/app.properties";
import * as uniqueValidators from 'mongoose-unique-validator'
import { IsIn } from "class-validator";
@Schema({
    timestamps: true
})
export class SubCategorySchemaCreator {
    @Prop({required: true, unique: true})
    subCategoryKey: string;

    @Prop({required: true})
    categoryKey: string;

    @Prop()
    name: string;

    @Prop()
    @IsIn(Object.keys(STATUS))
    status: IStatus
}

export type ISubCategoryDocument = SubCategorySchemaCreator & Document;
export const SubCategorySchema = SchemaFactory.createForClass(SubCategorySchemaCreator).plugin(uniqueValidators)

