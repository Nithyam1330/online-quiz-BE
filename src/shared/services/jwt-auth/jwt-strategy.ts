/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersDto } from 'src/auth/user/user.dto';
import { SECRET_KEY_JSON_WEB_TOKEN } from 'src/shared/enums/app.properties';
import { JwtAuthService } from './jwt-auth.service';

@Injectable({})
export class JwtStrategy extends PassportStrategy(Strategy) { 
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: SECRET_KEY_JSON_WEB_TOKEN,
        });  
    }
    
    async validate(payload: UsersDto) {
        return { username: payload.email };
    }
}