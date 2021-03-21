import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { UsersSchema } from "./user.schema";

export const UserProviders = [
    {
        provide: MODAL_ENUMS.USERS,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.USERS, UsersSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]