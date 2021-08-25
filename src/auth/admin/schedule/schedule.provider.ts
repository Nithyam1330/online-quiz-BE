
import { Connection } from "mongoose";
import { MODAL_ENUMS, COLLECTION_NAMES } from "src/shared/enums/models.enums";
import { ScheduleSchema } from "./schedule.schema";

export const ScheduleProviders = [
    {
        provide: MODAL_ENUMS.SCHEDULES,
        useFactory: (connection: Connection) => connection.model(COLLECTION_NAMES.SCHEDULES, ScheduleSchema),
        inject: [MODAL_ENUMS.DATABASE_CONNECTION]
    }
]