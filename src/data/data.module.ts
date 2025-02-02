import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { createDataController } from './data.controller';
import { DataService } from './data.service';
import {
  AdminRoleMiddleware,
  UtilsMiddleware,
} from '../utils/utils.middleware';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [ConfigModule],
  controllers: [createDataController(new ConfigService())],
  providers: [DataService],
})
// export class DataModule {}
export class DataModule implements NestModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UtilsMiddleware)
      .forRoutes(createDataController(this.configService));
    consumer
      .apply(AdminRoleMiddleware)
      .forRoutes(this.configService.get('app_name') + '/data/aggregate-data');
  }
}
