import { CookieJar } from 'tough-cookie';

import { Fetcher } from './fetcher';

export class ServerFetcher extends Fetcher {
  private jar = new CookieJar();

  constructor(baseUrl: string, fetch = globalThis.fetch) {
    super(baseUrl, async (url, init = {}) => {
      return this.storeCookie(await fetch(url, await this.setCookie(init)));
    });
  }

  get cookie() {
    return this.jar.getCookieStringSync(this.baseUrl);
  }

  set cookie(value: string) {
    this.jar.setCookieSync(value, this.baseUrl);
  }

  private async setCookie(init: RequestInit) {
    const headers = new Headers(init?.headers);

    init.headers = headers;

    const cookieString = await this.jar.getCookieString(this.baseUrl);

    if (cookieString) {
      headers.set('cookie', cookieString);
    }

    return init;
  }

  private async storeCookie(response: Response) {
    const setCookie = response.headers.get('set-cookie');

    if (setCookie) {
      await this.jar.setCookie(setCookie, this.baseUrl);
    }

    return response;
  }
}
