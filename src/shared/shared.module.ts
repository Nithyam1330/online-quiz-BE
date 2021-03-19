import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ResponseHandlerService } from './services/response-handler/response-handler.service';

@Module({
    imports: [DatabaseModule],
    providers: [ResponseHandlerService],
    exports: [ResponseHandlerService, DatabaseModule]
})
export class SharedModule {}
