/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const auth  = context.getArgs()[0].headers['authorization'].replace('Bearer ', '');
    const json = await this.jwtService.decode(auth);
    const index = roles.findIndex(obj => json['role'] === obj);
    if(index !== -1) {
      return true;
    }
    return false;
  }
}
