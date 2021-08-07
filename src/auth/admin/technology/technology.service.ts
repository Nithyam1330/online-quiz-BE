import { Inject, Injectable, NotFoundException, HttpStatus, UnprocessableEntityException, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { Utils } from 'src/shared/services/Utils/Utils';
import { CreateTechnologyDto } from './technology.dto';
import { ITechnologyDocument } from './technology.schema';

@Injectable()
export class TechnologyService {
    constructor(
        @Inject(MODAL_ENUMS.TECHNOLOGIES) private readonly technologyModel: Model<ITechnologyDocument>,
    ) {}

    async createTechnology(technologyPayload: CreateTechnologyDto): Promise<CreateTechnologyDto | UnprocessableEntityException> {
        try {
            technologyPayload.technologyKey = Utils.replaceAllSpecialCharactersWithHipens(technologyPayload.name);
            const technology = new this.technologyModel(technologyPayload);
            return technology.save();
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllTechnologies(): Promise<CreateTechnologyDto[] | UnprocessableEntityException> {
        try {
            const technologyDetails = await this.technologyModel.find({}).exec();
            return technologyDetails;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
      
    }

    async deleteTechnology(technologyId: string): Promise<ITechnologyDocument | NotFoundException | UnprocessableEntityException> {
        try {
            const result = await this.technologyModel.findByIdAndDelete(technologyId).exec();
            return result;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
      
    }

    async getTechnologyById(technologyId: string): Promise<ITechnologyDocument[] | NotFoundException | UnprocessableEntityException> {
        try {
            const result = await this.technologyModel.find({technologyKey: technologyId}).exec();
            return result;
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
       
    }

}
