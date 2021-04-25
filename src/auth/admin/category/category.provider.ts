import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { CategorySchema } from "./category.schema";

export const CategoryProviders = [
    {
        provide: MODAL_ENUMS.CATEGORIES,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.CATEGORIES, CategorySchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]