/* eslint-disable prettier/prettier */
import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { ApplicationImageSchema } from './application-images.schema';

export const ApplicationImageProviders = [
    {
        provide: MODAL_ENUMS.APPLICATION_IMAGES,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.APPLICATION_IMAGES, ApplicationImageSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]