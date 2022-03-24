import { RespondFunction, Server, TransformedRequest } from 'slash-create';

export type ServerRequestHandler = (treq: TransformedRequest, respond: RespondFunction, wait: (f: any) => void) => void;

/**
 * A server for Cloudflare Workers.
 * @see https://developers.cloudflare.com/workers/
 */
export class CFWorkerServer extends Server {
  constructor() {
    super({ alreadyListening: true });
    this.isWebserver = true;
  }

  /** @private */
  createEndpoint(path: string, handler: ServerRequestHandler) {
    addEventListener('fetch', (event) => {
      if (event.request.method !== 'POST')
        return event.respondWith(new Response('Server only supports POST requests.', { status: 405 }));
      return event.respondWith(
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
          const body = await event.request.text();
          handler(
            {
              headers: Object.fromEntries(event.request.headers.entries()),
              body: body ? JSON.parse(body) : body,
              request: event.request,
              response: null
            },
            async (response) => {
              resolve(
                new Response(JSON.stringify(response.body), {
                  status: response.status || 200,
                  headers: {
                    ...((response.headers || {}) as Record<string, string>),
                    'content-type': 'application/json'
                  }
                })
              );
            },
            event.waitUntil.bind(event)
          );
        })
      );
    });
  }
}
