import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IStatus } from 'src/shared/enums/app.properties';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { Utils } from 'src/shared/services/Utils/Utils';
import { CreateCategoryDto, FilterCategoryByStatusDTO } from './category.dto';
import { ICategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {
    constructor(
        @Inject(MODAL_ENUMS.CATEGORIES) private readonly categoryModel: Model<ICategoryDocument>,
    ) {
    }

    async createCategory(categoryPayload: CreateCategoryDto): Promise<CreateCategoryDto> {
        categoryPayload.categoryKey = Utils.replaceStringSpacesWithHipens(categoryPayload.name);
        const category = new this.categoryModel(categoryPayload);
        return category.save();
    }

    async updateCategory(categoryPayload: CreateCategoryDto, categoryKey: string): Promise<CreateCategoryDto> {
        const categoryDetails = await this.categoryModel.findOneAndUpdate({categoryKey: categoryKey}, categoryPayload).exec();
        if (!categoryDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return categoryPayload;
    }

    async updateStatus(categoryKey: string, status: IStatus): Promise<CreateCategoryDto> {
        const categoryDetails = await this.categoryModel.findOneAndUpdate({categoryKey: categoryKey}, {status: status}).exec();
        if (!categoryDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return await this.getCategoryByCategoryKey(categoryKey);
    }

    async getAllCategoryByFilter(filterPayload: FilterCategoryByStatusDTO): Promise<CreateCategoryDto[]> {
        const categoryDetails = await this.categoryModel.find({status: filterPayload.status}).exec();
        return categoryDetails;
    }

    async getAllCategories(): Promise<CreateCategoryDto[]> {
        const categoryDetails = await this.categoryModel.find({}).exec();
        return categoryDetails;
    }

    async getCategoryByCategoryKey(categoryKey: string): Promise<CreateCategoryDto> {
        const categoryDetails = await this.categoryModel.find({categoryKey: categoryKey}).exec();
        if (categoryDetails.length <= 0) {
            throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
        }
        return categoryDetails[0];
    }
}
