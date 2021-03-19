import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { IRole } from './roles.schema';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly responseHandlerService: ResponseHandlerService) {

    }
    @Post('')
    async createRoles(@Body() rolesObj: IRole) {
        return this.rolesService.createRoles(rolesObj).then(res => {
            return this.responseHandlerService.successReponseHandler('Roles Created successfully', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });

    }

    @Delete(':id')
    async deleteRole(@Param('id') roleId: string) {
        return this.rolesService.deleteRoles(roleId).then(role => {
            return this.responseHandlerService.successReponseHandler('Role id is deleted successfully', role);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        })
    }


    @Get()
    async getRoles() {
        return this.rolesService.getAllRoles().then((roles: IRole[]) => {
            return this.responseHandlerService.successReponseHandler('Get All Roles is successfull', roles);

        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);

        })
    }


    @Get(':id')
    async getRolesById(@Param('id') roleId: string) {
        return this.rolesService.getRoleByRoleId(roleId).then((role: IRole) => {
            return this.responseHandlerService.successReponseHandler('Get Role By Role id is successfull', role);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);

        })
    }

}
