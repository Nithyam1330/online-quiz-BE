import { IsDefined, IsIn } from "class-validator";
import { IStatus, STATUS } from "src/shared/enums/app.properties";

export class CreateSubCategoryDto {
    _id?: string;

    subCategoryKey?: string;
    
    @IsDefined()
    categoryKey: string;

    @IsDefined()
    name: string; 

    @IsDefined()
    @IsIn(Object.keys(STATUS))
    status: IStatus;
}

export class FilterSubCategoryByStatusDTO {
    status: IStatus;
}