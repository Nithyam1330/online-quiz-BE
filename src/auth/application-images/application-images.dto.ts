/* eslint-disable prettier/prettier */
import { IsDefined } from 'class-validator';

export class ApplicationImagesDTO {
    _id?: string;

    @IsDefined()
    applicationId: string;

    @IsDefined()
    imageDataUrl: string;
}
