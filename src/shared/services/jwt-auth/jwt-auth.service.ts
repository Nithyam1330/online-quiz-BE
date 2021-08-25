/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/auth/user/user.dto';

@Injectable()
export class JwtAuthService {
    constructor(
        private jwtService: JwtService
      ) {}

      async generateJWT(user: LoginDTO) {
          const payload = {username: user.email};
          return {
              access_token: this.jwtService.sign(payload)
          }
      }
}
