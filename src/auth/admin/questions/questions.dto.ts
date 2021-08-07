import { Type } from "@nestjs/common";
import { IsDefined, IsIn } from "class-validator";
import { Schema } from "mongoose";
import { IOption } from "./questions.schema";

export class CreateQuestionDto {
    _id?: string;
    
    @IsDefined()
    question: string;
    
    @IsDefined()
    answerKey: string;
    
    @IsDefined()
    options: IOption[]
    
    @IsDefined()
    technologyKey: string;

    @IsDefined()
    createdBy: string
    
    @IsDefined()
    updatedBy: string

}