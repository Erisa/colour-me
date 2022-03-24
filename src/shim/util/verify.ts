// from https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1

import { TransformedRequest } from 'slash-create';

function hex2bin(hex: string) {
  const buf = new Uint8Array(Math.ceil(hex.length / 2));
  for (var i = 0; i < buf.length; i++) {
    buf[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return buf;
}

const PUBLIC_KEY = crypto.subtle.importKey(
  'raw',
  hex2bin(DISCORD_PUBLIC_KEY),
  {
    name: 'NODE-ED25519',
    namedCurve: 'NODE-ED25519'
  },
  true,
  ['verify']
);

const encoder = new TextEncoder();

export async function verify(treq: TransformedRequest) {
  const signature = hex2bin(treq.headers['x-signature-ed25519'] as string);
  const timestamp = treq.headers['x-signature-timestamp'] as string;
  const unknown = JSON.stringify(treq.body);

  return await crypto.subtle.verify('NODE-ED25519', await PUBLIC_KEY, signature, encoder.encode(timestamp + unknown));
}
