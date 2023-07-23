import { CookieJar } from 'tough-cookie';

export class Fetcher {
  private jar = new CookieJar();

  constructor(private readonly baseUrl: string) {}

  get cookie() {
    return this.jar.getCookieStringSync(this.baseUrl);
  }

  async get<Result>(path: string): Promise<Result> {
    return this.request(path);
  }

  post = this.mutate('POST');
  put = this.mutate('PUT');
  delete = this.mutate('DELETE');

  private async request<Result>(path: string, init: RequestInit = {}): Promise<Result> {
    const headers = new Headers(init?.headers);
    init.headers = headers;

    const cookieString = await this.jar.getCookieString(this.baseUrl);
    if (cookieString) headers.set('cookie', cookieString);

    const response = await fetch(this.baseUrl + path, init);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.clone().text()}`);
    }

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) await this.jar.setCookie(setCookie, this.baseUrl);

    const contentType = response.headers.get('Content-Type');

    if (contentType?.startsWith('application/json')) {
      return response.json() as Result;
    } else {
      return response.text() as Result;
    }
  }

  private mutate(method: string) {
    return async <Body, Result = void>(path: string, body?: Body): Promise<Result> => {
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
