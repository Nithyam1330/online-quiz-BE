import { Module } from '@nestjs/common';
import { ResponseHandlerService } from './services/response-handler/response-handler.service';

@Module({
    imports: [],
    providers: [ResponseHandlerService],
    exports: [ResponseHandlerService]
})
export class SharedModule {}
