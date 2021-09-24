import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { FeedbackSchema } from "./feedback.schema";

export const FeedbackProviders = [
    {
        provide: MODAL_ENUMS.FEEDBACK,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.FEEDBACK, FeedbackSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]