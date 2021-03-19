import { Connection } from 'mongoose';
import { MODAL_ENUMS, COLLECTION_NAMES } from 'src/shared/enums/models.enums';
import { RoleSchema } from './roles.schema';

export const RolesProviders = [
    {
        provide: MODAL_ENUMS.ROLE_MODEL,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.ROLES, RoleSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION],
    },
];