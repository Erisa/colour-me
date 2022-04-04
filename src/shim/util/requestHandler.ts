import { RequestHandler } from 'slash-create';
import { MultipartData } from './multipartData';

/**
 * The request handler for REST requests.
 * @private
 */
export class FetchRequestHandler extends RequestHandler {
  /**
   * Make an API request
   * @param method Uppercase HTTP method
   * @param url URL of the endpoint
   * @param auth Whether to add the Authorization header and token or not
   * @param body Request payload
   * @param file The file(s) to send
   */
  async request(method: string, url: string, auth = true, body?: any, file?: any): Promise<any> {
    // @ts-ignore
    const creator = this._creator;
    const headers: Record<string, string> = {
      'User-Agent': this.userAgent,
      'Accept-Encoding': 'gzip,deflate',
      'X-RateLimit-Precision': 'millisecond'
    };
    let data: any = body;

    if (auth) {
      if (!creator.options.token) throw new Error('No token was set in the SlashCreator.');
      headers.Authorization = creator.options.token;
    }

    if (file) {
      if (Array.isArray(file) || file.file) {
        data = new MultipartData();
        headers['Content-Type'] = 'multipart/form-data; boundary=' + data.boundary;
        if (Array.isArray(file)) for (const f of file) await (data as MultipartData).attach(f.name, f.file, f.name);
        else await (data as MultipartData).attach(file.name, file.file, file.name);
        if (body) await (data as MultipartData).attach('payload_json', JSON.stringify(body));
        data = data.finish();
      } else throw new Error('Invalid file object');
    } else if (body) {
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
