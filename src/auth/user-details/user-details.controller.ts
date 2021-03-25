import { Body, Controller, Param, Post, UseGuards, Get, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ISuccessErrorObjectInterface, ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { UsersDetailsDto } from './user-details.dto';
import { UserDetailsService } from './user-details.service';

@UseGuards(JwtAuthGuard)
@Controller('user-details/:id')
export class UserDetailsController {
    constructor(private readonly userDetailsService: UserDetailsService,
        private readonly responseHandlerService: ResponseHandlerService) {

    }

    @Post()
    async profileUpdate(@Body() userDetailsPayload: UsersDetailsDto, @Param('id') userId: string): Promise<ISuccessErrorObjectInterface> {
        console.log(userId, 'userID');
        return this.userDetailsService.updateUserDetails(userDetailsPayload, userId).then((res: UsersDetailsDto) => {
            return this.responseHandlerService.successReponseHandler('User Details Updated successfully', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Put()
    async putProfileUpdate(@Body() userDetailsPayload: UsersDetailsDto, @Param('id') userId: string): Promise<ISuccessErrorObjectInterface> {
        console.log(userId, 'userID');
        return this.userDetailsService.putUserDetails(userDetailsPayload, userId).then((res: UsersDetailsDto) => {
            return this.responseHandlerService.successReponseHandler('User Details Updated successfully', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Get()
    async getUserDetails(@Param('id') userId: string): Promise<ISuccessErrorObjectInterface> {
        console.log(userId, 'userID');
        return this.userDetailsService.getUserDetails(userId).then((res: UsersDetailsDto[] | []) => {
            return this.responseHandlerService.successReponseHandler('Fetch User Details successful', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }
}
