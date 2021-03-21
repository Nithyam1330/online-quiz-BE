import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class EncryptDecryptService {
    constructor() {

    }

    generateRandomPassword() {
        return Math.random().toString(36).substring(5)
    }

    async generateHashing(password): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }

    async comparePasswords(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }
}
