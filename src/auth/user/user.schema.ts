import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { LoginProvidersType } from "src/shared/enums/login-providers.enums";
import {Document} from 'mongoose'
import { IUserRoles } from "src/shared/enums/app.properties";
import * as uniqueValidators from 'mongoose-unique-validator'
@Schema()
export class UserSchemaCreator {
    @Prop({required: true, unique: true})
    username: string;

    @Prop()
    password: string;

    @Prop({required: true})
    provider: LoginProvidersType

    @Prop({required: true})
    role: IUserRoles
}

export type IUserDocument = UserSchemaCreator & Document;
export const UsersSchema = SchemaFactory.createForClass(UserSchemaCreator).plugin(uniqueValidators)