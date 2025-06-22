import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getModelyoApi(): string {
    return 'Modelyo API connected successfully';
  }
}
