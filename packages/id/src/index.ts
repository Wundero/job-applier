// NOTE:
/**
 * Performant UUID v7 generator.
 *
 * Multiplication and division is used instead of bitshifting due to implicit 32-bit integer conversions.
 * Bigints are slower here, despite the ability to use bitshifting.
 */

let prevTimestamp = -1;
let seq = 0;

const SEQUENCE_MASK = 0x3ff_ffff_ffff;
const VERSION = 0x70;
const VAR = 0x80000000;
const TS_UPPER_SHIFT = 0x10000; // 2 ^ 16
const SEQ_UPPER_CREATION_SHIFT = 0x10000; // 2 ^ 16
const SEQ_UPPER_SHIFT = 0x4000000000; // 2 ^ 38
const SEQ_MIDDLE_SHIFT = 0x40000000; // 2 ^ 30

function resetSequence() {
  const randomArray = Buffer.alloc(6);
  crypto.getRandomValues(randomArray);
  const upper = randomArray.readUInt32BE(0);
  const lower = randomArray.readUInt16BE(4);
  return (seq = (upper * SEQ_UPPER_CREATION_SHIFT + lower) & SEQUENCE_MASK);
}

resetSequence();

export function v7b() {
  const ts = Math.max(Date.now(), prevTimestamp);
  seq = ts === prevTimestamp ? seq + 1 : resetSequence();
  prevTimestamp = ts;
  const buf = Buffer.alloc(16);
  const tsUpper = (ts / TS_UPPER_SHIFT) & 0xffff_ffff;
  const tsLower = ts & 0xffff;
  buf.writeUInt32BE(tsUpper, 0);
  buf.writeUInt16BE(tsLower, 4);
  const seqUpper = VERSION | ((seq / SEQ_UPPER_SHIFT) & 0xf);
  buf.writeUInt8(seqUpper, 6);
  const seqMiddle = (seq / SEQ_MIDDLE_SHIFT) & 0xff;
  buf.writeUInt8(seqMiddle, 7);
  // >>> 0 forces unsigned behavior
  const seqLower = (VAR | (seq & 0x3fff_ffff)) >>> 0;
  buf.writeUInt32BE(seqLower, 8);
  crypto.getRandomValues(buf.subarray(12));
  return buf;
}

export function v7() {
  const bytes = v7b().toString("hex");
  return `${bytes.slice(0, 8)}-${bytes.slice(8, 12)}-${bytes.slice(12, 16)}-${bytes.slice(16, 20)}-${bytes.slice(20)}`;
}
