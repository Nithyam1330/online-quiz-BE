import { IsDefined, IsIn } from "class-validator";

export class CreateTechnologyDto {
    _id?: string;

    @IsDefined()
    technologyKey?: string;

    @IsDefined()
    name: string; 

}