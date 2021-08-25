/* eslint-disable prettier/prettier */
import { ITechnologyDocument } from './../technology/technology.schema';
import { TechnologyService } from './../technology/technology.service';
import { CurrentOpeningsDto, FilterCurrentOpeningsByStatusDTO } from './current-openings.dto';
import { ICurrentOpeningsDocument } from './current-openings.schema';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';

@Injectable()
export class CurrentOpeningsService {
    constructor(
        @Inject(MODAL_ENUMS.CURRENT_OPENINGS) private readonly currentOpeningsModel: Model<ICurrentOpeningsDocument>,
        private technologyService: TechnologyService
    ) { }

    async createNewOpenings(currentOpeningsPayload: CurrentOpeningsDto): Promise<CurrentOpeningsDto | NotFoundException | UnprocessableEntityException> {
        await this.checkTechnologies(currentOpeningsPayload.technologyKeys);
        try {
            const currentOpenings = new this.currentOpeningsModel(currentOpeningsPayload);
            return currentOpenings.save();
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async checkTechnologies(technologyKeys: string[]) {
        if (technologyKeys.length <= 0) {
            throw new HttpException('At least one technolgy key must exist', HttpStatus.NOT_MODIFIED);
        }
        for (let i = 0; i < technologyKeys.length; i++) {
            try {
                const result = await this.technologyService.getTechnologyById(technologyKeys[i]) as ITechnologyDocument[];
                if (result.length <= 0) {
                    throw new HttpException(`${technologyKeys[i]} technolgy not found`, HttpStatus.NOT_MODIFIED);
                }
            } catch (e) {
                throw new HttpException(`${technologyKeys[i]} key not found`, HttpStatus.NOT_MODIFIED);
            }
        }
    }

    async getAllCurrentOpeningsByFilter(filterPayload: FilterCurrentOpeningsByStatusDTO): Promise<CurrentOpeningsDto[]> {
        try {
            const currentOpeningsData = await this.currentOpeningsModel.find({ status: filterPayload.status }).exec();
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllCurrentOpenings(): Promise<CurrentOpeningsDto[] | UnprocessableEntityException> {
        try {
            const currentOpeningsData = await this.currentOpeningsModel.find({}).exec();
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getCurrentOpeningsByID(id: string): Promise<CurrentOpeningsDto | UnprocessableEntityException> {
        try {
            const currentOpeningsData = await this.currentOpeningsModel.findById(id).exec();
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async updateCurrentOpeningsByID(id: string, currentOpeningsPayload: CurrentOpeningsDto): Promise<CurrentOpeningsDto | UnprocessableEntityException | NotFoundException> {
       
        await this.checkTechnologies(currentOpeningsPayload.technologyKeys);

        try {
            const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate(id, currentOpeningsPayload).exec();
            if (!currentOpeningsData) {
                throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
            }
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async updateStatusById(id: string, status: FilterCurrentOpeningsByStatusDTO): Promise<CurrentOpeningsDto | UnprocessableEntityException | NotFoundException> {
       
        try {
            const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate(id, {status: status.status}).exec();
            if (!currentOpeningsData) {
                throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
            }
            currentOpeningsData['status'] = status.status;
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async deleteCurrentOpeningsById(id: string): Promise<CurrentOpeningsDto | UnprocessableEntityException | NotFoundException> {
       
        try {
            const currentOpeningsData = await this.currentOpeningsModel.findByIdAndDelete(id).exec();
            if (!currentOpeningsData) {
                throw new HttpException('Nothing has Deleted', HttpStatus.NOT_MODIFIED);
            }
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async incrementScheduledCount(id: string): Promise<CurrentOpeningsDto | UnprocessableEntityException | NotFoundException> {
        try {
            const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate({_id :id}, {$inc : {scheduledCount:1 }}).exec();
            if (!currentOpeningsData) {
                throw new HttpException('Nothing has udpated', HttpStatus.NOT_MODIFIED);
            }          
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
}
