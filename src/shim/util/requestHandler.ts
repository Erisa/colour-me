import { API_BASE_URL, SlashCreator } from 'slash-create';

/**
 * The request handler for REST requests.
 * @private
 */
export class RequestHandler {
  /** The base URL for all requests. */
  readonly baseURL: string = API_BASE_URL;
  /** The amount of time a request will timeout. */
  readonly requestTimeout: number;

  /** The creator that initialized the handler. */
  private _creator: SlashCreator;

  /** @param creator The instantiating creator. */
  constructor(creator: SlashCreator) {
    this._creator = creator;
    this.requestTimeout = creator.options.requestTimeout as number;
  }

  /**
   * Make an API request
   * @param method Uppercase HTTP method
   * @param url URL of the endpoint
   * @param auth Whether to add the Authorization header and token or not
   * @param body Request payload
   * @param file The file(s) to send
   */
  async request(method: string, url: string, auth = true, body?: any, file?: any): Promise<any> { // eslint-disable-line @typescript-eslint/no-unused-vars, prettier/prettier
    const headers: Record<string, string> = {};
    let data: any = body;

    if (auth) {
      if (!this._creator.options.token) throw new Error('No token was set in the SlashCreator.');
      headers.Authorization = this._creator.options.token;
    }

    if (body) {
      if (method !== 'GET' && method !== 'DELETE') {
        data = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }
    }

    const res = await fetch('https://discord.com' + this.baseURL + url, { method, body: data, headers });

    if (!res.ok) {
      const data = await res.text();
      throw new Error(`${method} got ${res.status} - ${data}`);
    }

    return await res.json();
  }

  toString() {
    return '[RequestHandler]';
  }
}
