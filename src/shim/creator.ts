import { Creator, RespondFunction, Server, SlashCreatorOptions, TransformedRequest } from 'slash-create';
import { RequestHandler } from './util/requestHandler';
import { verify } from './util/verify';

export class SlashCreator extends Creator {
  /** The request handler for the creator */
  // @ts-expect-error
  readonly requestHandler: RequestHandler;

  /** @param opts The options for the creator */
  constructor(opts: SlashCreatorOptions) {
    // eslint-disable-next-line constructor-super
    super(opts);
    // @ts-expect-error
    this.requestHandler = new RequestHandler(this);
  }

  /**
   * Attaches a server to the creator.
   * @param server The server to use
   */
  withServer(server: Server) {
    if (this.server) throw new Error('A server was already set in this creator.');
    this.server = server;

    if (this.server.isWebserver) {
      if (!this.options.publicKey) throw new Error('A public key is required to be set when using a webserver.');
      // @ts-ignore
      this.server.createEndpoint(this.options.endpointPath as string, this._onRequest.bind(this));
      // @ts-ignore
    } else this.server.handleInteraction((interaction) => this._onInteraction(interaction, null, false));

    return this;
  }

  // Overwriting the verification method to use Web Crypto API and use waitUntil for the promise
  private async _onRequest(treq: TransformedRequest, respond: RespondFunction, wait: (f: any) => void) {
    this.emit('debug', 'Got request');

    // Verify request
    const signature = treq.headers['x-signature-ed25519'] as string;
    const timestamp = treq.headers['x-signature-timestamp'] as string;

    // Check if both signature and timestamp exists, and the timestamp isn't past due.
    if (
      !signature ||
      !timestamp ||
      parseInt(timestamp) < (Date.now() - (this.options.maxSignatureTimestamp as number)) / 1000
    )
      return respond({
        status: 401,
        body: 'Invalid signature'
      });

    if (!(await verify(treq))) {
      this.emit('debug', 'A request failed to be verified');
      this.emit('unverifiedRequest', treq);
      return respond({
        status: 401,
        body: 'Invalid signature'
      });
    }

    // @ts-expect-error
    wait(this._onInteraction(treq.body, respond, true).catch(() => {}));
  }
}
