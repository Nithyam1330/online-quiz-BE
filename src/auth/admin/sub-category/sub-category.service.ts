import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IStatus } from 'src/shared/enums/app.properties';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { Utils } from 'src/shared/services/Utils/Utils';
import { ICategoryDocument } from '../category/category.schema';
import { CategoryService } from '../category/category.service';
import { CreateSubCategoryDto, FilterSubCategoryByStatusDTO } from './sub-category.dto';
import { ISubCategoryDocument } from './sub-category.schema';

@Injectable()
export class SubCategoryService {

    constructor(
        @Inject(MODAL_ENUMS.CATEGORIES) private readonly categoryModel: Model<ICategoryDocument>,
        @Inject(MODAL_ENUMS.SUB_CATEGORIES) private readonly subCategoryModel: Model<ISubCategoryDocument>,
        private readonly categoryService: CategoryService
    ) {}

    async createSubCategory(subCategoryPayload: CreateSubCategoryDto): Promise<CreateSubCategoryDto> {
        const category = await this.categoryService.getCategoryByCategoryKey(subCategoryPayload.categoryKey);
        if (!category) {
            throw new HttpException('Category Not found', HttpStatus.NOT_MODIFIED);
        }
        subCategoryPayload.subCategoryKey = Utils.replaceStringSpacesWithHipens(subCategoryPayload.name);
        const subCategory = new this.subCategoryModel(subCategoryPayload);
        return subCategory.save();
    }

    async updateSubCategory(subCategoryPayload: CreateSubCategoryDto, subCategoryKey: string): Promise<CreateSubCategoryDto> {
        const category = await this.categoryService.getCategoryByCategoryKey(subCategoryPayload.categoryKey);
        if (!category) {
            throw new HttpException('Category Not found', HttpStatus.NOT_MODIFIED);
        }
        const subCategoryDetails = await this.subCategoryModel.findOneAndUpdate({subCategoryKey: subCategoryKey}, subCategoryPayload).exec();
        if (!subCategoryDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return subCategoryPayload;
    }

    async updateSubCategoryStatus(subCategoryKey: string, status: IStatus): Promise<CreateSubCategoryDto> {
        const subCategoryDetails = await this.subCategoryModel.findOneAndUpdate({subCategoryKey: subCategoryKey}, {status: status}).exec();
        if (!subCategoryDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return await this.getSubCategoryBySubCategoryKey(subCategoryKey);
    }

    async getSubCategoryBySubCategoryKey(subCategoryKey: string): Promise<CreateSubCategoryDto> {
        const subCategoryDetails = await this.subCategoryModel.find({subCategoryKey: subCategoryKey}).exec();
        if (subCategoryDetails.length <= 0) {
            throw new HttpException('Sub Category Not Found', HttpStatus.NOT_FOUND);
        }
        return subCategoryDetails[0];
    }

    async getAllSubCategoryByFilter(filterPayload: FilterSubCategoryByStatusDTO): Promise<CreateSubCategoryDto[]> {
        const subCategoryModel = await this.subCategoryModel.find({status: filterPayload.status}).exec();
        return subCategoryModel;
    }

    async getAllSubCategories(): Promise<CreateSubCategoryDto[]> {
        const subCategoryDetails = await this.subCategoryModel.find({}).exec();
        return subCategoryDetails;
    }
}
