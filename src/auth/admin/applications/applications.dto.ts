import { IsDefined, IsIn } from "class-validator";

export class ApplicationsDto {
    _id?: string;

    @IsDefined()
    applicantId: string;

    @IsDefined()
    currentOpeningId: string;
}
