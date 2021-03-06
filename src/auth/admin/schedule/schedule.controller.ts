/* eslint-disable prettier/prettier */
import { CreateScheduleDto } from './schedule.dto';
import { ScheduleService } from './schedule.service';
import { Body, Controller, Post, Get, Param, Put, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { USER_ROLES } from 'src/shared/enums/app.properties';
import { RoleGuard } from 'src/shared/services/role-guard/role.guard';

@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class ScheduleController {
    constructor(
        private readonly responseHandler: ResponseHandlerService,
        private readonly scheduleService: ScheduleService,
    ) { }

    @SetMetadata('roles', [USER_ROLES.ADMIN])
    @UseGuards(RoleGuard)
    @Post()
    async createSchedule(@Body() schedulePayload: CreateScheduleDto) {
        return this.scheduleService.createSchedule(schedulePayload).then(res => {
            return this.responseHandler.successReponseHandler('Schedule Created Successfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @SetMetadata('roles', [USER_ROLES.ADMIN])
    @UseGuards(RoleGuard)
    @Get()
    async getAllSchedules() {
        return this.scheduleService.getAllSchedules().then(res => {
            return this.responseHandler.successReponseHandler('Get All Schedules Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get(':id')
    async getScheduleBId(@Param('id') scheduleId: string) {
        return this.scheduleService.getScheduleById(scheduleId).then(res => {
            return this.responseHandler.successReponseHandler('Get schedule by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put(':id')
    async updateSchedule(@Param('id') id: string, @Body() schedulePayload: CreateScheduleDto) {
        return this.scheduleService.updateSchedule(id, schedulePayload).then(res => {
            return this.responseHandler.successReponseHandler('Update Schedule by id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Delete(':id')
    async deleteScheduleById(@Param('id') id: string) {
        return this.scheduleService.deleteSchedule(id).then(res => {
            return this.responseHandler.successReponseHandler('Schedule by id deleted Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get('user/:id')
    async getAllSchedulesByUserId(@Param('id') id: string) {
        return this.scheduleService.getAllSchedulesByUserId(id).then(res => {
            return this.responseHandler.successReponseHandler('Schedule by user id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Put('')
    async updateScheduleByApplicationId(@Body() schedulePayload: CreateScheduleDto) {
        return this.scheduleService.updateScheduleByApplicationId(schedulePayload).then(res => {
            return this.responseHandler.successReponseHandler('Update Schedule by application id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get('applications/:id')
    async getScheduleByApplicationId(@Param('id') applicationId: string) {
        return this.scheduleService.getScheduleByApplicationId(applicationId).then(res => {
            return this.responseHandler.successReponseHandler('Get schedule by application id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

    @Get('stats/:id')
    async getScheduleStatsByApplicationId(@Param('id') applicationId: string) {
        return this.scheduleService.getScheduleStats(applicationId).then(res => {
            return this.responseHandler.successReponseHandler('Get quiz stats by application id Successfull', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        })
    }

}
