import { Controller, Delete, Get, Post } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { ResponseHandlerService } from '../../../shared/services/response-handler/response-handler.service';
import { CreateTechnologyDto } from './technology.dto';
import { TechnologyService } from './technology.service';

@Controller('technology')
export class TechnologyController {
    constructor(
        private technologyService: TechnologyService,
        private responseHandler: ResponseHandlerService
    ) {}

    @Post('')
    async createTechnology(@Body() technologyPayload: CreateTechnologyDto) {
        return this.technologyService.createTechnology(technologyPayload).then(res => {
            return this.responseHandler.successReponseHandler('Technology Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get()
    async getAllTechnologies() {
        return this.technologyService.getAllTechnologies().then(res=> {
            return this.responseHandler.successReponseHandler('Get all technologies successful', res);
        }).catch((err: Error) => {
            return this.responseHandler.errorReponseHandler(err);
        })
    }

    @Delete(':id')
    async deleteTechnology(@Param('id') technologyId: string) {
        return this.technologyService.deleteTechnology(technologyId).then(role => {
            return this.responseHandler.successReponseHandler('Technology is deleted successfully', role);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    
}
