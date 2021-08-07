import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { TechnologySchema } from "./technology.schema";

export const TechnologyProviders = [
    {
        provide: MODAL_ENUMS.TECHNOLOGIES,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.TECHNOLOGIES, TechnologySchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]