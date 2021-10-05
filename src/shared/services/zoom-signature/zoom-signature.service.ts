/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { createHmac} from 'crypto';

export interface IZOOM_DETAILS {
    meetingNumber: number;
    role: number
}
@Injectable()
export class ZoomSignatureService {
    getZoomSignature(apiKey, apiSecret, meetingNumber, role) {
        const timestamp = new Date().getTime() - 30000
        const msg = Buffer.from(`${apiKey}${meetingNumber}${timestamp}${role}`).toString('base64')
        const hash = createHmac('sha256', apiSecret).update(msg).digest('base64')
        const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
        return signature;
    }
}
