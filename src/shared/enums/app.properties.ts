import { EncryptDecryptService } from "../services/encrypt-decrypt/encrypt-decrypt.service";

export const MONGO_DB_CONNECTION_URL = "mongodb+srv://saikumar1330:8125431943@online-meat-nest.wmtkm.mongodb.net/meat-nest?retryWrites=true&w=majority";
export enum USER_ROLES{
    ADMIN= 'ADMIN',
    SUPER_ADMIN= 'SUPER_ADMIN',
    USER= 'USER'
}
export type IUserRoles = typeof USER_ROLES[keyof typeof USER_ROLES];

export const SMTP_CONFIG = "smtps://svsudowindo@gmail.com:8125431943@smtp.gmail.com";

export const SECRET_KEY_JSON_WEB_TOKEN = 'cannotfind';