export const MONGO_DB_CONNECTION_URL = "mongodb+srv://saikumar1330:8125431943@online-meat-nest.wmtkm.mongodb.net/meat-nest?retryWrites=true&w=majority";
export enum USER_ROLES{
    ADMIN= 'ADMIN',
    SUPER_ADMIN= 'SUPER_ADMIN',
    USER= 'USER'
}
export type IUserRoles = typeof USER_ROLES[keyof typeof USER_ROLES];