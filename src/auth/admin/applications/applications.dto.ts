/* eslint-disable prettier/prettier */
import { IsDefined, IsIn } from "class-validator";
import { APPLICATION_STATUS, IAPPLICATION_STATUS } from './../../../shared/enums/app.properties';


export class ApplicationsDto {
    _id?: string;

    @IsDefined()
    userId: string;

    @IsDefined()
    currentOpeningId: string;

    @IsDefined()
    @IsIn(Object.keys(APPLICATION_STATUS))
    status: IAPPLICATION_STATUS;

    opening_details?: any;
    user_details?: any;
}


export class ApplicationStatusUpdateDTO {
    @IsDefined()
    @IsIn(Object.keys(APPLICATION_STATUS))
    status: IAPPLICATION_STATUS;
}
