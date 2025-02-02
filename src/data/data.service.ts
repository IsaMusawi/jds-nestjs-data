import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import axios from 'axios';

@Injectable()
export class DataService {
  private currencyRate: number;

  constructor(private configService: ConfigService) {}

  async fetchData(): Promise<any[]> {
    if (!this.currencyRate) {
      await this.fetchCurrencyRate();
    }
    const url_data = this.configService.get('api_url').data.trim();
    const response = await axios.get(url_data);
    const products = response.data;

    for (const product of products) {
      const priceUSD = parseFloat(product.price);
      const priceIDR = priceUSD * this.currencyRate;
      product['priceIDR'] = priceIDR.toFixed(2);
    }

    return products;
  }

  async fetchCurrencyRate(): Promise<void> {
    const url_currency_conversion =
      this.configService.get('api_url').currency_conversion;

    //COMMENTED BECAUSE WAITING FOR API KEYS
    // const response = await axios.get(url_currency_conversion);
    // this.currencyRate = response.data['USD_IDR'].val;
    this.currencyRate = 16650.0;
  }

  async aggregateData(): Promise<any> {
    const products = await this.fetchData();

    const aggregateData = products.reduce((acc, product) => {
      const department = product.department;
      if (!acc[department]) {
        acc[department] = [];
      }

      acc[department].push(product);
      return acc;
    }, {});

    for (const department in aggregateData) {
      aggregateData[department].sort(
        (a, b) => parseFloat(a['priceIDR']) - parseFloat(b['priceIDR']),
      );
    }

    return aggregateData;
  }
}
