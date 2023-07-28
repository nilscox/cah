export class Fetcher {
  constructor(
    public readonly baseUrl: string,
    protected fetch = globalThis.fetch,
  ) {}

  async get<Result>(path: string): Promise<Result> {
    return this.request(path);
  }

  post = this.mutate('POST');
  put = this.mutate('PUT');
  delete = this.mutate('DELETE');

  private async request<Result>(path: string, init: RequestInit = {}): Promise<Result> {
    const response = await this.fetch(this.baseUrl + path, init);

    if (!response.ok) {
      throw new FetchError(response.status, await response.clone().text());
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType?.startsWith('application/json')) {
      return response.json() as Result;
    } else {
      return response.text() as Result;
    }
  }

  private mutate(method: string) {
    return async <Body = never, Result = void>(path: string, body?: Body): Promise<Result> => {
      const headers = new Headers();
      const init: RequestInit = {
        method,
        headers,
      };

      if (body !== undefined) {
        init.body = JSON.stringify(body);
        headers.set('Content-Type', 'application/json');
      }

      return this.request<Result>(path, init);
    };
  }
}

export class FetchError extends Error {
  constructor(
    public readonly status: number,
    public readonly text: string,
  ) {
    super(`Error ${status}: ${text}`);
  }
}
