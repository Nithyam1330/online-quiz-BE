import { Body, Controller, Param, Post, UseGuards, Get, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/services/jwt-auth/jwt-authguard';
import { ISuccessErrorObjectInterface, ResponseHandlerService } from 'src/shared/services/response-handler/response-handler.service';
import { AddressDTO, UsersDetailsDto } from './user-details.dto';
import { UserDetailsService } from './user-details.service';

@UseGuards(JwtAuthGuard)
@Controller('user-details/:id')
export class UserDetailsController {
    constructor(private readonly userDetailsService: UserDetailsService,
        private readonly responseHandlerService: ResponseHandlerService) {

    }

    @Post()
    async profileUpdate(@Body() userDetailsPayload: UsersDetailsDto, @Param('id') userId: string): Promise<ISuccessErrorObjectInterface> {
        return this.userDetailsService.updateUserDetails(userDetailsPayload, userId).then((res: UsersDetailsDto) => {
            return this.responseHandlerService.successReponseHandler('User Details Updated successfully', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Put()
    async putProfileUpdate(@Body() userDetailsPayload: UsersDetailsDto, @Param('id') userId: string): Promise<ISuccessErrorObjectInterface> {
        return this.userDetailsService.putUserDetails(userDetailsPayload, userId).then((res: UsersDetailsDto) => {
            return this.responseHandlerService.successReponseHandler('User Details Updated successfully', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Get()
    async getUserDetails(@Param('id') userId: string): Promise<ISuccessErrorObjectInterface> {
        return this.userDetailsService.getUserDetails(userId).then((res: UsersDetailsDto[] | []) => {
            return this.responseHandlerService.successReponseHandler('Fetch User Details successful', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Post('address')
    async addAddress(@Param('id') userId: string, @Body() addressBody: AddressDTO): Promise<ISuccessErrorObjectInterface> {
        return this.userDetailsService.addAddress(userId, addressBody).then(res => {
            return this.responseHandlerService.successReponseHandler('Added new Address', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Get('address')
    async getAllAddress(@Param('id') userId: string): Promise<ISuccessErrorObjectInterface> {
        return this.userDetailsService.getAllAddress(userId).then(res => {
            return this.responseHandlerService.successReponseHandler('Get All address is successful', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Get('address/:address_id')
    async getAddressByAddressID(@Param('id') userId: string, @Param('address_id') addressId: string): Promise<ISuccessErrorObjectInterface> {
        return this.userDetailsService.getAddressByAddressID(userId, addressId).then(res => {
            return this.responseHandlerService.successReponseHandler('Get address details is successful', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }

    @Put('address/:address_id')
    async updateAddressByIndex(@Param('id') userId: string, @Param('address_id') addressId: string, @Body() addressPayload: AddressDTO): Promise<ISuccessErrorObjectInterface> {
        return this.userDetailsService.updateAddressByIndex(userId, addressId, addressPayload).then(res => {
            return this.responseHandlerService.successReponseHandler('Update address details is successful', res);
        }).catch((error: Error) => {
            return this.responseHandlerService.errorReponseHandler(error);
        });
    }
}
