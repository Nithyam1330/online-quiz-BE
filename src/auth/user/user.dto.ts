/* eslint-disable prettier/prettier */
import { IsDefined, IsEmail, IsIn } from 'class-validator';
import { USER_ROLES, IUserRoles } from 'src/shared/enums/app.properties';
import { IOPENING_STATUS, OPENING_STATUS } from './../../shared/enums/app.properties';
export class UsersDto {
    _id?: string;

    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    password: string;
    
    @IsDefined()
    confirmPassword: string;

    @IsDefined()
    currentOpeningsId: string;

    @IsDefined()
    @IsIn(Object.keys(OPENING_STATUS))
    status: IOPENING_STATUS;

    @IsDefined()
    @IsIn(Object.keys(USER_ROLES))
    role: IUserRoles;

    uid: string;
}

export class ForgotPasswordDto {
    @IsDefined()
    @IsEmail()
    email: string;
}


export class ResetPasswordDTO {
    @IsDefined()
    oldPassword: string;

    @IsDefined()
    newPassword: string;

    @IsDefined()
    confirmPassword: string;
}


export class LoginDTO {
    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    password: string;
}