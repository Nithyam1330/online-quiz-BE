
import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { SubCategorySchema } from "./sub-category.schema";

export const SubCategoryProviders = [
    {
        provide: MODAL_ENUMS.SUB_CATEGORIES,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.SUB_CATEGORIES, SubCategorySchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]