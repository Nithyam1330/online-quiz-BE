import { Connection } from "mongoose";
import { COLLECTION_NAMES, MODAL_ENUMS } from "src/shared/enums/models.enums";
import { GenderSchema } from "./gener.schema";

export const GenderProviders = [
    {
        provide: MODAL_ENUMS.GENDER_MODEL,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.GENDERS, GenderSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]