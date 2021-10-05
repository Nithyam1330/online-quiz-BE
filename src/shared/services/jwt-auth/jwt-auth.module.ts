/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRET_KEY_JSON_WEB_TOKEN } from 'src/shared/enums/app.properties';
import { JwtAuthService } from './jwt-auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: SECRET_KEY_JSON_WEB_TOKEN,
            signOptions: { expiresIn: '1h' },
          }),
    ],
    providers: [JwtAuthService, JwtStrategy],
    exports: [JwtModule, JwtAuthService, PassportModule]
})
export class JwtAuthModule {}
