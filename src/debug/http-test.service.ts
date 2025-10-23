import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpTestService {
  private readonly logger = new Logger(HttpTestService.name);
  constructor(private readonly http: HttpService) {}

  async sendTest() {
    const payload = {
      name: 'test',
      startDateTime: new Date().toISOString(), // ISO UTC
      nested: { innerDateTime: new Date().toISOString() },
      items: [{ startDateTime: new Date().toISOString() }]
    };

    this.logger.log('HttpTestService: sending payload (before): ' + JSON.stringify(payload));

    const { data } = await firstValueFrom(
      this.http.post('https://httpbin.org/post', payload, { headers: { 'Content-Type': 'application/json' } })
    );

    this.logger.log('HttpTestService: response received');
    this.logger.debug('httpbin data.json: ' + JSON.stringify(data.json));
    return data.json;
  }
}
