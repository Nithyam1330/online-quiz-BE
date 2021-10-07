/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/auth/user/user.dto';
import { IUserRoles } from './../../enums/app.properties';

@Injectable()
export class JwtAuthService {
    constructor(
        private jwtService: JwtService
      ) {}

      async generateJWT(user: LoginDTO, role: IUserRoles) {
          const payload = {username: user.email, role: role};
          return {
              access_token: this.jwtService.sign(payload)
          }
      }
}
