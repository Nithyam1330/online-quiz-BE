/* eslint-disable prettier/prettier */
import { IsDefined } from "class-validator";
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

export class BulkUploadDTO {
    @IsDefined()
    bulkData: string;
}