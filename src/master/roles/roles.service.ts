import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { IRole } from './roles.dto';

@Injectable()
export class RolesService {
    constructor(@Inject(MODAL_ENUMS.ROLE_MODEL) private rolesModel: Model<IRole>) {
        
    }

    async createRoles(rolesPayload: IRole): Promise<IRole> {
        const createdRole = new this.rolesModel(rolesPayload);
        return createdRole.save();
    }
}
