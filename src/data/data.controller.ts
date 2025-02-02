import { RolesGuard } from '../utils/roles.guard';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { Roles } from 'src/utils/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '../config/config.service';

export function createDataController(configService: ConfigService) {
  const app_name = configService.get('app_name') + '/data';

  @ApiTags(app_name)
  @Controller(app_name)
  class DataController {
    constructor(public dataService: DataService) {}

    // @UseGuards(JwtAuthGuard)
    @Get('fetch-data')
    @ApiOperation({ summary: 'fetch data' })
    @ApiResponse({ status: 201, description: 'User fetch data successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async fetchData() {
      return this.dataService.fetchData();
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Get('aggregate-data')
    @ApiOperation({ summary: 'aggregate data' })
    @ApiResponse({
      status: 201,
      description: 'User aggregate data successfully.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async aggregateData() {
      return this.dataService.aggregateData();
    }
  }

  return DataController;
}
