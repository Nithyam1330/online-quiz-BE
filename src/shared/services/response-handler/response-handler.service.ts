/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { Error } from 'mongoose';
import { HTTP_ERROR_TYPES, MONGO_ERROR_TYPES } from 'src/shared/enums/mongodb.errors';

export interface ISuccessErrorObjectInterface {
    statusCode: HttpStatus,
    message: string,
    data: any,
    errorType: string
}
@Injectable()
export class ResponseHandlerService {
    public successReponseHandler(message, data): ISuccessErrorObjectInterface {
        return {
            statusCode: HttpStatus.OK,
            message: message,
            data: data,
            errorType: null
        }
    }

    changeHttpErrorToMongooesError(status: HttpStatus) {
        switch (status) {
            case HttpStatus.NOT_FOUND: {
                return MONGO_ERROR_TYPES.DocumentNotFoundError
            }
            case HttpStatus.BAD_REQUEST: {
                return MONGO_ERROR_TYPES.MongoError
            }
            case HttpStatus.NOT_MODIFIED: {
                return MONGO_ERROR_TYPES.OverwriteModelError
            }
            case HttpStatus.NOT_ACCEPTABLE: {
                return MONGO_ERROR_TYPES.StrictModeError
            }
            case HttpStatus.UNAUTHORIZED: {
                return 'UNAUTHORIZED'
            }
            default: {
                return ''
            }

        }
    }

    public errorReponseHandler(error: Error): ISuccessErrorObjectInterface {
        if (error['status']) {
            error.name = this.changeHttpErrorToMongooesError(error['status']);
            if (error['response']) {
                error.message = error['response']
            }
        }
        switch (error.name) {
            case MONGO_ERROR_TYPES.CastError: {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                    data: null,
                    errorType: error.name
                }
            }
            case MONGO_ERROR_TYPES.ValidationError: {
                const arr = error.message.split(':');
                arr.splice(0, 1);
                const finalMessage = (arr.join(":")).trim();
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: finalMessage,
                    data: null,
                    errorType: error.name
                }
            }
            case MONGO_ERROR_TYPES.MongoError: {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                    data: null,
                    errorType: error.name
                }
            }
            case MONGO_ERROR_TYPES.DocumentNotFoundError: {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message ? error.message : 'No records found',
                    data: null,
                    errorType: error.name
                }
            }
            case MONGO_ERROR_TYPES.OverwriteModelError: {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message ? error.message : 'No Records Modified',
                    data: null,
                    errorType: error.name
                }
            }
            case MONGO_ERROR_TYPES.StrictModeError: {
                return {
                    statusCode: HttpStatus.NOT_ACCEPTABLE,
                    message: error.message ? error.message : 'Not acceptable request',
                    data: null,
                    errorType: error.name
                }
            }
            case HTTP_ERROR_TYPES.UNAUTHORIZED: {
                return {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: error.message ? error.message : 'Unauthorized Users',
                    data: null,
                    errorType: error.name
                }
            }
            
            default: {
                return {
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'Unknown error not able to find the issse... Try again',
                    data: null,
                    errorType: error.name
                }
            }
        }
    }
}
