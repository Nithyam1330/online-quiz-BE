import * as mongoose from 'mongoose';
import { MONGO_DB_CONNECTION_URL } from 'src/shared/enums/app.properties';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';

export const DatabaseProviders = [
  {
    provide: MODAL_ENUMS.DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(MONGO_DB_CONNECTION_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      })
  },
];