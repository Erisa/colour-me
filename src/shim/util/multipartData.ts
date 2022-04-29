export class MultipartData {
  boundary = '----------------SlashCreate';
  bufs: Uint8Array[] = [];

  async attach(fieldName: string, data: any, filename?: string) {
    if (data === undefined) return;
    let str = '\r\n--' + this.boundary + '\r\nContent-Disposition: form-data; name="' + fieldName + '"';
    if (filename) str += '; filename="' + filename + '"';
    if (data instanceof Blob || data instanceof File) {
      str += `\r\nContent-Type: ${data.type}`;
      data = new Uint8Array(await data.arrayBuffer());
    } else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
      str += '\r\nContent-Type: application/octet-stream';
      data = new Uint8Array(data);
    } else if (typeof data === 'object') {
      str += '\r\nContent-Type: application/json';
      data = encode(JSON.stringify(data));
    } else {
      data = encode('' + data);
    }

    this.bufs.push(encode(str + '\r\n\r\n'));
    this.bufs.push(data);
  }

  finish() {
    this.bufs.push(encode('\r\n--' + this.boundary + '--'));

    let index = 0;
    const result = new Uint8Array(this.bufs.reduce((a, b) => a + b.byteLength, 0));
    for (const buf of this.bufs) {
      result.set(new Uint8Array(buf), index);
      index += buf.byteLength;
    }

    return result;
  }
}

function encode(text: string) {
  return new TextEncoder().encode(text);
}
