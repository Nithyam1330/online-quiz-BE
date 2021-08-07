import { IsDefined, IsIn } from "class-validator";
import { IStatus, STATUS } from "src/shared/enums/app.properties";

export class CurrentOpeningsDto {
    _id?: string;

    @IsDefined()
    technologyKeys: string[];

    @IsDefined()
    title: string;

    @IsDefined()
    description: string;

    @IsDefined()
    openingCount: number;

    @IsDefined()
    createdBy: string;

    @IsDefined()
    updatedBy: string;

    
    @IsDefined()
    @IsIn(Object.keys(STATUS))
    status: IStatus;

    appliedCount: number = 0;
    scheduledCount: number = 0;
    onHoldCount: number = 0;
    hiredCount: number = 0;

}

export class FilterCurrentOpeningsByStatusDTO {
    @IsDefined()
    @IsIn(Object.keys(STATUS))
    status: IStatus;
}