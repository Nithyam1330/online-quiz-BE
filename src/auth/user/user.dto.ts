import { IsDefined, IsEmail, IsIn } from 'class-validator';
import { USER_ROLES, IUserRoles } from 'src/shared/enums/app.properties';
import { LoginProvidersType, LOGIN_PROVIDERS } from "src/shared/enums/login-providers.enums";
export class UsersDto {
    _id?: string;

    @IsDefined()
    @IsEmail()
    username: string;

    password: string;

    @IsDefined()
    @IsIn(Object.keys(LOGIN_PROVIDERS))
    provider: LoginProvidersType;

    @IsDefined()
    @IsIn(Object.keys(USER_ROLES))
    role: IUserRoles;
}

export class ForgotPasswordDto {
    @IsDefined()
    @IsEmail()
    username: string;
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
    username: string;

    @IsDefined()
    password: string;
}