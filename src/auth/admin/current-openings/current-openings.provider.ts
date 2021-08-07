import { CurrentOpeningsSchema } from './current-openings.schema';

import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";

export const CurrentOpeningsProviders = [
    {
        provide: MODAL_ENUMS.CURRENT_OPENINGS,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.CURRENT_OPENINGS, CurrentOpeningsSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]