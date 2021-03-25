import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { UserDetailsSchema } from './user-details.schema';
export const UserDetailProviders = [
    {
        provide: MODAL_ENUMS.USER_DETAILS,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.USER_DETAILS, UserDetailsSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]