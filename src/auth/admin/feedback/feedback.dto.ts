import { IsDefined } from "class-validator";

export class CreateFeedbackDto {
    _id?: string;
    
    @IsDefined()
    applicationId: string;
    
    @IsDefined()
    userId: string;
    
    @IsDefined()
    starRating: number
    
    @IsDefined()
    feedBack: string;
}