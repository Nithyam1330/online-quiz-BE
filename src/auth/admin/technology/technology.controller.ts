/* eslint-disable prettier/prettier */
import { Controller, Delete, forwardRef, Get, Inject, OnModuleInit, Post, UseGuards } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ResponseHandlerService } from '../../../shared/services/response-handler/response-handler.service';
import { CurrentOpeningsService } from '../current-openings/current-openings.service';
import { CreateTechnologyDto } from './technology.dto';
import { TechnologyService } from './technology.service';

@Controller('technology')
export class TechnologyController  {
    
    constructor(
        private technologyService: TechnologyService,    
        private responseHandler: ResponseHandlerService,
        @Inject(forwardRef(() => CurrentOpeningsService))
        private currentOpeningService: CurrentOpeningsService
    ) {}

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteTechnology(@Param('id') technologyId: string) {

        return this.technologyService.getTechnologyById(technologyId).then(technology => {
            return this.currentOpeningService.getCurrentOpeningsByKey(technology['technologyKey']).then(openings => {
                const errMessage = `you cannot delete this ${technology['name']} technology! it is depended on the ${openings.length} current openings.`;
                if(openings.length > 0){
                    return this.responseHandler.successReponseHandler(errMessage, technology);
                }else{
                     return this.technologyService.deleteTechnology(technologyId).then(role => {
                        return this.responseHandler.successReponseHandler('Technology is deleted successfully', role);
                    }).catch((error: Error) => {
                        return this.responseHandler.errorReponseHandler(error);
                    })
                }
            });
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })     
       
    }

    @Get(':id')
    async getTechnologyById(@Param('id') technologyId: string) {
        return this.technologyService.getTechnologyByKey(technologyId).then(role => {
            return this.responseHandler.successReponseHandler('Get Technology by ID successful', role);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    
}
