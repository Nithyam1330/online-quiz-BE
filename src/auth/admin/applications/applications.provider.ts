
import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { ApplicationsSchema } from "./applications.schema";

export const ApplicationsProviders = [
    {
        provide: MODAL_ENUMS.APPLICATIONS,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.APPLICATIONS, ApplicationsSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]