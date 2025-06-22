import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get the Modelyo API connection' })
  @ApiResponse({ status: 200, description: 'Modelyo API connected' })
  getModelyoApi(): string {
    return this.appService.getModelyoApi();
  }
}
