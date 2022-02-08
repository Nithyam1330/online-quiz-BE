/* eslint-disable prettier/prettier */
import { ITechnologyDocument } from './../technology/technology.schema';
import { TechnologyService } from './../technology/technology.service';
import { CurrentOpeningsDto, FilterCurrentOpeningsByStatusDTO } from './current-openings.dto';
import { ICurrentOpeningsDocument } from './current-openings.schema';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { STATUS } from 'src/shared/enums/app.properties';
import { UserService } from 'src/auth/user/user.service';
import { CurrentOpeningsByUserDTO } from './current-openings.dto';



@Injectable()
export class CurrentOpeningsService {
    constructor(
        @Inject(MODAL_ENUMS.CURRENT_OPENINGS) private readonly currentOpeningsModel: Model<ICurrentOpeningsDocument>,
        private technologyService: TechnologyService,
        private userService: UserService
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

    async getAllCurrentOpeningsByFilter(filterPayload: FilterCurrentOpeningsByStatusDTO): Promise<CurrentOpeningsByUserDTO> {
        try {
            const currentOpeningsData = await this.currentOpeningsModel.find({ status: filterPayload.status }).exec();
            const currentOpenings:CurrentOpeningsByUserDTO = {
                applicationInfo: currentOpeningsData,
                updatedIdDetails: null,
                createdDetails: null
            }
            if(currentOpeningsData.length > 0) {
                const updatedByIds = currentOpeningsData.map(obj => obj.updatedBy);
                currentOpenings.updatedIdDetails = await this.userService.getUsersByIds(updatedByIds);
                const createdByIds = currentOpeningsData.map(obj => obj.createdBy);
                currentOpenings.createdDetails = await this.userService.getUsersByIds(createdByIds);
            }
            return currentOpenings;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllCurrentOpenings(): Promise<CurrentOpeningsByUserDTO | UnprocessableEntityException> {
        try {
            const currentOpeningsData = await this.currentOpeningsModel.find({}).exec();
            const currentOpenings:CurrentOpeningsByUserDTO = {
                applicationInfo: currentOpeningsData,
                updatedIdDetails: null,
                createdDetails: null
            }
            if(currentOpeningsData.length > 0) {
                const updatedByIds = currentOpeningsData.map(obj => obj.updatedBy);
                currentOpenings.updatedIdDetails = await this.userService.getUsersByIds(updatedByIds);
                const createdByIds = currentOpeningsData.map(obj => obj.createdBy);
                currentOpenings.createdDetails = await this.userService.getUsersByIds(createdByIds);
            }
            return currentOpenings;
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
            const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate(id, { status: status.status }).exec();
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
        const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate({ _id: id }, { $inc: { scheduledCount: 1 } }).exec();
        if (!currentOpeningsData) {
            throw new HttpException('Nothing has udpated', HttpStatus.NOT_MODIFIED);
        }
        return currentOpeningsData;
    }

    async incrementAppliedCount(id: string): Promise<CurrentOpeningsDto | UnprocessableEntityException | NotFoundException> {
        const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate({ _id: id }, { $inc: { appliedCount: 1 } }).exec();
        if (!currentOpeningsData) {
            throw new HttpException('Nothing has udpated', HttpStatus.NOT_MODIFIED);
        }
        return currentOpeningsData;
    }

    async incrementHoldCount(id: string): Promise<CurrentOpeningsDto | UnprocessableEntityException | NotFoundException> {
        const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate({ _id: id }, { $inc: { onHoldCount: 1 } }).exec();
        if (!currentOpeningsData) {
            throw new HttpException('Nothing has udpated', HttpStatus.NOT_MODIFIED);
        }
        return currentOpeningsData;
    }

    async incrementHiredCount(id: string): Promise<CurrentOpeningsDto | UnprocessableEntityException | NotFoundException> {
        const currentOpeningsData = await this.currentOpeningsModel.findByIdAndUpdate({ _id: id }, { $inc: { onHoldCount: 1 } }).exec();
        if (!currentOpeningsData) {
            throw new HttpException('Nothing has udpated', HttpStatus.NOT_MODIFIED);
        }
        return currentOpeningsData;
    }

    async checkCurrentOpeningWithActiveStatus(id: string): Promise<void> {
        const currentOpeningsData = await this.currentOpeningsModel.find({ _id: id, status: STATUS.ACTIVE }).exec();
        if (!currentOpeningsData || (currentOpeningsData && !currentOpeningsData.length)) {
            throw new HttpException('Given current Opening is not active', HttpStatus.NOT_MODIFIED);
        }
    }

    
    async getCurrentOpeningsByIDList(ids: any): Promise<CurrentOpeningsDto[] | UnprocessableEntityException> {
        
        try {
            const currentOpeningsData = await this.currentOpeningsModel.find({_id: {$in: ids}}, {title: 1, description:1,technologyKeys: 1});
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getCurrentOpeningsByKey(technologyKey: any){
        
        try {
            const currentOpeningsData = await this.currentOpeningsModel.find({technologyKeys: [technologyKey]});
            return currentOpeningsData;
        } catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

   

}
