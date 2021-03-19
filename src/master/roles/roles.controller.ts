import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { IRole } from './roles.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {

    }
    @Post('create')
    async createRoles(@Body() rolesObj: IRole) {
        console.log(rolesObj);
        return this.rolesService.createRoles(rolesObj).then(res => {
            return {
                statusCode: HttpStatus.OK,
                message: 'Roles Created successfully',
                data: res
            }
        }).catch(error => {
            console.log(error.errors);
            if (error && error.errors) {
                if (error.errors.name) {
                    if (error.errors.name.kind === 'required') {
                        return {
                            statusCode: HttpStatus.BAD_REQUEST,
                            message: 'name is required',
                            data: null
                        }
                    }
                }
                if (error.errors.role_id) {
                    if (error.errors.role_id.kind === 'unique') {
                        return {
                            statusCode: HttpStatus.BAD_REQUEST,
                            message: 'RoleID must be unique.Role Already Exist',
                            data: null
                        }
                    } else if (error.errors.role_id.kind === 'required') {
                        return {
                            statusCode: HttpStatus.BAD_REQUEST,
                            message: 'RoleID is required',
                            data: null
                        }
                    }
                }
            }
        });

    }

}
