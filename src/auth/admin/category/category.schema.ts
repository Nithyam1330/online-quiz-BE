import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import {Document} from 'mongoose'
import { IStatus, STATUS } from "src/shared/enums/app.properties";
import * as uniqueValidators from 'mongoose-unique-validator'
import { IsIn } from "class-validator";
@Schema({
    timestamps: true
})
export class CategorySchemaCreator {
    @Prop({required: true, unique: true})
    categoryKey: string;

    @Prop()
    name: string;

    @Prop()
    @IsIn(Object.keys(STATUS))
    status: IStatus
}

export type ICategoryDocument = CategorySchemaCreator & Document;
export const CategorySchema = SchemaFactory.createForClass(CategorySchemaCreator).plugin(uniqueValidators)