import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

    async createTechnology(technologyPayload: CreateTechnologyDto): Promise<CreateTechnologyDto> {
        technologyPayload.technologyKey = Utils.replaceAllSpecialCharactersWithHipens(technologyPayload.name);
        const technology = new this.technologyModel(technologyPayload);
        return technology.save();
    }

    async getAllTechnologies(): Promise<CreateTechnologyDto[]> {
        const technologyDetails = await this.technologyModel.find({}).exec();
        return technologyDetails;
    }

    async deleteTechnology(technologyId: string): Promise<ITechnologyDocument | NotFoundException> {
        const result = await this.technologyModel.findByIdAndDelete(technologyId).exec();
        return result;
    }


}
