import { Type } from "@nestjs/common";
import { IsDefined, IsIn } from "class-validator";
import { Schema } from "mongoose";
import { IQuestion } from "./submit.schema";

export class CreateSubmitDto {
    _id?: string;
    
    @IsDefined()
    questions: IQuestion
    
    @IsDefined()
    userId: string;
}