import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { IGender } from './gener.schema';

@Injectable()
export class GenderService {
    constructor(@Inject(MODAL_ENUMS.GENDER_MODEL) private readonly genderModel: Model<IGender>) {

    }
    
    async createGender(payload: IGender): Promise<IGender> {
        const genderObj = new this.genderModel(payload);
        return genderObj.save();
    }

    async getAllGendersList(): Promise<IGender[]> {
        const result = await this.genderModel.find({}).exec();
        return result;
    }

    async getGenderByID(_id: string): Promise<IGender> {
        const result = await this.genderModel.findById(_id).exec();
        return result;
    }

    async updateGenderByID(_id: string, payload: IGender): Promise<IGender> {
        delete payload.gender_id;
        const result = await this.genderModel.findByIdAndUpdate(_id, payload).exec();
        return result;
    }

    async deleteGenderByID(_id: string): Promise<IGender> {
        const deletedRecord = await this.genderModel.findByIdAndRemove(_id).exec();
        return deletedRecord;
    }
}
