import * as YAML from 'yamljs';
import { Injectable } from '@nestjs/common';
import { env } from 'node:process';

@Injectable()
export class ConfigService {
  private readonly config;

  constructor() {
    const config = YAML.load(`./config/config.yaml`);
    const environment = config.common.env;
    this.config = { ...config.common, ...config[environment] };
    console.log('this.config = ', this.config);
  }

  get(key: string): any {
    return this.config[key];
  }
}
