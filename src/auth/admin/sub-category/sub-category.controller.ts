import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { IStatus } from 'src/shared/enums/app.properties';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { CreateSubCategoryDto, FilterSubCategoryByStatusDTO } from './sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-category')
export class SubCategoryController {
    constructor(
        private readonly responseHandler: ResponseHandlerService,
        private readonly subCategoryService: SubCategoryService
    ) { }

    @Post('')
    async createSubCategory(@Body() subCategoryPayload: CreateSubCategoryDto) {
        return this.subCategoryService.createSubCategory(subCategoryPayload).then(res => {
            return this.responseHandler.successReponseHandler('Sub Category Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':subCategoryKey')
    async updateSubCategory(@Body() subCategoryPayload: CreateSubCategoryDto, @Param('subCategoryKey') subCategoryKey: string) {
        return this.subCategoryService.updateSubCategory(subCategoryPayload, subCategoryKey).then(res => {
            return this.responseHandler.successReponseHandler('Sub Category Updated Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':subCategoryKey/:status')
    async updateStatus(@Param('subCategoryKey') subCategoryKey: string, @Param('status') status: IStatus) {
        return this.subCategoryService.updateSubCategoryStatus(subCategoryKey, status).then(res => {
            return this.responseHandler.successReponseHandler('Sub Category Status Updated Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Post('filterByStatus')
    async getAllSubCategoryByFilter(@Body() status: FilterSubCategoryByStatusDTO) {
        return this.subCategoryService.getAllSubCategoryByFilter(status).then(res => {
            return this.responseHandler.successReponseHandler('Get All Sub categories by filter Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get('')
    async getAllSubCategories() {
        return this.subCategoryService.getAllSubCategories().then(res => {
            return this.responseHandler.successReponseHandler('Get All Sub categories Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }


    @Get(':id')
    async getCategoryByCategoryKey(@Param('id') subCategoryKey: string) {
        return this.subCategoryService.getSubCategoryBySubCategoryKey(subCategoryKey).then(res => {
            return this.responseHandler.successReponseHandler('Get Category by Category Key Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
