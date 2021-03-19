import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import * as mongoUniqueValidator from 'mongoose-unique-validator';
@Schema()
export class Role {
  @Prop({required: true})
  name: string;

  @Prop({required: true, unique: true})
  role_id: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role).plugin(mongoUniqueValidator);