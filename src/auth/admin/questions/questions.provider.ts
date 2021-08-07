import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { QuuestionSchema } from "./questions.schema";

export const QuestionsProviders = [
    {
        provide: MODAL_ENUMS.QUESTIONS,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.QUESTIONS, QuuestionSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]