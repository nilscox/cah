import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { AxiosInstance } from '../client';

type RequestOptions = Partial<{
  expectedStatus: number | number[];
}>;

type HTTPResponse<T> = {
  body: T;
  status: number;
};

export class HTTPAdapter {
  constructor(private readonly axios: AxiosInstance) {}

  async get<T>(url: string, options?: RequestOptions): Promise<HTTPResponse<T>> {
    const response = await this.axios.get<T>(url, this.transformOptions(options));

    return this.transformResponse(response);
  }

  async post<T, Body = unknown>(url: string, body?: Body, options?: RequestOptions): Promise<HTTPResponse<T>> {
    const response = await this.axios.post<T>(url, body, this.transformOptions(options));

    return this.transformResponse(response);
  }

  private transformOptions(options: RequestOptions = {}): AxiosRequestConfig {
    const config: AxiosRequestConfig = {};

    const { expectedStatus } = options;

    if (expectedStatus) {
      config.validateStatus = (status) => {
        if (typeof expectedStatus === 'number') {
          return status === expectedStatus;
        }

        return expectedStatus.includes(status);
      };
    }

    return config;
  }

  private transformResponse<T>(response: AxiosResponse<T>): HTTPResponse<T> {
    return {
      status: response.status,
      body: response.data,
    };
  }
}
