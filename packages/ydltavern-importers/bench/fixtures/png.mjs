import { Buffer } from 'node:buffer';

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function characterPayload() {
  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data: {
      name: 'Bench Character',
      description: 'Synthetic deterministic character card for importer benchmarks.',
      personality: 'Stable and repeatable.',
      scenario: 'A controlled benchmark scene.',
      first_mes: 'Hello from a synthetic PNG fixture.',
      mes_example: '<START>\nUser: Hi\nBench Character: Hello.',
      creator_notes: 'Generated inline by bench fixture.',
      tags: ['bench', 'synthetic'],
      extensions: { yggdrasil_bench: true },
    },
  };
}

function buildSyntheticPng(metadataJson, paddingBytes = 0) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(1, 0);
  ihdr.writeUInt32BE(1, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const text = Buffer.concat([
    Buffer.from('chara\0', 'latin1'),
    Buffer.from(Buffer.from(metadataJson, 'utf8').toString('base64'), 'latin1'),
  ]);

  const chunks = [chunk('IHDR', ihdr)];
  if (paddingBytes > 0) chunks.push(chunk('npAD', Buffer.alloc(paddingBytes, 0)));
  chunks.push(chunk('tEXt', text), chunk('IEND'));
  return Buffer.concat([PNG_SIG, ...chunks]);
}

export const smallPng = buildSyntheticPng(JSON.stringify(characterPayload()), 10 * 1024);
export const largePng = buildSyntheticPng(JSON.stringify(characterPayload()), 1024 * 1024);
