import { Controller, Get } from '@nestjs/common';
import { HttpTestService } from './http-test.service';

@Controller('debug')
export class HttpTestController {
  constructor(private readonly testService: HttpTestService) {}

  @Get('http-test')
  async run() {
    return this.testService.sendTest();
  }
}
