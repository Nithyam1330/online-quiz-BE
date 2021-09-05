/* eslint-disable prettier/prettier */
import { IsDefined, IsIn } from "class-validator";

export class ApplicationsDto {
    _id?: string;

    @IsDefined()
    userId: string;

    @IsDefined()
    currentOpeningId: string;
}
