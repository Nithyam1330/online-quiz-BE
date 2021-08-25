/* eslint-disable prettier/prettier */
import { IsIn } from 'class-validator';
import { OPENING_STATUS, IOPENING_STATUS } from './../../shared/enums/app.properties';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserRoles } from 'src/shared/enums/app.properties';
import * as uniqueValidators from 'mongoose-unique-validator';
@Schema({
    timestamps: true,
})
export class UserSchemaCreator {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true})
    mobileNumber: string;

    @Prop({ required: true})
    password: string;

    @Prop({ required: true})
    confirmPassword: string;

    @Prop({ required: true })
    role: IUserRoles;

    @Prop({ required: true })
    uid: string;
}

export type IUserDocument = UserSchemaCreator & Document;
export const UsersSchema = SchemaFactory.createForClass(
    UserSchemaCreator,
).plugin(uniqueValidators);
