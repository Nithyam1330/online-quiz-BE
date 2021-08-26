import { IsDefined, IsIn } from "class-validator";

export class CreateTechnologyDto {
    _id?: string;

    technologyKey?: string;

    @IsDefined()
    name: string; 

}