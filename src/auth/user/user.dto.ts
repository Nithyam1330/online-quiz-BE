/* eslint-disable prettier/prettier */
import { ArrayMinSize, IsArray, isArray, IsDefined, IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { USER_ROLES, IUserRoles } from 'src/shared/enums/app.properties';
export class UsersDto {
    _id?: string;

    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    password: string;

    @IsDefined()
    username: string;

    @IsDefined()
    experience: number;
    
    @IsDefined()
    confirmPassword: string;

    @IsDefined()
    @IsArray()
    @ArrayMinSize(1)
    skills: Array<string>;

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