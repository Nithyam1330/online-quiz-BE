import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { IGenderDocument } from './gener.schema';

@Injectable()
export class GenderService {
    constructor(@Inject(MODAL_ENUMS.GENDER_MODEL) private readonly genderModel: Model<IGenderDocument>) {

    }

    async createGender(payload: IGenderDocument): Promise<IGenderDocument> {
        const genderObj = new this.genderModel(payload);
        return genderObj.save();
    }

    async getAllGendersList(): Promise<IGenderDocument[]> {
        const result = await this.genderModel.find({}).exec();
        return result;
    }

    async getGenderByID(_id: string): Promise<IGenderDocument> {
        const result = await this.genderModel.findById(_id).exec();
        return result;
    }

    async updateGenderByID(_id: string, payload: IGenderDocument): Promise<IGenderDocument> {
        delete payload.gender_id;
        const result = await this.genderModel.findByIdAndUpdate(_id, payload).exec();
        return result;
    }

    async deleteGenderByID(_id: string): Promise<IGenderDocument> {
        const deletedRecord = await this.genderModel.findByIdAndRemove(_id).exec();
        return deletedRecord;
    }
}
