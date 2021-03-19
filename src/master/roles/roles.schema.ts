import {Schema} from 'mongoose';
import * as mongoUniqueValidator from 'mongoose-unique-validator';
export const RoleSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    role_id: {
      type: Number,
      required: true,
      unique: true
    }
  }).plugin(mongoUniqueValidator);