import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { UsersDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly responseHandler: ResponseHandlerService){

    }

    @Post('')
    async createUser(@Body() userPayload: UsersDto) {
        return this.userService.createUser(userPayload).then((res: UsersDto) => {
            return this.responseHandler.successReponseHandler('User Created Succesfully', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        }) 
    }

    @Get(':id')
    async getUserByUserID(@Param('id') userId: string) {
        return this.userService.getUserByUserID(userId).then((res: UsersDto) => {
            return this.responseHandler.successReponseHandler('Get User details is succesful', res);
        }).catch((error: Error) => {
            return this.responseHandler.errorReponseHandler(error);
        }) 
    }
}
