import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IStatus } from 'src/shared/enums/app.properties';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { CreateCategoryDto, FilterCategoryByStatusDTO } from './category.dto';
import { CategoryService } from './category.service';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private responseHandler: ResponseHandlerService
    ) {

    }
    @Post('')
    async createCategory(@Body() categoryPayload: CreateCategoryDto) {
        return this.categoryService.createCategory(categoryPayload).then(res => {
            return this.responseHandler.successReponseHandler('Category Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':id')
    async updateCategory(@Body() categoryPayload: CreateCategoryDto, @Param('id') categoryKey: string) {
        return this.categoryService.updateCategory(categoryPayload, categoryKey).then(res => {
            return this.responseHandler.successReponseHandler('Category Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':categoryKey/:status')
    async updateStatus(@Param('categoryKey') categoryKey: string, @Param('status') status: IStatus) {
        return this.categoryService.updateStatus(categoryKey, status).then(res => {
            return this.responseHandler.successReponseHandler('Category Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Post('filterByStatus')
    async getAllCategoryByFilter(@Body() status: FilterCategoryByStatusDTO) {
        return this.categoryService.getAllCategoryByFilter(status).then(res => {
            return this.responseHandler.successReponseHandler('Get All categories by filter Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get('')
    async getAllCategories() {
        return this.categoryService.getAllCategories().then(res => {
            return this.responseHandler.successReponseHandler('Get All categories Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id')
    async getCategoryByCategoryKey(@Param('id') categoryKey: string) {
        return this.categoryService.getCategoryByCategoryKey(categoryKey).then(res => {
            return this.responseHandler.successReponseHandler('Get Category by Category Key Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }
}
