export enum LOGIN_PROVIDERS {
    EMAIL= 'EMAIL',
    FACEBOOK = 'FACEBOOK',
    GOOGLE ='GOOGLE'
}
export type LoginProvidersType = typeof LOGIN_PROVIDERS[keyof typeof LOGIN_PROVIDERS];