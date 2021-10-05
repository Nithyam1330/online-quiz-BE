/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseHandlerService } from './shared/services/response-handler/response-handler.service';
import { ZoomSignatureService, IZOOM_DETAILS } from './shared/services/zoom-signature/zoom-signature.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly zoomSignatureService: ZoomSignatureService,
    private readonly responseHandler: ResponseHandlerService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('getSignature')
  async getZoomSignature(@Body() zoomDetails: IZOOM_DETAILS) {

    const zoomSignature = this.zoomSignatureService.getZoomSignature(process.env.ZOOM_JWT_API_KEY, process.env.ZOOM_JWT_API_SECRET, zoomDetails.meetingNumber, zoomDetails.role);
    return this.responseHandler.successReponseHandler('Zoom signature generated successfully', zoomSignature);;
  }
}
