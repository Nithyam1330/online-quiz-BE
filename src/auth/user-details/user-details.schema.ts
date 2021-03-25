import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { LoginProvidersType } from "src/shared/enums/login-providers.enums";
import {Document} from 'mongoose'
import { IUserRoles } from "src/shared/enums/app.properties";
import * as uniqueValidators from 'mongoose-unique-validator';

export interface IAddress {
    type: string;
    country: string;
    state: string;
    city: string;
    street: string;
    landmark: string;
    pincode: number;
}
@Schema({
    timestamps: true
})
export class UserDetailsSchemaCreator {
    @Prop({required: true})
    firstName: string;

    @Prop({required: true})
    lastName: string;

    @Prop({default: ''})
    profilePicture: string;

    @Prop({required: true})
    phoneNumber: number;

    @Prop({required: true})
    fullName: string;

    @Prop({required: true})
    gender_id: number;

    @Prop({default: []})
    addresses: IAddress[];

    @Prop({required: true})
    userId: string;
}


export type IUserDetailsDocument = UserDetailsSchemaCreator & Document;
export const UserDetailsSchema = SchemaFactory.createForClass(UserDetailsSchemaCreator).plugin(uniqueValidators)