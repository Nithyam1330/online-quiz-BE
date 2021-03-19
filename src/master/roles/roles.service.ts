import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

    async deleteRoles(roleId: string): Promise<IRole | NotFoundException> {
        const result = await this.rolesModel.findByIdAndDelete(roleId).exec();
        return result;
    }

    async getAllRoles(): Promise<IRole[]> {
        const result = await this.rolesModel.find({}).exec();
        return result;
    }

    async getRoleByRoleId(roleId: string): Promise<IRole | NotFoundException> {
        const result = await this.rolesModel.findById(roleId).exec();
        if (result) {
            return result;
        }
        throw new NotFoundException('Could not find the role');
    }
}
