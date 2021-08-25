/* eslint-disable prettier/prettier */
import { IsDefined, IsIn } from "class-validator";
import { IStatus, STATUS } from "src/shared/enums/app.properties";

export class CreateCategoryDto {
    _id?: string;

    categoryKey?: string;

    @IsDefined()
    name: string; 

    @IsDefined()
    @IsIn(Object.keys(STATUS))
    status: IStatus;
}

export class FilterCategoryByStatusDTO {
    status: IStatus;
}