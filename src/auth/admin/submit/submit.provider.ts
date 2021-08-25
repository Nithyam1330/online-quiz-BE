
import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { SubmitSchema } from "./submit.schema";

export const SubmitProviders = [
    {
        provide: MODAL_ENUMS.SUBMIT,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.SUBMIT, SubmitSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]