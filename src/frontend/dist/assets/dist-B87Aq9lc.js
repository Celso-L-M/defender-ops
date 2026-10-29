// \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+object-storage@0.1.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+pr_9a2618bf997df87570fd7ce304351207/node_modules/@caffeineai/object-storage/dist/blob.js
var ExternalBlob = class ExternalBlob {
	_blob;
	directURL;
	onProgress = void 0;
	constructor(directURL, blob) {
		if (blob) this._blob = blob;
		this.directURL = directURL;
	}
	static fromURL(url) {
		return new ExternalBlob(url, null);
	}
	static fromBytes(blob) {
		const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: "application/octet-stream" }));
		return new ExternalBlob(url, blob);
	}
	async getBytes() {
		if (this._blob) return this._blob;
		const blob = await (await fetch(this.directURL)).blob();
		this._blob = new Uint8Array(await blob.arrayBuffer());
		return this._blob;
	}
	getDirectURL() {
		return this.directURL;
	}
	withUploadProgress(onProgress) {
		this.onProgress = onProgress;
		return this;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/agent/api.js
/**
* Codes used by the replica for rejecting a message.
* See {@link https://sdk.dfinity.org/docs/interface-spec/#reject-codes | the interface spec}.
*/
var ReplicaRejectCode;
(function(ReplicaRejectCode) {
	ReplicaRejectCode[ReplicaRejectCode["SysFatal"] = 1] = "SysFatal";
	ReplicaRejectCode[ReplicaRejectCode["SysTransient"] = 2] = "SysTransient";
	ReplicaRejectCode[ReplicaRejectCode["DestinationInvalid"] = 3] = "DestinationInvalid";
	ReplicaRejectCode[ReplicaRejectCode["CanisterReject"] = 4] = "CanisterReject";
	ReplicaRejectCode[ReplicaRejectCode["CanisterError"] = 5] = "CanisterError";
})(ReplicaRejectCode || (ReplicaRejectCode = {}));
var QueryResponseStatus;
(function(QueryResponseStatus) {
	QueryResponseStatus["Replied"] = "replied";
	QueryResponseStatus["Rejected"] = "rejected";
})(QueryResponseStatus || (QueryResponseStatus = {}));
/**
* Utility function to check if a body is a v2ResponseBody for type safety.
* @param body The body to check
* @returns boolean indicating if the body is a v2ResponseBody
*/
function isV2ResponseBody(body) {
	return body !== null && body !== void 0 && "reject_code" in body;
}
/**
* Utility function to check if a body is a v3ResponseBody for type safety.
* @param body The body to check
* @returns boolean indicating if the body is a v3ResponseBody
*/
function isV3ResponseBody(body) {
	return body !== null && body !== void 0 && "certificate" in body;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+principal@3.3.1/node_modules/@dfinity/principal/lib/esm/utils/base32.js
var alphabet = "abcdefghijklmnopqrstuvwxyz234567";
var lookupTable = Object.create(null);
for (let i = 0; i < 32; i++) lookupTable[alphabet[i]] = i;
lookupTable["0"] = lookupTable.o;
lookupTable["1"] = lookupTable.i;
/**
* @param input The Uint8Array to encode.
* @returns A Base32 string encoding the input.
*/
function base32Encode(input) {
	let skip = 0;
	let bits = 0;
	let output = "";
	function encodeByte(byte) {
		if (skip < 0) bits |= byte >> -skip;
		else bits = byte << skip & 248;
		if (skip > 3) {
			skip -= 8;
			return 1;
		}
		if (skip < 4) {
			output += alphabet[bits >> 3];
			skip += 5;
		}
		return 0;
	}
	for (let i = 0; i < input.length;) i += encodeByte(input[i]);
	return output + (skip < 0 ? alphabet[bits >> 3] : "");
}
/**
* @param input The base32 encoded string to decode.
*/
function base32Decode(input) {
	let skip = 0;
	let byte = 0;
	const output = new Uint8Array(input.length * 4 / 3 | 0);
	let o = 0;
	function decodeChar(char) {
		let val = lookupTable[char.toLowerCase()];
		if (val === void 0) throw new Error(`Invalid character: ${JSON.stringify(char)}`);
		val <<= 3;
		byte |= val >>> skip;
		skip += 5;
		if (skip >= 8) {
			output[o++] = byte;
			skip -= 8;
			if (skip > 0) byte = val << 5 - skip & 255;
			else byte = 0;
		}
	}
	for (const c of input) decodeChar(c);
	return output.slice(0, o);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+principal@3.3.1/node_modules/@dfinity/principal/lib/esm/utils/getCrc.js
var lookUpTable = new Uint32Array([
	0,
	1996959894,
	3993919788,
	2567524794,
	124634137,
	1886057615,
	3915621685,
	2657392035,
	249268274,
	2044508324,
	3772115230,
	2547177864,
	162941995,
	2125561021,
	3887607047,
	2428444049,
	498536548,
	1789927666,
	4089016648,
	2227061214,
	450548861,
	1843258603,
	4107580753,
	2211677639,
	325883990,
	1684777152,
	4251122042,
	2321926636,
	335633487,
	1661365465,
	4195302755,
	2366115317,
	997073096,
	1281953886,
	3579855332,
	2724688242,
	1006888145,
	1258607687,
	3524101629,
	2768942443,
	901097722,
	1119000684,
	3686517206,
	2898065728,
	853044451,
	1172266101,
	3705015759,
	2882616665,
	651767980,
	1373503546,
	3369554304,
	3218104598,
	565507253,
	1454621731,
	3485111705,
	3099436303,
	671266974,
	1594198024,
	3322730930,
	2970347812,
	795835527,
	1483230225,
	3244367275,
	3060149565,
	1994146192,
	31158534,
	2563907772,
	4023717930,
	1907459465,
	112637215,
	2680153253,
	3904427059,
	2013776290,
	251722036,
	2517215374,
	3775830040,
	2137656763,
	141376813,
	2439277719,
	3865271297,
	1802195444,
	476864866,
	2238001368,
	4066508878,
	1812370925,
	453092731,
	2181625025,
	4111451223,
	1706088902,
	314042704,
	2344532202,
	4240017532,
	1658658271,
	366619977,
	2362670323,
	4224994405,
	1303535960,
	984961486,
	2747007092,
	3569037538,
	1256170817,
	1037604311,
	2765210733,
	3554079995,
	1131014506,
	879679996,
	2909243462,
	3663771856,
	1141124467,
	855842277,
	2852801631,
	3708648649,
	1342533948,
	654459306,
	3188396048,
	3373015174,
	1466479909,
	544179635,
	3110523913,
	3462522015,
	1591671054,
	702138776,
	2966460450,
	3352799412,
	1504918807,
	783551873,
	3082640443,
	3233442989,
	3988292384,
	2596254646,
	62317068,
	1957810842,
	3939845945,
	2647816111,
	81470997,
	1943803523,
	3814918930,
	2489596804,
	225274430,
	2053790376,
	3826175755,
	2466906013,
	167816743,
	2097651377,
	4027552580,
	2265490386,
	503444072,
	1762050814,
	4150417245,
	2154129355,
	426522225,
	1852507879,
	4275313526,
	2312317920,
	282753626,
	1742555852,
	4189708143,
	2394877945,
	397917763,
	1622183637,
	3604390888,
	2714866558,
	953729732,
	1340076626,
	3518719985,
	2797360999,
	1068828381,
	1219638859,
	3624741850,
	2936675148,
	906185462,
	1090812512,
	3747672003,
	2825379669,
	829329135,
	1181335161,
	3412177804,
	3160834842,
	628085408,
	1382605366,
	3423369109,
	3138078467,
	570562233,
	1426400815,
	3317316542,
	2998733608,
	733239954,
	1555261956,
	3268935591,
	3050360625,
	752459403,
	1541320221,
	2607071920,
	3965973030,
	1969922972,
	40735498,
	2617837225,
	3943577151,
	1913087877,
	83908371,
	2512341634,
	3803740692,
	2075208622,
	213261112,
	2463272603,
	3855990285,
	2094854071,
	198958881,
	2262029012,
	4057260610,
	1759359992,
	534414190,
	2176718541,
	4139329115,
	1873836001,
	414664567,
	2282248934,
	4279200368,
	1711684554,
	285281116,
	2405801727,
	4167216745,
	1634467795,
	376229701,
	2685067896,
	3608007406,
	1308918612,
	956543938,
	2808555105,
	3495958263,
	1231636301,
	1047427035,
	2932959818,
	3654703836,
	1088359270,
	936918e3,
	2847714899,
	3736837829,
	1202900863,
	817233897,
	3183342108,
	3401237130,
	1404277552,
	615818150,
	3134207493,
	3453421203,
	1423857449,
	601450431,
	3009837614,
	3294710456,
	1567103746,
	711928724,
	3020668471,
	3272380065,
	1510334235,
	755167117
]);
/**
* Calculate the CRC32 of a Uint8Array.
* @param buf The Uint8Array to calculate the CRC32 of.
*/
function getCrc32(buf) {
	let crc = -1;
	for (let i = 0; i < buf.length; i++) crc = lookUpTable[(buf[i] ^ crc) & 255] ^ crc >>> 8;
	return (crc ^ -1) >>> 0;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/crypto.js
var crypto$1 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is positive integer. */
function anumber(n) {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
	if (!isBytes(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex(bytes) {
	abytes(bytes);
	if (hasHexBuiltin) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
var asciis = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function asciiToBase16(ch) {
	if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
	if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
	if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
}
/**
* Convert hex string to byte array. Uses built-in function, when available.
* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
*/
function hexToBytes(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	if (hasHexBuiltin) return Uint8Array.fromHex(hex);
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
/**
* Converts string to bytes using UTF8 encoding.
* @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes(data) {
	if (typeof data === "string") data = utf8ToBytes(data);
	abytes(data);
	return data;
}
/** Copies several Uint8Arrays into one. */
function concatBytes(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
/** For runtime check if class implements interface */
var Hash = class {};
/** Wraps hash function, creating an interface on top of it */
function createHasher$1(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
	if (crypto$1 && typeof crypto$1.getRandomValues === "function") return crypto$1.getRandomValues(new Uint8Array(bytesLength));
	if (crypto$1 && typeof crypto$1.randomBytes === "function") return Uint8Array.from(crypto$1.randomBytes(bytesLength));
	throw new Error("crypto.getRandomValues must be defined");
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64(view, byteOffset, value, isLE) {
	if (typeof view.setBigUint64 === "function") return view.setBigUint64(byteOffset, value, isLE);
	const _32n = BigInt(32);
	const _u32_max = BigInt(4294967295);
	const wh = Number(value >> _32n & _u32_max);
	const wl = Number(value & _u32_max);
	const h = isLE ? 4 : 0;
	const l = isLE ? 0 : 4;
	view.setUint32(byteOffset + h, wh, isLE);
	view.setUint32(byteOffset + l, wl, isLE);
}
/** Choice: a ? b : c */
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD = class extends Hash {
	constructor(blockLen, outputLen, padOffset, isLE) {
		super();
		this.finished = false;
		this.length = 0;
		this.pos = 0;
		this.destroyed = false;
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		data = toBytes(data);
		abytes(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
			}
		}
		this.length += data.length;
		this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to || (to = new this.constructor());
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
/** Initial SHA224 state. Bits 32..64 of frac part of sqrt of primes 23..53 */
var SHA224_IV = /* @__PURE__ */ Uint32Array.from([
	3238371032,
	914150663,
	812702999,
	4144912697,
	4290775857,
	1750603025,
	1694076839,
	3204075428
]);
/** Initial SHA512 state. Bits 0..64 of frac part of sqrt of primes 2..19 */
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	4089235720,
	3144134277,
	2227873595,
	1013904242,
	4271175723,
	2773480762,
	1595750129,
	1359893119,
	2917565137,
	2600822924,
	725511199,
	528734635,
	4215389547,
	1541459225,
	327033209
]);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_u64.js
/**
* Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
* @todo re-check https://issues.chromium.org/issues/42212588
* @module
*/
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64),
		l: Number(n >> _32n & U32_MASK64)
	};
	return {
		h: Number(n >> _32n & U32_MASK64) | 0,
		l: Number(n & U32_MASK64) | 0
	};
}
function split(lst, le = false) {
	const len = lst.length;
	let Ah = new Uint32Array(len);
	let Al = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		const { h, l } = fromBig(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
	const l = (Al >>> 0) + (Bl >>> 0);
	return {
		h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
		l: l | 0
	};
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out [RFC 4634](https://datatracker.ietf.org/doc/html/rfc4634) and
* [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
*/
/**
* Round constants:
* First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable temporary buffer. "W" comes straight from spec. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
	constructor(outputLen = 32) {
		super(64, outputLen, 8, false);
		this.A = SHA256_IV[0] | 0;
		this.B = SHA256_IV[1] | 0;
		this.C = SHA256_IV[2] | 0;
		this.D = SHA256_IV[3] | 0;
		this.E = SHA256_IV[4] | 0;
		this.F = SHA256_IV[5] | 0;
		this.G = SHA256_IV[6] | 0;
		this.H = SHA256_IV[7] | 0;
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
			SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean(SHA256_W);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
var SHA224 = class extends SHA256 {
	constructor() {
		super(28);
		this.A = SHA224_IV[0] | 0;
		this.B = SHA224_IV[1] | 0;
		this.C = SHA224_IV[2] | 0;
		this.D = SHA224_IV[3] | 0;
		this.E = SHA224_IV[4] | 0;
		this.F = SHA224_IV[5] | 0;
		this.G = SHA224_IV[6] | 0;
		this.H = SHA224_IV[7] | 0;
	}
};
var K512 = /* @__PURE__ */ (() => split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends HashMD {
	constructor(outputLen = 64) {
		super(128, outputLen, 16, false);
		this.Ah = SHA512_IV[0] | 0;
		this.Al = SHA512_IV[1] | 0;
		this.Bh = SHA512_IV[2] | 0;
		this.Bl = SHA512_IV[3] | 0;
		this.Ch = SHA512_IV[4] | 0;
		this.Cl = SHA512_IV[5] | 0;
		this.Dh = SHA512_IV[6] | 0;
		this.Dl = SHA512_IV[7] | 0;
		this.Eh = SHA512_IV[8] | 0;
		this.El = SHA512_IV[9] | 0;
		this.Fh = SHA512_IV[10] | 0;
		this.Fl = SHA512_IV[11] | 0;
		this.Gh = SHA512_IV[12] | 0;
		this.Gl = SHA512_IV[13] | 0;
		this.Hh = SHA512_IV[14] | 0;
		this.Hl = SHA512_IV[15] | 0;
	}
	get() {
		const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		return [
			Ah,
			Al,
			Bh,
			Bl,
			Ch,
			Cl,
			Dh,
			Dl,
			Eh,
			El,
			Fh,
			Fl,
			Gh,
			Gl,
			Hh,
			Hl
		];
	}
	set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
		this.Ah = Ah | 0;
		this.Al = Al | 0;
		this.Bh = Bh | 0;
		this.Bl = Bl | 0;
		this.Ch = Ch | 0;
		this.Cl = Cl | 0;
		this.Dh = Dh | 0;
		this.Dl = Dl | 0;
		this.Eh = Eh | 0;
		this.El = El | 0;
		this.Fh = Fh | 0;
		this.Fl = Fl | 0;
		this.Gh = Gh | 0;
		this.Gl = Gl | 0;
		this.Hh = Hh | 0;
		this.Hl = Hl | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) {
			SHA512_W_H[i] = view.getUint32(offset);
			SHA512_W_L[i] = view.getUint32(offset += 4);
		}
		for (let i = 16; i < 80; i++) {
			const W15h = SHA512_W_H[i - 15] | 0;
			const W15l = SHA512_W_L[i - 15] | 0;
			const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
			const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
			const W2h = SHA512_W_H[i - 2] | 0;
			const W2l = SHA512_W_L[i - 2] | 0;
			const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
			const SUMl = add4L(s0l, rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6), SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
			const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
			SHA512_W_H[i] = SUMh | 0;
			SHA512_W_L[i] = SUMl | 0;
		}
		let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		for (let i = 0; i < 80; i++) {
			const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
			const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
			const CHIh = Eh & Fh ^ ~Eh & Gh;
			const CHIl = El & Fl ^ ~El & Gl;
			const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
			const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
			const T1l = T1ll | 0;
			const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
			const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
			const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
			const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
			Hh = Gh | 0;
			Hl = Gl | 0;
			Gh = Fh | 0;
			Gl = Fl | 0;
			Fh = Eh | 0;
			Fl = El | 0;
			({h: Eh, l: El} = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
			Dh = Ch | 0;
			Dl = Cl | 0;
			Ch = Bh | 0;
			Cl = Bl | 0;
			Bh = Ah | 0;
			Bl = Al | 0;
			const All = add3L(T1l, sigma0l, MAJl);
			Ah = add3H(All, T1h, sigma0h, MAJh);
			Al = All | 0;
		}
		({h: Ah, l: Al} = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
		({h: Bh, l: Bl} = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
		({h: Ch, l: Cl} = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
		({h: Dh, l: Dl} = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
		({h: Eh, l: El} = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
		({h: Fh, l: Fl} = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
		({h: Gh, l: Gl} = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
		({h: Hh, l: Hl} = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
		this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
	}
	roundClean() {
		clean(SHA512_W_H, SHA512_W_L);
	}
	destroy() {
		clean(this.buffer);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
/**
* SHA2-256 hash function from RFC 4634.
*
* It is the fastest JS hash, even faster than Blake3.
* To break sha256 using birthday attack, attackers need to try 2^128 hashes.
* BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
*/
var sha256 = /* @__PURE__ */ createHasher$1(() => new SHA256());
/** SHA2-224 hash function from RFC 4634 */
var sha224 = /* @__PURE__ */ createHasher$1(() => new SHA224());
/** SHA2-512 hash function from RFC 4634. */
var sha512 = /* @__PURE__ */ createHasher$1(() => new SHA512());
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+principal@3.3.1/node_modules/@dfinity/principal/lib/esm/principal.js
var JSON_KEY_PRINCIPAL = "__principal__";
var SELF_AUTHENTICATING_SUFFIX = 2;
var ANONYMOUS_SUFFIX = 4;
var MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR = "aaaaa-aa";
var Principal$1 = class Principal$1 {
	static anonymous() {
		return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
	}
	/**
	* Utility method, returning the principal representing the management canister, decoded from the hex string `'aaaaa-aa'`
	* @returns {Principal} principal of the management canister
	*/
	static managementCanister() {
		return this.fromText(MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR);
	}
	static selfAuthenticating(publicKey) {
		const sha = sha224(publicKey);
		return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
	}
	static from(other) {
		if (typeof other === "string") return Principal$1.fromText(other);
		else if (Object.getPrototypeOf(other) === Uint8Array.prototype) return new Principal$1(other);
		else if (Principal$1.isPrincipal(other)) return new Principal$1(other._arr);
		throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
	}
	static fromHex(hex) {
		return new this(hexToBytes(hex));
	}
	static fromText(text) {
		let maybePrincipal = text;
		if (text.includes("__principal__")) {
			const obj = JSON.parse(text);
			if ("__principal__" in obj) maybePrincipal = obj[JSON_KEY_PRINCIPAL];
		}
		let arr = base32Decode(maybePrincipal.toLowerCase().replace(/-/g, ""));
		arr = arr.slice(4, arr.length);
		const principal = new this(arr);
		if (principal.toText() !== maybePrincipal) throw new Error(`Principal "${principal.toText()}" does not have a valid checksum (original value "${maybePrincipal}" may not be a valid Principal ID).`);
		return principal;
	}
	static fromUint8Array(arr) {
		return new this(arr);
	}
	static isPrincipal(other) {
		return other instanceof Principal$1 || typeof other === "object" && other !== null && "_isPrincipal" in other && other["_isPrincipal"] === true && "_arr" in other && other["_arr"] instanceof Uint8Array;
	}
	constructor(_arr) {
		this._arr = _arr;
		this._isPrincipal = true;
	}
	isAnonymous() {
		return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
	}
	toUint8Array() {
		return this._arr;
	}
	toHex() {
		return bytesToHex(this._arr).toUpperCase();
	}
	toText() {
		const checksumArrayBuf = /* @__PURE__ */ new ArrayBuffer(4);
		new DataView(checksumArrayBuf).setUint32(0, getCrc32(this._arr));
		const checksum = new Uint8Array(checksumArrayBuf);
		const matches = base32Encode(new Uint8Array([...checksum, ...this._arr])).match(/.{1,5}/g);
		if (!matches) throw new Error();
		return matches.join("-");
	}
	toString() {
		return this.toText();
	}
	/**
	* Serializes to JSON
	* @returns {JsonnablePrincipal} a JSON object with a single key, {@link JSON_KEY_PRINCIPAL}, whose value is the principal as a string
	*/
	toJSON() {
		return { [JSON_KEY_PRINCIPAL]: this.toText() };
	}
	/**
	* Utility method taking a Principal to compare against. Used for determining canister ranges in certificate verification
	* @param {Principal} other - a {@link Principal} to compare
	* @returns {'lt' | 'eq' | 'gt'} `'lt' | 'eq' | 'gt'` a string, representing less than, equal to, or greater than
	*/
	compareTo(other) {
		for (let i = 0; i < Math.min(this._arr.length, other._arr.length); i++) if (this._arr[i] < other._arr[i]) return "lt";
		else if (this._arr[i] > other._arr[i]) return "gt";
		if (this._arr.length < other._arr.length) return "lt";
		if (this._arr.length > other._arr.length) return "gt";
		return "eq";
	}
	/**
	* Utility method checking whether a provided Principal is less than or equal to the current one using the {@link Principal.compareTo} method
	* @param other a {@link Principal} to compare
	* @returns {boolean} boolean
	*/
	ltEq(other) {
		const cmp = this.compareTo(other);
		return cmp == "lt" || cmp == "eq";
	}
	/**
	* Utility method checking whether a provided Principal is greater than or equal to the current one using the {@link Principal.compareTo} method
	* @param other a {@link Principal} to compare
	* @returns {boolean} boolean
	*/
	gtEq(other) {
		const cmp = this.compareTo(other);
		return cmp == "gt" || cmp == "eq";
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/errors.js
var ErrorKindEnum;
(function(ErrorKindEnum) {
	ErrorKindEnum["Trust"] = "Trust";
	ErrorKindEnum["Protocol"] = "Protocol";
	ErrorKindEnum["Reject"] = "Reject";
	ErrorKindEnum["Transport"] = "Transport";
	ErrorKindEnum["External"] = "External";
	ErrorKindEnum["Limit"] = "Limit";
	ErrorKindEnum["Input"] = "Input";
	ErrorKindEnum["Unknown"] = "Unknown";
})(ErrorKindEnum || (ErrorKindEnum = {}));
var ErrorCode = class {
	constructor(isCertified = false) {
		this.isCertified = isCertified;
	}
	toString() {
		let errorMessage = this.toErrorMessage();
		if (this.requestContext) errorMessage += `\nRequest context:\n  Request ID (hex): ${this.requestContext.requestId ? bytesToHex(this.requestContext.requestId) : "undefined"}\n  Sender pubkey (hex): ${bytesToHex(this.requestContext.senderPubKey)}\n  Sender signature (hex): ${bytesToHex(this.requestContext.senderSignature)}\n  Ingress expiry: ${this.requestContext.ingressExpiry.toString()}`;
		if (this.callContext) errorMessage += `\nCall context:\n  Canister ID: ${this.callContext.canisterId.toText()}\n  Method name: ${this.callContext.methodName}\n  HTTP details: ${JSON.stringify(this.callContext.httpDetails, null, 2)}`;
		return errorMessage;
	}
};
/**
* An error that happens in the Agent. This is the root of all errors and should be used
* everywhere in the Agent code (this package).
*
* To know if the error is certified, use the `isCertified` getter.
*/
var AgentError = class AgentError extends Error {
	get code() {
		return this.cause.code;
	}
	set code(code) {
		this.cause.code = code;
	}
	get kind() {
		return this.cause.kind;
	}
	set kind(kind) {
		this.cause.kind = kind;
	}
	/**
	* Reads the `isCertified` property of the underlying error code.
	* @returns `true` if the error is certified, `false` otherwise.
	*/
	get isCertified() {
		return this.code.isCertified;
	}
	constructor(code, kind) {
		super(code.toString());
		this.name = "AgentError";
		this.cause = {
			code,
			kind
		};
		Object.setPrototypeOf(this, AgentError.prototype);
	}
	hasCode(code) {
		return this.code instanceof code;
	}
	toString() {
		return `${this.name} (${this.kind}): ${this.message}`;
	}
};
var ErrorKind = class extends AgentError {
	static fromCode(code) {
		return new this(code);
	}
};
var TrustError = class TrustError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Trust);
		this.name = "TrustError";
		Object.setPrototypeOf(this, TrustError.prototype);
	}
};
var ProtocolError = class ProtocolError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Protocol);
		this.name = "ProtocolError";
		Object.setPrototypeOf(this, ProtocolError.prototype);
	}
};
var RejectError = class RejectError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Reject);
		this.name = "RejectError";
		Object.setPrototypeOf(this, RejectError.prototype);
	}
};
var TransportError = class TransportError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Transport);
		this.name = "TransportError";
		Object.setPrototypeOf(this, TransportError.prototype);
	}
};
var ExternalError = class ExternalError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.External);
		this.name = "ExternalError";
		Object.setPrototypeOf(this, ExternalError.prototype);
	}
};
var InputError = class InputError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Input);
		this.name = "InputError";
		Object.setPrototypeOf(this, InputError.prototype);
	}
};
var UnknownError = class UnknownError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Unknown);
		this.name = "UnknownError";
		Object.setPrototypeOf(this, UnknownError.prototype);
	}
};
var CertificateVerificationErrorCode = class CertificateVerificationErrorCode extends ErrorCode {
	constructor(reason, error) {
		super();
		this.reason = reason;
		this.error = error;
		this.name = "CertificateVerificationErrorCode";
		Object.setPrototypeOf(this, CertificateVerificationErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = this.reason;
		if (this.error) errorMessage += `: ${formatUnknownError(this.error)}`;
		return `Certificate verification error: "${errorMessage}"`;
	}
};
var CertificateTimeErrorCode = class CertificateTimeErrorCode extends ErrorCode {
	constructor(maxAgeInMinutes, certificateTime, currentTime, timeDiffMsecs, ageType) {
		super();
		this.maxAgeInMinutes = maxAgeInMinutes;
		this.certificateTime = certificateTime;
		this.currentTime = currentTime;
		this.timeDiffMsecs = timeDiffMsecs;
		this.ageType = ageType;
		this.name = "CertificateTimeErrorCode";
		Object.setPrototypeOf(this, CertificateTimeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Certificate is signed more than ${this.maxAgeInMinutes} minutes in the ${this.ageType}. Certificate time: ${this.certificateTime.toISOString()} Current time: ${this.currentTime.toISOString()} Clock drift: ${this.timeDiffMsecs}ms`;
	}
};
var CertificateHasTooManyDelegationsErrorCode = class CertificateHasTooManyDelegationsErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "CertificateHasTooManyDelegationsErrorCode";
		Object.setPrototypeOf(this, CertificateHasTooManyDelegationsErrorCode.prototype);
	}
	toErrorMessage() {
		return "Certificate has too many delegations";
	}
};
var CertificateNotAuthorizedErrorCode = class CertificateNotAuthorizedErrorCode extends ErrorCode {
	constructor(canisterId, subnetId) {
		super();
		this.canisterId = canisterId;
		this.subnetId = subnetId;
		this.name = "CertificateNotAuthorizedErrorCode";
		Object.setPrototypeOf(this, CertificateNotAuthorizedErrorCode.prototype);
	}
	toErrorMessage() {
		return `The certificate contains a delegation that does not include the canister ${this.canisterId.toText()} in the canister_ranges field. Subnet ID: ${this.subnetId.toText()}`;
	}
};
var LookupErrorCode = class LookupErrorCode extends ErrorCode {
	constructor(message, lookupStatus) {
		super();
		this.message = message;
		this.lookupStatus = lookupStatus;
		this.name = "LookupErrorCode";
		Object.setPrototypeOf(this, LookupErrorCode.prototype);
	}
	toErrorMessage() {
		return `${this.message}. Lookup status: ${this.lookupStatus}`;
	}
};
var MalformedLookupFoundValueErrorCode = class MalformedLookupFoundValueErrorCode extends ErrorCode {
	constructor(message) {
		super();
		this.message = message;
		this.name = "MalformedLookupFoundValueErrorCode";
		Object.setPrototypeOf(this, MalformedLookupFoundValueErrorCode.prototype);
	}
	toErrorMessage() {
		return this.message;
	}
};
var MissingLookupValueErrorCode = class MissingLookupValueErrorCode extends ErrorCode {
	constructor(message) {
		super();
		this.message = message;
		this.name = "MissingLookupValueErrorCode";
		Object.setPrototypeOf(this, MissingLookupValueErrorCode.prototype);
	}
	toErrorMessage() {
		return this.message;
	}
};
var DerKeyLengthMismatchErrorCode = class DerKeyLengthMismatchErrorCode extends ErrorCode {
	constructor(expectedLength, actualLength) {
		super();
		this.expectedLength = expectedLength;
		this.actualLength = actualLength;
		this.name = "DerKeyLengthMismatchErrorCode";
		Object.setPrototypeOf(this, DerKeyLengthMismatchErrorCode.prototype);
	}
	toErrorMessage() {
		return `BLS DER-encoded public key must be ${this.expectedLength} bytes long, but is ${this.actualLength} bytes long`;
	}
};
var DerPrefixMismatchErrorCode = class DerPrefixMismatchErrorCode extends ErrorCode {
	constructor(expectedPrefix, actualPrefix) {
		super();
		this.expectedPrefix = expectedPrefix;
		this.actualPrefix = actualPrefix;
		this.name = "DerPrefixMismatchErrorCode";
		Object.setPrototypeOf(this, DerPrefixMismatchErrorCode.prototype);
	}
	toErrorMessage() {
		return `BLS DER-encoded public key is invalid. Expected the following prefix: ${bytesToHex(this.expectedPrefix)}, but got ${bytesToHex(this.actualPrefix)}`;
	}
};
var DerDecodeLengthMismatchErrorCode = class DerDecodeLengthMismatchErrorCode extends ErrorCode {
	constructor(expectedLength, actualLength) {
		super();
		this.expectedLength = expectedLength;
		this.actualLength = actualLength;
		this.name = "DerDecodeLengthMismatchErrorCode";
		Object.setPrototypeOf(this, DerDecodeLengthMismatchErrorCode.prototype);
	}
	toErrorMessage() {
		return `DER payload mismatch: Expected length ${this.expectedLength}, actual length: ${this.actualLength}`;
	}
};
var DerDecodeErrorCode = class DerDecodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "DerDecodeErrorCode";
		Object.setPrototypeOf(this, DerDecodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to decode DER: ${this.error}`;
	}
};
var DerEncodeErrorCode = class DerEncodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "DerEncodeErrorCode";
		Object.setPrototypeOf(this, DerEncodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to encode DER: ${this.error}`;
	}
};
var CborDecodeErrorCode = class CborDecodeErrorCode extends ErrorCode {
	constructor(error, input) {
		super();
		this.error = error;
		this.input = input;
		this.name = "CborDecodeErrorCode";
		Object.setPrototypeOf(this, CborDecodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to decode CBOR: ${formatUnknownError(this.error)}, input: ${bytesToHex(this.input)}`;
	}
};
var CborEncodeErrorCode = class CborEncodeErrorCode extends ErrorCode {
	constructor(error, value) {
		super();
		this.error = error;
		this.value = value;
		this.name = "CborEncodeErrorCode";
		Object.setPrototypeOf(this, CborEncodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to encode CBOR: ${formatUnknownError(this.error)}, input: ${this.value}`;
	}
};
var TimeoutWaitingForResponseErrorCode = class TimeoutWaitingForResponseErrorCode extends ErrorCode {
	constructor(message, requestId, status) {
		super();
		this.message = message;
		this.requestId = requestId;
		this.status = status;
		this.name = "TimeoutWaitingForResponseErrorCode";
		Object.setPrototypeOf(this, TimeoutWaitingForResponseErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = `${this.message}\n`;
		if (this.requestId) errorMessage += `  Request ID: ${bytesToHex(this.requestId)}\n`;
		if (this.status) errorMessage += `  Request status: ${this.status}\n`;
		return errorMessage;
	}
};
var CertificateOutdatedErrorCode = class CertificateOutdatedErrorCode extends ErrorCode {
	constructor(maxIngressExpiryInMinutes, requestId, retryTimes) {
		super();
		this.maxIngressExpiryInMinutes = maxIngressExpiryInMinutes;
		this.requestId = requestId;
		this.retryTimes = retryTimes;
		this.name = "CertificateOutdatedErrorCode";
		Object.setPrototypeOf(this, CertificateOutdatedErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = `Certificate is stale (over ${this.maxIngressExpiryInMinutes} minutes). Is the computer's clock synchronized?\n  Request ID: ${bytesToHex(this.requestId)}\n`;
		if (this.retryTimes !== void 0) errorMessage += `  Retried ${this.retryTimes} times.`;
		return errorMessage;
	}
};
var CertifiedRejectErrorCode = class CertifiedRejectErrorCode extends ErrorCode {
	constructor(requestId, rejectCode, rejectMessage, rejectErrorCode) {
		super(true);
		this.requestId = requestId;
		this.rejectCode = rejectCode;
		this.rejectMessage = rejectMessage;
		this.rejectErrorCode = rejectErrorCode;
		this.name = "CertifiedRejectErrorCode";
		Object.setPrototypeOf(this, CertifiedRejectErrorCode.prototype);
	}
	toErrorMessage() {
		return `The replica returned a rejection error:\n  Request ID: ${bytesToHex(this.requestId)}\n  Reject code: ${this.rejectCode}\n  Reject text: ${this.rejectMessage}\n  Error code: ${this.rejectErrorCode}\n`;
	}
};
var UncertifiedRejectErrorCode = class UncertifiedRejectErrorCode extends ErrorCode {
	constructor(requestId, rejectCode, rejectMessage, rejectErrorCode, signatures) {
		super();
		this.requestId = requestId;
		this.rejectCode = rejectCode;
		this.rejectMessage = rejectMessage;
		this.rejectErrorCode = rejectErrorCode;
		this.signatures = signatures;
		this.name = "UncertifiedRejectErrorCode";
		Object.setPrototypeOf(this, UncertifiedRejectErrorCode.prototype);
	}
	toErrorMessage() {
		return `The replica returned a rejection error:\n  Request ID: ${bytesToHex(this.requestId)}\n  Reject code: ${this.rejectCode}\n  Reject text: ${this.rejectMessage}\n  Error code: ${this.rejectErrorCode}\n`;
	}
};
var UncertifiedRejectUpdateErrorCode = class UncertifiedRejectUpdateErrorCode extends ErrorCode {
	constructor(requestId, rejectCode, rejectMessage, rejectErrorCode) {
		super();
		this.requestId = requestId;
		this.rejectCode = rejectCode;
		this.rejectMessage = rejectMessage;
		this.rejectErrorCode = rejectErrorCode;
		this.name = "UncertifiedRejectUpdateErrorCode";
		Object.setPrototypeOf(this, UncertifiedRejectUpdateErrorCode.prototype);
	}
	toErrorMessage() {
		return `The replica returned a rejection error:\n  Request ID: ${bytesToHex(this.requestId)}\n  Reject code: ${this.rejectCode}\n  Reject text: ${this.rejectMessage}\n  Error code: ${this.rejectErrorCode}\n`;
	}
};
var RequestStatusDoneNoReplyErrorCode = class RequestStatusDoneNoReplyErrorCode extends ErrorCode {
	constructor(requestId) {
		super();
		this.requestId = requestId;
		this.name = "RequestStatusDoneNoReplyErrorCode";
		Object.setPrototypeOf(this, RequestStatusDoneNoReplyErrorCode.prototype);
	}
	toErrorMessage() {
		return `Call was marked as done but we never saw the reply:\n  Request ID: ${bytesToHex(this.requestId)}\n`;
	}
};
var MissingRootKeyErrorCode = class MissingRootKeyErrorCode extends ErrorCode {
	constructor(shouldFetchRootKey) {
		super();
		this.shouldFetchRootKey = shouldFetchRootKey;
		this.name = "MissingRootKeyErrorCode";
		Object.setPrototypeOf(this, MissingRootKeyErrorCode.prototype);
	}
	toErrorMessage() {
		if (this.shouldFetchRootKey === void 0) return "Agent is missing root key";
		return `Agent is missing root key and the shouldFetchRootKey value is set to ${this.shouldFetchRootKey}. The root key should only be unknown if you are in local development. Otherwise you should avoid fetching and use the default IC Root Key or the known root key of your environment.`;
	}
};
var HashValueErrorCode = class HashValueErrorCode extends ErrorCode {
	constructor(value) {
		super();
		this.value = value;
		this.name = "HashValueErrorCode";
		Object.setPrototypeOf(this, HashValueErrorCode.prototype);
	}
	toErrorMessage() {
		return `Attempt to hash a value of unsupported type: ${this.value}`;
	}
};
var HttpDefaultFetchErrorCode = class HttpDefaultFetchErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "HttpDefaultFetchErrorCode";
		Object.setPrototypeOf(this, HttpDefaultFetchErrorCode.prototype);
	}
	toErrorMessage() {
		return this.error;
	}
};
var IdentityInvalidErrorCode = class IdentityInvalidErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "IdentityInvalidErrorCode";
		Object.setPrototypeOf(this, IdentityInvalidErrorCode.prototype);
	}
	toErrorMessage() {
		return "This identity has expired due this application's security policy. Please refresh your authentication.";
	}
};
var IngressExpiryInvalidErrorCode = class IngressExpiryInvalidErrorCode extends ErrorCode {
	constructor(message, providedIngressExpiryInMinutes) {
		super();
		this.message = message;
		this.providedIngressExpiryInMinutes = providedIngressExpiryInMinutes;
		this.name = "IngressExpiryInvalidErrorCode";
		Object.setPrototypeOf(this, IngressExpiryInvalidErrorCode.prototype);
	}
	toErrorMessage() {
		return `${this.message}. Provided ingress expiry time is ${this.providedIngressExpiryInMinutes} minutes.`;
	}
};
var CreateHttpAgentErrorCode = class CreateHttpAgentErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "CreateHttpAgentErrorCode";
		Object.setPrototypeOf(this, CreateHttpAgentErrorCode.prototype);
	}
	toErrorMessage() {
		return "Failed to create agent from provided agent";
	}
};
var MalformedSignatureErrorCode = class MalformedSignatureErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "MalformedSignatureErrorCode";
		Object.setPrototypeOf(this, MalformedSignatureErrorCode.prototype);
	}
	toErrorMessage() {
		return `Query response contained a malformed signature: ${this.error}`;
	}
};
var MissingSignatureErrorCode = class MissingSignatureErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "MissingSignatureErrorCode";
		Object.setPrototypeOf(this, MissingSignatureErrorCode.prototype);
	}
	toErrorMessage() {
		return "Query response did not contain any node signatures";
	}
};
var MalformedPublicKeyErrorCode = class MalformedPublicKeyErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "MalformedPublicKeyErrorCode";
		Object.setPrototypeOf(this, MalformedPublicKeyErrorCode.prototype);
	}
	toErrorMessage() {
		return "Read state response contained a malformed public key";
	}
};
var QuerySignatureVerificationFailedErrorCode = class QuerySignatureVerificationFailedErrorCode extends ErrorCode {
	constructor(nodeId) {
		super();
		this.nodeId = nodeId;
		this.name = "QuerySignatureVerificationFailedErrorCode";
		Object.setPrototypeOf(this, QuerySignatureVerificationFailedErrorCode.prototype);
	}
	toErrorMessage() {
		return `Query signature verification failed. Node ID: ${this.nodeId}`;
	}
};
var UnexpectedErrorCode = class UnexpectedErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "UnexpectedErrorCode";
		Object.setPrototypeOf(this, UnexpectedErrorCode.prototype);
	}
	toErrorMessage() {
		return `Unexpected error: ${formatUnknownError(this.error)}`;
	}
};
var HashTreeDecodeErrorCode = class HashTreeDecodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "HashTreeDecodeErrorCode";
		Object.setPrototypeOf(this, HashTreeDecodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to decode certificate: ${this.error}`;
	}
};
var HttpErrorCode = class HttpErrorCode extends ErrorCode {
	constructor(status, statusText, headers, bodyText) {
		super();
		this.status = status;
		this.statusText = statusText;
		this.headers = headers;
		this.bodyText = bodyText;
		this.name = "HttpErrorCode";
		Object.setPrototypeOf(this, HttpErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = `HTTP request failed:
  Status: ${this.status} (${this.statusText})\n  Headers: ${JSON.stringify(this.headers)}\n`;
		if (this.bodyText) errorMessage += `  Body: ${this.bodyText}\n`;
		return errorMessage;
	}
};
var HttpV3ApiNotSupportedErrorCode = class HttpV3ApiNotSupportedErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "HttpV3ApiNotSupportedErrorCode";
		Object.setPrototypeOf(this, HttpV3ApiNotSupportedErrorCode.prototype);
	}
	toErrorMessage() {
		return "HTTP request failed: v3 API is not supported";
	}
};
var HttpFetchErrorCode = class HttpFetchErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "HttpFetchErrorCode";
		Object.setPrototypeOf(this, HttpFetchErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to fetch HTTP request: ${formatUnknownError(this.error)}`;
	}
};
var MissingCanisterIdErrorCode = class MissingCanisterIdErrorCode extends ErrorCode {
	constructor(receivedCanisterId) {
		super();
		this.receivedCanisterId = receivedCanisterId;
		this.name = "MissingCanisterIdErrorCode";
		Object.setPrototypeOf(this, MissingCanisterIdErrorCode.prototype);
	}
	toErrorMessage() {
		return `Canister ID is required, but received ${typeof this.receivedCanisterId} instead. If you are using automatically generated declarations, this may be because your application is not setting the canister ID in process.env correctly.`;
	}
};
var InvalidReadStateRequestErrorCode = class InvalidReadStateRequestErrorCode extends ErrorCode {
	constructor(request) {
		super();
		this.request = request;
		this.name = "InvalidReadStateRequestErrorCode";
		Object.setPrototypeOf(this, InvalidReadStateRequestErrorCode.prototype);
	}
	toErrorMessage() {
		return `Invalid read state request: ${this.request}`;
	}
};
var ExpiryJsonDeserializeErrorCode = class ExpiryJsonDeserializeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "ExpiryJsonDeserializeErrorCode";
		Object.setPrototypeOf(this, ExpiryJsonDeserializeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to deserialize expiry: ${this.error}`;
	}
};
function formatUnknownError(error) {
	if (error instanceof Error) return error.stack ?? error.message;
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}
/**
* Special error used to indicate that a code path is unreachable.
*
* For internal use only.
*/
var UNREACHABLE_ERROR = /* @__PURE__ */ new Error("unreachable");
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+candid@3.3.1_@dfinity+principal@3.3.1/node_modules/@dfinity/candid/lib/esm/utils/buffer.js
/**
* Concatenate multiple Uint8Arrays.
* @param uint8Arrays The Uint8Arrays to concatenate.
*/
function concat(...uint8Arrays) {
	const result = new Uint8Array(uint8Arrays.reduce((acc, curr) => acc + curr.byteLength, 0));
	let index = 0;
	for (const b of uint8Arrays) {
		result.set(b, index);
		index += b.byteLength;
	}
	return result;
}
/**
* A class that abstracts a pipe-like Uint8Array.
*/
var PipeArrayBuffer = class {
	/**
	* Save a checkpoint of the reading view (for backtracking)
	*/
	save() {
		return this._view;
	}
	/**
	* Restore a checkpoint of the reading view (for backtracking)
	* @param checkPoint a previously saved checkpoint
	*/
	restore(checkPoint) {
		if (!(checkPoint instanceof Uint8Array)) throw new Error("Checkpoint must be a Uint8Array");
		this._view = checkPoint;
	}
	/**
	* Creates a new instance of a pipe
	* @param buffer an optional buffer to start with
	* @param length an optional amount of bytes to use for the length.
	*/
	constructor(buffer, length = buffer?.byteLength || 0) {
		if (buffer && !(buffer instanceof Uint8Array)) try {
			buffer = uint8FromBufLike$1(buffer);
		} catch {
			throw new Error("Buffer must be a Uint8Array");
		}
		if (length < 0 || !Number.isInteger(length)) throw new Error("Length must be a non-negative integer");
		if (buffer && length > buffer.byteLength) throw new Error("Length cannot exceed buffer length");
		this._buffer = buffer || /* @__PURE__ */ new Uint8Array(0);
		this._view = new Uint8Array(this._buffer.buffer, 0, length);
	}
	get buffer() {
		return this._view.slice();
	}
	get byteLength() {
		return this._view.byteLength;
	}
	/**
	* Read `num` number of bytes from the front of the pipe.
	* @param num The number of bytes to read.
	*/
	read(num) {
		const result = this._view.subarray(0, num);
		this._view = this._view.subarray(num);
		return result.slice();
	}
	readUint8() {
		if (this._view.byteLength === 0) return;
		const result = this._view[0];
		this._view = this._view.subarray(1);
		return result;
	}
	/**
	* Write a buffer to the end of the pipe.
	* @param buf The bytes to write.
	*/
	write(buf) {
		if (!(buf instanceof Uint8Array)) throw new Error("Buffer must be a Uint8Array");
		const offset = this._view.byteLength;
		if (this._view.byteOffset + this._view.byteLength + buf.byteLength >= this._buffer.byteLength) this.alloc(buf.byteLength);
		else this._view = new Uint8Array(this._buffer.buffer, this._view.byteOffset, this._view.byteLength + buf.byteLength);
		this._view.set(buf, offset);
	}
	/**
	* Whether or not there is more data to read from the buffer
	*/
	get end() {
		return this._view.byteLength === 0;
	}
	/**
	* Allocate a fixed amount of memory in the buffer. This does not affect the view.
	* @param amount A number of bytes to add to the buffer.
	*/
	alloc(amount) {
		if (amount <= 0 || !Number.isInteger(amount)) throw new Error("Amount must be a positive integer");
		const b = new Uint8Array((this._buffer.byteLength + amount) * 1.2 | 0);
		const v = new Uint8Array(b.buffer, 0, this._view.byteLength + amount);
		v.set(this._view);
		this._buffer = b;
		this._view = v;
	}
};
/**
* Returns a true Uint8Array from an ArrayBufferLike object.
* @param bufLike a buffer-like object
* @returns Uint8Array
*/
function uint8FromBufLike$1(bufLike) {
	if (!bufLike) throw new Error("Input cannot be null or undefined");
	if (bufLike instanceof Uint8Array) return bufLike;
	if (bufLike instanceof ArrayBuffer) return new Uint8Array(bufLike);
	if (Array.isArray(bufLike)) return new Uint8Array(bufLike);
	if ("buffer" in bufLike) return uint8FromBufLike$1(bufLike.buffer);
	return new Uint8Array(bufLike);
}
/**
*
* @param u1 uint8Array 1
* @param u2 uint8Array 2
* @returns number - negative if u1 < u2, positive if u1 > u2, 0 if u1 === u2
*/
function compare(u1, u2) {
	if (u1.byteLength !== u2.byteLength) return u1.byteLength - u2.byteLength;
	for (let i = 0; i < u1.length; i++) if (u1[i] !== u2[i]) return u1[i] - u2[i];
	return 0;
}
/**
* Checks two uint8Arrays for equality.
* @param u1 uint8Array 1
* @param u2 uint8Array 2
* @returns boolean
*/
function uint8Equals$1(u1, u2) {
	return compare(u1, u2) === 0;
}
/**
* Helpers to convert a Uint8Array to a DataView.
* @param uint8 Uint8Array
* @returns DataView
*/
function uint8ToDataView(uint8) {
	if (!(uint8 instanceof Uint8Array)) throw new Error("Input must be a Uint8Array");
	return new DataView(uint8.buffer, uint8.byteOffset, uint8.byteLength);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+candid@3.3.1_@dfinity+principal@3.3.1/node_modules/@dfinity/candid/lib/esm/utils/hash.js
/**
* Hashes a string to a number. Algorithm can be found here:
* https://caml.inria.fr/pub/papers/garrigue-polymorphic_variants-ml98.pdf
* @param s - string to hash
* @returns number representing hashed string
*/
function idlHash(s) {
	const array = new TextEncoder().encode(s);
	let h = 0;
	for (const c of array) h = (h * 223 + c) % 2 ** 32;
	return h;
}
/**
*
* @param label string
* @returns number representing hashed label
*/
function idlLabelToId(label) {
	if (/^_\d+_$/.test(label) || /^_0x[0-9a-fA-F]+_$/.test(label)) {
		const num = +label.slice(1, -1);
		if (Number.isSafeInteger(num) && num >= 0 && num < 2 ** 32) return num;
	}
	return idlHash(label);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+candid@3.3.1_@dfinity+principal@3.3.1/node_modules/@dfinity/candid/lib/esm/utils/bigint-math.js
/**
* Equivalent to `Math.log2(n)` with support for `BigInt` values
* @param n bigint or integer
* @returns integer
*/
function ilog2(n) {
	const nBig = BigInt(n);
	if (n <= 0) throw new RangeError("Input must be positive");
	return nBig.toString(2).length - 1;
}
/**
* Equivalent to `2 ** n` with support for `BigInt` values
* (necessary for browser preprocessors which replace the `**` operator with `Math.pow`)
* @param n bigint or integer
* @returns bigint
*/
function iexp2(n) {
	const nBig = BigInt(n);
	if (n < 0) throw new RangeError("Input must be non-negative");
	return BigInt(1) << nBig;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+candid@3.3.1_@dfinity+principal@3.3.1/node_modules/@dfinity/candid/lib/esm/utils/leb128.js
function eob() {
	throw new Error("unexpected end of buffer");
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param num number
* @returns Uint8Array
*/
function safeRead(pipe, num) {
	if (pipe.byteLength < num) eob();
	return pipe.read(num);
}
/**
* @param pipe - PipeArrayBuffer simulating buffer-pipe api
*/
function safeReadUint8(pipe) {
	const byte = pipe.readUint8();
	if (byte === void 0) eob();
	return byte;
}
/**
* Encode a positive number (or bigint) into a Buffer. The number will be floored to the
* nearest integer.
* @param value The number to encode.
*/
function lebEncode(value) {
	if (typeof value === "number") value = BigInt(value);
	if (value < BigInt(0)) throw new Error("Cannot leb encode negative values.");
	const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
	const pipe = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
	while (true) {
		const i = Number(value & BigInt(127));
		value /= BigInt(128);
		if (value === BigInt(0)) {
			pipe.write(new Uint8Array([i]));
			break;
		} else pipe.write(new Uint8Array([i | 128]));
	}
	return pipe.buffer;
}
/**
* Decode a leb encoded buffer into a bigint. The number will always be positive (does not
* support signed leb encoding).
* @param pipe A Buffer containing the leb encoded bits.
*/
function lebDecode(pipe) {
	let weight = BigInt(1);
	let value = BigInt(0);
	let byte;
	do {
		byte = safeReadUint8(pipe);
		value += BigInt(byte & 127).valueOf() * weight;
		weight *= BigInt(128);
	} while (byte >= 128);
	return value;
}
/**
* Encode a number (or bigint) into a Buffer, with support for negative numbers. The number
* will be floored to the nearest integer.
* @param value The number to encode.
*/
function slebEncode(value) {
	if (typeof value === "number") value = BigInt(value);
	const isNeg = value < BigInt(0);
	if (isNeg) value = -value - BigInt(1);
	const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
	const pipe = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
	while (true) {
		const i = getLowerBytes(value);
		value /= BigInt(128);
		if (isNeg && value === BigInt(0) && (i & 64) !== 0 || !isNeg && value === BigInt(0) && (i & 64) === 0) {
			pipe.write(new Uint8Array([i]));
			break;
		} else pipe.write(new Uint8Array([i | 128]));
	}
	function getLowerBytes(num) {
		const bytes = num % BigInt(128);
		if (isNeg) return Number(BigInt(128) - bytes - BigInt(1));
		else return Number(bytes);
	}
	return pipe.buffer;
}
/**
* Decode a leb encoded buffer into a bigint. The number is decoded with support for negative
* signed-leb encoding.
* @param pipe A Buffer containing the signed leb encoded bits.
*/
function slebDecode(pipe) {
	const pipeView = new Uint8Array(pipe.buffer);
	let len = 0;
	for (; len < pipeView.byteLength; len++) if (pipeView[len] < 128) {
		if ((pipeView[len] & 64) === 0) return lebDecode(pipe);
		break;
	}
	const bytes = new Uint8Array(safeRead(pipe, len + 1));
	let value = BigInt(0);
	for (let i = bytes.byteLength - 1; i >= 0; i--) value = value * BigInt(128) + BigInt(128 - (bytes[i] & 127) - 1);
	return -value - BigInt(1);
}
/**
*
* @param value bigint or number
* @param byteLength number
* @returns Uint8Array
*/
function writeUIntLE(value, byteLength) {
	if (BigInt(value) < BigInt(0)) throw new Error("Cannot write negative values.");
	return writeIntLE(value, byteLength);
}
/**
*
* @param value - bigint or number
* @param byteLength - number
* @returns Uint8Array
*/
function writeIntLE(value, byteLength) {
	value = BigInt(value);
	const pipe = new PipeArrayBuffer(new Uint8Array(Math.min(1, byteLength)), 0);
	let i = 0;
	let mul = BigInt(256);
	let sub = BigInt(0);
	let byte = Number(value % mul);
	pipe.write(new Uint8Array([byte]));
	while (++i < byteLength) {
		if (value < 0 && sub === BigInt(0) && byte !== 0) sub = BigInt(1);
		byte = Number((value / mul - sub) % BigInt(256));
		pipe.write(new Uint8Array([byte]));
		mul *= BigInt(256);
	}
	return pipe.buffer;
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param byteLength number
* @returns bigint
*/
function readUIntLE(pipe, byteLength) {
	if (byteLength <= 0 || !Number.isInteger(byteLength)) throw new Error("Byte length must be a positive integer");
	let val = BigInt(safeReadUint8(pipe));
	let mul = BigInt(1);
	let i = 0;
	while (++i < byteLength) {
		mul *= BigInt(256);
		const byte = BigInt(safeReadUint8(pipe));
		val = val + mul * byte;
	}
	return val;
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param byteLength number
* @returns bigint
*/
function readIntLE(pipe, byteLength) {
	if (byteLength <= 0 || !Number.isInteger(byteLength)) throw new Error("Byte length must be a positive integer");
	let val = readUIntLE(pipe, byteLength);
	const mul = BigInt(2) ** (BigInt(8) * BigInt(byteLength - 1) + BigInt(7));
	if (val >= mul) val -= mul * BigInt(2);
	return val;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+candid@3.3.1_@dfinity+principal@3.3.1/node_modules/@dfinity/candid/lib/esm/idl.js
var idl_exports = /* @__PURE__ */ __exportAll({
	Bool: () => Bool,
	BoolClass: () => BoolClass,
	ConstructType: () => ConstructType,
	Empty: () => Empty,
	EmptyClass: () => EmptyClass,
	FixedIntClass: () => FixedIntClass,
	FixedNatClass: () => FixedNatClass,
	Float32: () => Float32,
	Float64: () => Float64,
	FloatClass: () => FloatClass,
	Func: () => Func,
	FuncClass: () => FuncClass,
	Int: () => Int,
	Int16: () => Int16,
	Int32: () => Int32,
	Int64: () => Int64,
	Int8: () => Int8,
	IntClass: () => IntClass,
	Nat: () => Nat,
	Nat16: () => Nat16,
	Nat32: () => Nat32,
	Nat64: () => Nat64,
	Nat8: () => Nat8,
	NatClass: () => NatClass,
	Null: () => Null,
	NullClass: () => NullClass,
	Opt: () => Opt,
	OptClass: () => OptClass,
	PrimitiveType: () => PrimitiveType,
	Principal: () => Principal,
	PrincipalClass: () => PrincipalClass,
	Rec: () => Rec,
	RecClass: () => RecClass,
	Record: () => Record,
	RecordClass: () => RecordClass,
	Reserved: () => Reserved,
	ReservedClass: () => ReservedClass,
	Service: () => Service,
	ServiceClass: () => ServiceClass,
	Text: () => Text,
	TextClass: () => TextClass,
	Tuple: () => Tuple,
	TupleClass: () => TupleClass,
	Type: () => Type,
	Unknown: () => Unknown,
	UnknownClass: () => UnknownClass,
	Variant: () => Variant,
	VariantClass: () => VariantClass,
	Vec: () => Vec,
	VecClass: () => VecClass,
	Visitor: () => Visitor,
	decode: () => decode$1,
	encode: () => encode$1,
	resetSubtypeCache: () => resetSubtypeCache,
	subtype: () => subtype
});
/**
* This module provides a combinator library to create serializers/deserializers
* between JavaScript values and IDL used by canisters on the Internet Computer,
* as documented at https://github.com/dfinity/candid/blob/119703ba342d2fef6ab4972d2541b9fe36ae8e36/spec/Candid.md
*/
var IDLTypeIds;
(function(IDLTypeIds) {
	IDLTypeIds[IDLTypeIds["Null"] = -1] = "Null";
	IDLTypeIds[IDLTypeIds["Bool"] = -2] = "Bool";
	IDLTypeIds[IDLTypeIds["Nat"] = -3] = "Nat";
	IDLTypeIds[IDLTypeIds["Int"] = -4] = "Int";
	IDLTypeIds[IDLTypeIds["Float32"] = -13] = "Float32";
	IDLTypeIds[IDLTypeIds["Float64"] = -14] = "Float64";
	IDLTypeIds[IDLTypeIds["Text"] = -15] = "Text";
	IDLTypeIds[IDLTypeIds["Reserved"] = -16] = "Reserved";
	IDLTypeIds[IDLTypeIds["Empty"] = -17] = "Empty";
	IDLTypeIds[IDLTypeIds["Opt"] = -18] = "Opt";
	IDLTypeIds[IDLTypeIds["Vector"] = -19] = "Vector";
	IDLTypeIds[IDLTypeIds["Record"] = -20] = "Record";
	IDLTypeIds[IDLTypeIds["Variant"] = -21] = "Variant";
	IDLTypeIds[IDLTypeIds["Func"] = -22] = "Func";
	IDLTypeIds[IDLTypeIds["Service"] = -23] = "Service";
	IDLTypeIds[IDLTypeIds["Principal"] = -24] = "Principal";
})(IDLTypeIds || (IDLTypeIds = {}));
var magicNumber = "DIDL";
var toReadableString_max = 400;
function zipWith(xs, ys, f) {
	return xs.map((x, i) => f(x, ys[i]));
}
/**
* An IDL Type Table, which precedes the data in the stream.
*/
var TypeTable = class {
	constructor() {
		this._typs = [];
		this._idx = /* @__PURE__ */ new Map();
		this._idxRefCount = /* @__PURE__ */ new Map();
	}
	has(obj) {
		return this._idx.has(obj.name);
	}
	add(type, buf) {
		const idx = this._typs.length;
		this._idx.set(type.name, idx);
		this._idxRefCount.set(idx, 1);
		this._typs.push(buf);
	}
	merge(obj, knot) {
		const idx = this._idx.get(obj.name);
		const knotIdx = this._idx.get(knot);
		if (idx === void 0) throw new Error("Missing type index for " + obj);
		if (knotIdx === void 0) throw new Error("Missing type index for " + knot);
		this._typs[idx] = this._typs[knotIdx];
		const idxRefCount = this._getIdxRefCount(idx);
		const knotRefCount = this._getIdxRefCount(knotIdx);
		this._idxRefCount.set(idx, idxRefCount + knotRefCount);
		this._idx.set(knot, idx);
		this._idxRefCount.set(knotIdx, 0);
		this._compactFromEnd();
	}
	_getIdxRefCount(idx) {
		return this._idxRefCount.get(idx) || 0;
	}
	_compactFromEnd() {
		while (this._typs.length > 0) {
			const lastIndex = this._typs.length - 1;
			if (this._getIdxRefCount(lastIndex) > 0) break;
			this._typs.pop();
			this._idxRefCount.delete(lastIndex);
		}
	}
	encode() {
		return concat(lebEncode(this._typs.length), concat(...this._typs));
	}
	indexOf(typeName) {
		if (!this._idx.has(typeName)) throw new Error("Missing type index for " + typeName);
		return slebEncode(this._idx.get(typeName) || 0);
	}
};
var Visitor = class {
	visitType(_t, _data) {
		throw new Error("Not implemented");
	}
	visitPrimitive(t, data) {
		return this.visitType(t, data);
	}
	visitEmpty(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitBool(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitNull(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitReserved(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitText(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitNumber(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitInt(t, data) {
		return this.visitNumber(t, data);
	}
	visitNat(t, data) {
		return this.visitNumber(t, data);
	}
	visitFloat(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitFixedInt(t, data) {
		return this.visitNumber(t, data);
	}
	visitFixedNat(t, data) {
		return this.visitNumber(t, data);
	}
	visitPrincipal(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitConstruct(t, data) {
		return this.visitType(t, data);
	}
	visitVec(t, _ty, data) {
		return this.visitConstruct(t, data);
	}
	visitOpt(t, _ty, data) {
		return this.visitConstruct(t, data);
	}
	visitRecord(t, _fields, data) {
		return this.visitConstruct(t, data);
	}
	visitTuple(t, components, data) {
		const fields = components.map((ty, i) => [`_${i}_`, ty]);
		return this.visitRecord(t, fields, data);
	}
	visitVariant(t, _fields, data) {
		return this.visitConstruct(t, data);
	}
	visitRec(_t, ty, data) {
		return this.visitConstruct(ty, data);
	}
	visitFunc(t, data) {
		return this.visitConstruct(t, data);
	}
	visitService(t, data) {
		return this.visitConstruct(t, data);
	}
};
var IdlTypeName;
(function(IdlTypeName) {
	IdlTypeName["EmptyClass"] = "__IDL_EmptyClass__";
	IdlTypeName["UnknownClass"] = "__IDL_UnknownClass__";
	IdlTypeName["BoolClass"] = "__IDL_BoolClass__";
	IdlTypeName["NullClass"] = "__IDL_NullClass__";
	IdlTypeName["ReservedClass"] = "__IDL_ReservedClass__";
	IdlTypeName["TextClass"] = "__IDL_TextClass__";
	IdlTypeName["IntClass"] = "__IDL_IntClass__";
	IdlTypeName["NatClass"] = "__IDL_NatClass__";
	IdlTypeName["FloatClass"] = "__IDL_FloatClass__";
	IdlTypeName["FixedIntClass"] = "__IDL_FixedIntClass__";
	IdlTypeName["FixedNatClass"] = "__IDL_FixedNatClass__";
	IdlTypeName["VecClass"] = "__IDL_VecClass__";
	IdlTypeName["OptClass"] = "__IDL_OptClass__";
	IdlTypeName["RecordClass"] = "__IDL_RecordClass__";
	IdlTypeName["TupleClass"] = "__IDL_TupleClass__";
	IdlTypeName["VariantClass"] = "__IDL_VariantClass__";
	IdlTypeName["RecClass"] = "__IDL_RecClass__";
	IdlTypeName["PrincipalClass"] = "__IDL_PrincipalClass__";
	IdlTypeName["FuncClass"] = "__IDL_FuncClass__";
	IdlTypeName["ServiceClass"] = "__IDL_ServiceClass__";
})(IdlTypeName || (IdlTypeName = {}));
/**
* Represents an IDL type.
*/
var Type = class {
	display() {
		return this.name;
	}
	valueToString(x) {
		return toReadableString(x);
	}
	buildTypeTable(typeTable) {
		if (!typeTable.has(this)) this._buildTypeTableImpl(typeTable);
	}
};
var PrimitiveType = class extends Type {
	checkType(t) {
		if (this.name !== t.name) throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
		return t;
	}
	_buildTypeTableImpl(_typeTable) {}
};
var ConstructType = class extends Type {
	checkType(t) {
		if (t instanceof RecClass) {
			const ty = t.getType();
			if (typeof ty === "undefined") throw new Error("type mismatch with uninitialized type");
			return ty;
		}
		throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
	}
	encodeType(typeTable) {
		return typeTable.indexOf(this.name);
	}
};
/**
* Represents an IDL Empty, a type which has no inhabitants.
* Since no values exist for this type, it cannot be serialised or deserialised.
* Result types like `Result<Text, Empty>` should always succeed.
*/
var EmptyClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.EmptyClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.EmptyClass;
	}
	accept(v, d) {
		return v.visitEmpty(this, d);
	}
	covariant(x) {
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		throw new Error("Empty cannot appear as a function argument");
	}
	valueToString() {
		throw new Error("Empty cannot appear as a value");
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Empty);
	}
	decodeValue() {
		throw new Error("Empty cannot appear as an output");
	}
	get name() {
		return "empty";
	}
};
/**
* Represents an IDL Unknown, a placeholder type for deserialization only.
* When decoding a value as Unknown, all fields will be retained but the names are only available in
* hashed form.
* A deserialized unknown will offer it's actual type by calling the `type()` function.
* Unknown cannot be serialized and attempting to do so will throw an error.
*/
var UnknownClass = class extends Type {
	get typeName() {
		return IdlTypeName.UnknownClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.UnknownClass;
	}
	checkType(_t) {
		throw new Error("Method not implemented for unknown.");
	}
	accept(v, d) {
		throw v.visitType(this, d);
	}
	covariant(x) {
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		throw new Error("Unknown cannot appear as a function argument");
	}
	valueToString() {
		throw new Error("Unknown cannot appear as a value");
	}
	encodeType() {
		throw new Error("Unknown cannot be serialized");
	}
	decodeValue(b, t) {
		let decodedValue = t.decodeValue(b, t);
		if (Object(decodedValue) !== decodedValue) decodedValue = Object(decodedValue);
		let typeFunc;
		if (t instanceof RecClass) typeFunc = () => t.getType();
		else typeFunc = () => t;
		Object.defineProperty(decodedValue, "type", {
			value: typeFunc,
			writable: true,
			enumerable: false,
			configurable: true
		});
		return decodedValue;
	}
	_buildTypeTableImpl() {
		throw new Error("Unknown cannot be serialized");
	}
	get name() {
		return "Unknown";
	}
};
/**
* Represents an IDL Bool
*/
var BoolClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.BoolClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.BoolClass;
	}
	accept(v, d) {
		return v.visitBool(this, d);
	}
	covariant(x) {
		if (typeof x === "boolean") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return new Uint8Array([x ? 1 : 0]);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Bool);
	}
	decodeValue(b, t) {
		this.checkType(t);
		switch (safeReadUint8(b)) {
			case 0: return false;
			case 1: return true;
			default: throw new Error("Boolean value out of range");
		}
	}
	get name() {
		return "bool";
	}
};
/**
* Represents an IDL Null
*/
var NullClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.NullClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.NullClass;
	}
	accept(v, d) {
		return v.visitNull(this, d);
	}
	covariant(x) {
		if (x === null) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		return /* @__PURE__ */ new Uint8Array(0);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Null);
	}
	decodeValue(_b, t) {
		this.checkType(t);
		return null;
	}
	get name() {
		return "null";
	}
};
/**
* Represents an IDL Reserved
*/
var ReservedClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.ReservedClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.ReservedClass;
	}
	accept(v, d) {
		return v.visitReserved(this, d);
	}
	covariant(_x) {
		return true;
	}
	encodeValue() {
		return /* @__PURE__ */ new Uint8Array(0);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Reserved);
	}
	decodeValue(b, t) {
		if (t.name !== this.name) t.decodeValue(b, t);
		return null;
	}
	get name() {
		return "reserved";
	}
};
/**
* Represents an IDL Text
*/
var TextClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.TextClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.TextClass;
	}
	accept(v, d) {
		return v.visitText(this, d);
	}
	covariant(x) {
		if (typeof x === "string") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = new TextEncoder().encode(x);
		return concat(lebEncode(buf.byteLength), buf);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Text);
	}
	decodeValue(b, t) {
		this.checkType(t);
		const len = lebDecode(b);
		const buf = safeRead(b, Number(len));
		return new TextDecoder("utf8", { fatal: true }).decode(buf);
	}
	get name() {
		return "text";
	}
	valueToString(x) {
		return "\"" + x + "\"";
	}
};
/**
* Represents an IDL Int
*/
var IntClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.IntClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.IntClass;
	}
	accept(v, d) {
		return v.visitInt(this, d);
	}
	covariant(x) {
		if (typeof x === "bigint" || Number.isInteger(x)) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return slebEncode(x);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Int);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return slebDecode(b);
	}
	get name() {
		return "int";
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Nat
*/
var NatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.NatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.NatClass;
	}
	accept(v, d) {
		return v.visitNat(this, d);
	}
	covariant(x) {
		if (typeof x === "bigint" && x >= BigInt(0) || Number.isInteger(x) && x >= 0) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return lebEncode(x);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Nat);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return lebDecode(b);
	}
	get name() {
		return "nat";
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Float
*/
var FloatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FloatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FloatClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
		if (_bits !== 32 && _bits !== 64) throw new Error("not a valid float type");
	}
	accept(v, d) {
		return v.visitFloat(this, d);
	}
	covariant(x) {
		if (typeof x === "number" || x instanceof Number) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = /* @__PURE__ */ new ArrayBuffer(this._bits / 8);
		const view = new DataView(buf);
		if (this._bits === 32) view.setFloat32(0, x, true);
		else view.setFloat64(0, x, true);
		return new Uint8Array(buf);
	}
	encodeType() {
		return slebEncode(this._bits === 32 ? IDLTypeIds.Float32 : IDLTypeIds.Float64);
	}
	decodeValue(b, t) {
		this.checkType(t);
		const view = uint8ToDataView(safeRead(b, this._bits / 8));
		if (this._bits === 32) return view.getFloat32(0, true);
		else return view.getFloat64(0, true);
	}
	get name() {
		return "float" + this._bits;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL fixed-width Int(n)
*/
var FixedIntClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FixedIntClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FixedIntClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
	}
	accept(v, d) {
		return v.visitFixedInt(this, d);
	}
	covariant(x) {
		const min = iexp2(this._bits - 1) * BigInt(-1);
		const max = iexp2(this._bits - 1) - BigInt(1);
		let ok = false;
		if (typeof x === "bigint") ok = x >= min && x <= max;
		else if (Number.isInteger(x)) {
			const v = BigInt(x);
			ok = v >= min && v <= max;
		} else ok = false;
		if (ok) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return writeIntLE(x, this._bits / 8);
	}
	encodeType() {
		return slebEncode(-9 - (Math.log2(this._bits) - 3));
	}
	decodeValue(b, t) {
		this.checkType(t);
		const num = readIntLE(b, this._bits / 8);
		if (this._bits <= 32) return Number(num);
		else return num;
	}
	get name() {
		return `int${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL fixed-width Nat(n)
*/
var FixedNatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FixedNatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FixedNatClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
	}
	accept(v, d) {
		return v.visitFixedNat(this, d);
	}
	covariant(x) {
		const max = iexp2(this._bits);
		let ok = false;
		if (typeof x === "bigint" && x >= BigInt(0)) ok = x < max;
		else if (Number.isInteger(x) && x >= 0) ok = BigInt(x) < max;
		else ok = false;
		if (ok) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return writeUIntLE(x, this._bits / 8);
	}
	encodeType() {
		return slebEncode(-5 - (Math.log2(this._bits) - 3));
	}
	decodeValue(b, t) {
		this.checkType(t);
		const num = readUIntLE(b, this._bits / 8);
		if (this._bits <= 32) return Number(num);
		else return num;
	}
	get name() {
		return `nat${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Array
*
* Arrays of fixed-sized nat/int type (e.g. nat8), are encoded from and decoded to TypedArrays (e.g. Uint8Array).
* Arrays of float or other non-primitive types are encoded/decoded as untyped array in Javascript.
* @param {Type} t
*/
var VecClass = class VecClass extends ConstructType {
	get typeName() {
		return IdlTypeName.VecClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.VecClass;
	}
	constructor(_type) {
		super();
		this._type = _type;
		this._blobOptimization = false;
		if (_type instanceof FixedNatClass && _type._bits === 8) this._blobOptimization = true;
	}
	accept(v, d) {
		return v.visitVec(this, this._type, d);
	}
	covariant(x) {
		const bits = this._type instanceof FixedNatClass ? this._type._bits : this._type instanceof FixedIntClass ? this._type._bits : 0;
		if (ArrayBuffer.isView(x) && bits == x.BYTES_PER_ELEMENT * 8 || Array.isArray(x) && x.every((v, idx) => {
			try {
				return this._type.covariant(v);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nindex ${idx} -> ${e.message}`);
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const len = lebEncode(x.length);
		if (this._blobOptimization) return concat(len, new Uint8Array(x));
		if (ArrayBuffer.isView(x)) {
			if (x instanceof Int16Array || x instanceof Uint16Array) {
				const buffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(x.length * 2));
				for (let i = 0; i < x.length; i++) if (x instanceof Int16Array) buffer.setInt16(i * 2, x[i], true);
				else buffer.setUint16(i * 2, x[i], true);
				return concat(len, new Uint8Array(buffer.buffer));
			} else if (x instanceof Int32Array || x instanceof Uint32Array) {
				const buffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(x.length * 4));
				for (let i = 0; i < x.length; i++) if (x instanceof Int32Array) buffer.setInt32(i * 4, x[i], true);
				else buffer.setUint32(i * 4, x[i], true);
				return concat(len, new Uint8Array(buffer.buffer));
			} else if (x instanceof BigInt64Array || x instanceof BigUint64Array) {
				const buffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(x.length * 8));
				for (let i = 0; i < x.length; i++) if (x instanceof BigInt64Array) buffer.setBigInt64(i * 8, x[i], true);
				else buffer.setBigUint64(i * 8, x[i], true);
				return concat(len, new Uint8Array(buffer.buffer));
			} else return concat(len, new Uint8Array(x.buffer, x.byteOffset, x.byteLength));
		}
		const buf = new PipeArrayBuffer(new Uint8Array(len.byteLength + x.length), 0);
		buf.write(len);
		for (const d of x) {
			const encoded = this._type.encodeValue(d);
			buf.write(new Uint8Array(encoded));
		}
		return buf.buffer;
	}
	_buildTypeTableImpl(typeTable) {
		this._type.buildTypeTable(typeTable);
		const opCode = slebEncode(IDLTypeIds.Vector);
		const buffer = this._type.encodeType(typeTable);
		typeTable.add(this, concat(opCode, buffer));
	}
	decodeValue(b, t) {
		const vec = this.checkType(t);
		if (!(vec instanceof VecClass)) throw new Error("Not a vector type");
		const len = Number(lebDecode(b));
		if (this._type instanceof FixedNatClass) {
			if (this._type._bits == 8) return new Uint8Array(b.read(len));
			if (this._type._bits == 16) {
				const bytes = b.read(len * 2);
				return new Uint16Array(bytes.buffer, bytes.byteOffset, len);
			}
			if (this._type._bits == 32) {
				const bytes = b.read(len * 4);
				return new Uint32Array(bytes.buffer, bytes.byteOffset, len);
			}
			if (this._type._bits == 64) return new BigUint64Array(b.read(len * 8).buffer);
		}
		if (this._type instanceof FixedIntClass) {
			if (this._type._bits == 8) return new Int8Array(b.read(len));
			if (this._type._bits == 16) {
				const bytes = b.read(len * 2);
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				const result = new Int16Array(len);
				for (let i = 0; i < len; i++) result[i] = view.getInt16(i * 2, true);
				return result;
			}
			if (this._type._bits == 32) {
				const bytes = b.read(len * 4);
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				const result = new Int32Array(len);
				for (let i = 0; i < len; i++) result[i] = view.getInt32(i * 4, true);
				return result;
			}
			if (this._type._bits == 64) {
				const bytes = b.read(len * 8);
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				const result = new BigInt64Array(len);
				for (let i = 0; i < len; i++) result[i] = view.getBigInt64(i * 8, true);
				return result;
			}
		}
		const rets = [];
		for (let i = 0; i < len; i++) rets.push(this._type.decodeValue(b, vec._type));
		return rets;
	}
	get name() {
		return `vec ${this._type.name}`;
	}
	display() {
		return `vec ${this._type.display()}`;
	}
	valueToString(x) {
		return "vec {" + x.map((e) => this._type.valueToString(e)).join("; ") + "}";
	}
};
/**
* Represents an IDL Option
* @param {Type} t
*/
var OptClass = class OptClass extends ConstructType {
	get typeName() {
		return IdlTypeName.OptClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.OptClass;
	}
	constructor(_type) {
		super();
		this._type = _type;
	}
	accept(v, d) {
		return v.visitOpt(this, this._type, d);
	}
	covariant(x) {
		try {
			if (Array.isArray(x) && (x.length === 0 || x.length === 1 && this._type.covariant(x[0]))) return true;
		} catch (e) {
			throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)} \n\n-> ${e.message}`);
		}
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		if (x.length === 0) return new Uint8Array([0]);
		else return concat(new Uint8Array([1]), this._type.encodeValue(x[0]));
	}
	_buildTypeTableImpl(typeTable) {
		this._type.buildTypeTable(typeTable);
		const opCode = slebEncode(IDLTypeIds.Opt);
		const buffer = this._type.encodeType(typeTable);
		typeTable.add(this, concat(opCode, buffer));
	}
	decodeValue(b, t) {
		if (t instanceof NullClass) return [];
		if (t instanceof ReservedClass) return [];
		let wireType = t;
		if (t instanceof RecClass) {
			const ty = t.getType();
			if (typeof ty === "undefined") throw new Error("type mismatch with uninitialized type");
			else wireType = ty;
		}
		if (wireType instanceof OptClass) switch (safeReadUint8(b)) {
			case 0: return [];
			case 1: {
				const checkpoint = b.save();
				try {
					return [this._type.decodeValue(b, wireType._type)];
				} catch (e) {
					b.restore(checkpoint);
					wireType._type.decodeValue(b, wireType._type);
					return [];
				}
			}
			default: throw new Error("Not an option value");
		}
		else if (this._type instanceof NullClass || this._type instanceof OptClass || this._type instanceof ReservedClass) {
			wireType.decodeValue(b, wireType);
			return [];
		} else {
			const checkpoint = b.save();
			try {
				return [this._type.decodeValue(b, t)];
			} catch (e) {
				b.restore(checkpoint);
				wireType.decodeValue(b, t);
				return [];
			}
		}
	}
	get name() {
		return `opt ${this._type.name}`;
	}
	display() {
		return `opt ${this._type.display()}`;
	}
	valueToString(x) {
		if (x.length === 0) return "null";
		else return `opt ${this._type.valueToString(x[0])}`;
	}
};
/**
* Represents an IDL Record
* @param {object} [fields] - mapping of function name to Type
*/
var RecordClass = class RecordClass extends ConstructType {
	get typeName() {
		return IdlTypeName.RecordClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.RecordClass || instance.typeName === IdlTypeName.TupleClass;
	}
	constructor(fields = {}) {
		super();
		this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
	}
	accept(v, d) {
		return v.visitRecord(this, this._fields, d);
	}
	tryAsTuple() {
		const res = [];
		for (let i = 0; i < this._fields.length; i++) {
			const [key, type] = this._fields[i];
			if (key !== `_${i}_`) return null;
			res.push(type);
		}
		return res;
	}
	covariant(x) {
		if (typeof x === "object" && this._fields.every(([k, t]) => {
			if (!x.hasOwnProperty(k)) throw new Error(`Record is missing key "${k}".`);
			try {
				return t.covariant(x[k]);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nfield ${k} -> ${e.message}`);
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const values = this._fields.map(([key]) => x[key]);
		return concat(...zipWith(this._fields, values, ([, c], d) => c.encodeValue(d)));
	}
	_buildTypeTableImpl(T) {
		this._fields.forEach(([_, value]) => value.buildTypeTable(T));
		const opCode = slebEncode(IDLTypeIds.Record);
		const len = lebEncode(this._fields.length);
		const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(T)));
		T.add(this, concat(opCode, len, concat(...fields)));
	}
	decodeValue(b, t) {
		const record = this.checkType(t);
		if (!(record instanceof RecordClass)) throw new Error("Not a record type");
		const x = {};
		let expectedRecordIdx = 0;
		let actualRecordIdx = 0;
		while (actualRecordIdx < record._fields.length) {
			const [hash, type] = record._fields[actualRecordIdx];
			if (expectedRecordIdx >= this._fields.length) {
				type.decodeValue(b, type);
				actualRecordIdx++;
				continue;
			}
			const [expectKey, expectType] = this._fields[expectedRecordIdx];
			const expectedId = idlLabelToId(this._fields[expectedRecordIdx][0]);
			const actualId = idlLabelToId(hash);
			if (expectedId === actualId) {
				x[expectKey] = expectType.decodeValue(b, type);
				expectedRecordIdx++;
				actualRecordIdx++;
			} else if (actualId > expectedId) {
				if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
					x[expectKey] = [];
					expectedRecordIdx++;
				} else throw new Error("Cannot find required field " + expectKey);
			} else {
				type.decodeValue(b, type);
				actualRecordIdx++;
			}
		}
		for (const [expectKey, expectType] of this._fields.slice(expectedRecordIdx)) if (expectType instanceof OptClass || expectType instanceof ReservedClass) x[expectKey] = [];
		else throw new Error("Cannot find required field " + expectKey);
		return x;
	}
	get fieldsAsObject() {
		const fields = {};
		for (const [name, ty] of this._fields) fields[idlLabelToId(name)] = ty;
		return fields;
	}
	get name() {
		return `record {${this._fields.map(([key, value]) => key + ":" + value.name).join("; ")}}`;
	}
	display() {
		return `record {${this._fields.map(([key, value]) => key + ":" + value.display()).join("; ")}}`;
	}
	valueToString(x) {
		const values = this._fields.map(([key]) => x[key]);
		return `record {${zipWith(this._fields, values, ([k, c], d) => k + "=" + c.valueToString(d)).join("; ")}}`;
	}
};
/**
* Represents Tuple, a syntactic sugar for Record.
* @param {Type} components
*/
var TupleClass = class TupleClass extends RecordClass {
	get typeName() {
		return IdlTypeName.TupleClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.TupleClass;
	}
	constructor(_components) {
		const x = {};
		_components.forEach((e, i) => x["_" + i + "_"] = e);
		super(x);
		this._components = _components;
	}
	accept(v, d) {
		return v.visitTuple(this, this._components, d);
	}
	covariant(x) {
		if (Array.isArray(x) && x.length >= this._fields.length && this._components.every((t, i) => {
			try {
				return t.covariant(x[i]);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nindex ${i} -> ${e.message}`);
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return concat(...zipWith(this._components, x, (c, d) => c.encodeValue(d)));
	}
	decodeValue(b, t) {
		const tuple = this.checkType(t);
		if (!(tuple instanceof TupleClass)) throw new Error("not a tuple type");
		if (tuple._components.length < this._components.length) throw new Error("tuple mismatch");
		const res = [];
		for (const [i, wireType] of tuple._components.entries()) if (i >= this._components.length) wireType.decodeValue(b, wireType);
		else res.push(this._components[i].decodeValue(b, wireType));
		return res;
	}
	display() {
		return `record {${this._components.map((value) => value.display()).join("; ")}}`;
	}
	valueToString(values) {
		return `record {${zipWith(this._components, values, (c, d) => c.valueToString(d)).join("; ")}}`;
	}
};
/**
* Represents an IDL Variant
* @param {object} [fields] - mapping of function name to Type
*/
var VariantClass = class VariantClass extends ConstructType {
	get typeName() {
		return IdlTypeName.VariantClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.VariantClass;
	}
	constructor(fields = {}) {
		super();
		this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
	}
	accept(v, d) {
		return v.visitVariant(this, this._fields, d);
	}
	covariant(x) {
		if (typeof x === "object" && Object.entries(x).length === 1 && this._fields.every(([k, v]) => {
			try {
				return !x.hasOwnProperty(k) || v.covariant(x[k]);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nvariant ${k} -> ${e.message}`);
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		for (let i = 0; i < this._fields.length; i++) {
			const [name, type] = this._fields[i];
			if (x.hasOwnProperty(name)) return concat(lebEncode(i), type.encodeValue(x[name]));
		}
		throw Error("Variant has no data: " + x);
	}
	_buildTypeTableImpl(typeTable) {
		this._fields.forEach(([, type]) => {
			type.buildTypeTable(typeTable);
		});
		const opCode = slebEncode(IDLTypeIds.Variant);
		const len = lebEncode(this._fields.length);
		const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(typeTable)));
		typeTable.add(this, concat(opCode, len, ...fields));
	}
	decodeValue(b, t) {
		const variant = this.checkType(t);
		if (!(variant instanceof VariantClass)) throw new Error("Not a variant type");
		const idx = Number(lebDecode(b));
		if (idx >= variant._fields.length) throw Error("Invalid variant index: " + idx);
		const [wireHash, wireType] = variant._fields[idx];
		for (const [key, expectType] of this._fields) if (idlLabelToId(wireHash) === idlLabelToId(key)) {
			const value = expectType.decodeValue(b, wireType);
			return { [key]: value };
		}
		throw new Error("Cannot find field hash " + wireHash);
	}
	get name() {
		return `variant {${this._fields.map(([key, type]) => key + ":" + type.name).join("; ")}}`;
	}
	display() {
		return `variant {${this._fields.map(([key, type]) => key + (type.name === "null" ? "" : `:${type.display()}`)).join("; ")}}`;
	}
	valueToString(x) {
		for (const [name, type] of this._fields) if (x.hasOwnProperty(name)) {
			const value = type.valueToString(x[name]);
			if (value === "null") return `variant {${name}}`;
			else return `variant {${name}=${value}}`;
		}
		throw new Error("Variant has no data: " + x);
	}
	get alternativesAsObject() {
		const alternatives = {};
		for (const [name, ty] of this._fields) alternatives[idlLabelToId(name)] = ty;
		return alternatives;
	}
};
/**
* Represents a reference to an IDL type, used for defining recursive data
* types.
*/
var RecClass = class RecClass extends ConstructType {
	constructor() {
		super(...arguments);
		this._id = RecClass._counter++;
	}
	get typeName() {
		return IdlTypeName.RecClass;
	}
	static {
		this._counter = 0;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.RecClass;
	}
	accept(v, d) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return v.visitRec(this, this._type, d);
	}
	fill(t) {
		this._type = t;
	}
	getType() {
		return this._type;
	}
	covariant(x) {
		if (this._type ? this._type.covariant(x) : false) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.encodeValue(x);
	}
	_buildTypeTableImpl(typeTable) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		typeTable.add(this, new Uint8Array([]));
		this._type.buildTypeTable(typeTable);
		typeTable.merge(this, this._type.name);
	}
	decodeValue(b, t) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.decodeValue(b, t);
	}
	get name() {
		return `rec_${this._id}`;
	}
	display() {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return `μ${this.name}.${this._type.name}`;
	}
	valueToString(x) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.valueToString(x);
	}
};
function decodePrincipalId(b) {
	if (safeReadUint8(b) !== 1) throw new Error("Cannot decode principal");
	const len = Number(lebDecode(b));
	return Principal$1.fromUint8Array(new Uint8Array(safeRead(b, len)));
}
/**
* Represents an IDL principal reference
*/
var PrincipalClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.PrincipalClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.PrincipalClass;
	}
	accept(v, d) {
		return v.visitPrincipal(this, d);
	}
	covariant(x) {
		if (x && x._isPrincipal) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = x.toUint8Array();
		const len = lebEncode(buf.byteLength);
		return concat(new Uint8Array([1]), len, buf);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Principal);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return decodePrincipalId(b);
	}
	get name() {
		return "principal";
	}
	valueToString(x) {
		return `${this.name} "${x.toText()}"`;
	}
};
/**
* Represents an IDL function reference.
* @param argTypes Argument types.
* @param retTypes Return types.
* @param annotations Function annotations.
*/
var FuncClass = class extends ConstructType {
	get typeName() {
		return IdlTypeName.FuncClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FuncClass;
	}
	static argsToString(types, v) {
		if (types.length !== v.length) throw new Error("arity mismatch");
		return "(" + types.map((t, i) => t.valueToString(v[i])).join(", ") + ")";
	}
	constructor(argTypes, retTypes, annotations = []) {
		super();
		this.argTypes = argTypes;
		this.retTypes = retTypes;
		this.annotations = annotations;
	}
	accept(v, d) {
		return v.visitFunc(this, d);
	}
	covariant(x) {
		if (Array.isArray(x) && x.length === 2 && x[0] && x[0]._isPrincipal && typeof x[1] === "string") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue([principal, methodName]) {
		const buf = principal.toUint8Array();
		const len = lebEncode(buf.byteLength);
		const canister = concat(new Uint8Array([1]), len, buf);
		const method = new TextEncoder().encode(methodName);
		const methodLen = lebEncode(method.byteLength);
		return concat(new Uint8Array([1]), canister, methodLen, method);
	}
	_buildTypeTableImpl(T) {
		this.argTypes.forEach((arg) => arg.buildTypeTable(T));
		this.retTypes.forEach((arg) => arg.buildTypeTable(T));
		const opCode = slebEncode(IDLTypeIds.Func);
		const argLen = lebEncode(this.argTypes.length);
		const args = concat(...this.argTypes.map((arg) => arg.encodeType(T)));
		const retLen = lebEncode(this.retTypes.length);
		const rets = concat(...this.retTypes.map((arg) => arg.encodeType(T)));
		const annLen = lebEncode(this.annotations.length);
		const anns = concat(...this.annotations.map((a) => this.encodeAnnotation(a)));
		T.add(this, concat(opCode, argLen, args, retLen, rets, annLen, anns));
	}
	decodeValue(b, t) {
		const tt = t instanceof RecClass ? t.getType() ?? t : t;
		if (!subtype(tt, this)) throw new Error(`Cannot decode function reference at type ${this.display()} from wire type ${tt.display()}`);
		if (safeReadUint8(b) !== 1) throw new Error("Cannot decode function reference");
		const canister = decodePrincipalId(b);
		const buf = safeRead(b, Number(lebDecode(b)));
		return [canister, new TextDecoder("utf8", { fatal: true }).decode(buf)];
	}
	get name() {
		return `(${this.argTypes.map((arg) => arg.name).join(", ")}) -> (${this.retTypes.map((arg) => arg.name).join(", ")})${" " + this.annotations.join(" ")}`;
	}
	valueToString([principal, str]) {
		return `func "${principal.toText()}".${str}`;
	}
	display() {
		return `(${this.argTypes.map((arg) => arg.display()).join(", ")}) → (${this.retTypes.map((arg) => arg.display()).join(", ")})${" " + this.annotations.join(" ")}`;
	}
	encodeAnnotation(ann) {
		if (ann === "query") return new Uint8Array([1]);
		else if (ann === "oneway") return new Uint8Array([2]);
		else if (ann === "composite_query") return new Uint8Array([3]);
		else throw new Error("Illegal function annotation");
	}
};
var ServiceClass = class extends ConstructType {
	get typeName() {
		return IdlTypeName.ServiceClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.ServiceClass;
	}
	constructor(fields) {
		super();
		this._fields = Object.entries(fields).sort((a, b) => {
			if (a[0] < b[0]) return -1;
			if (a[0] > b[0]) return 1;
			return 0;
		});
	}
	accept(v, d) {
		return v.visitService(this, d);
	}
	covariant(x) {
		if (x && x._isPrincipal) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = x.toUint8Array();
		const len = lebEncode(buf.length);
		return concat(new Uint8Array([1]), len, buf);
	}
	_buildTypeTableImpl(T) {
		this._fields.forEach(([_, func]) => func.buildTypeTable(T));
		const opCode = slebEncode(IDLTypeIds.Service);
		const len = lebEncode(this._fields.length);
		const meths = this._fields.map(([label, func]) => {
			const labelBuf = new TextEncoder().encode(label);
			return concat(lebEncode(labelBuf.length), labelBuf, func.encodeType(T));
		});
		T.add(this, concat(opCode, len, ...meths));
	}
	decodeValue(b, t) {
		const tt = t instanceof RecClass ? t.getType() ?? t : t;
		if (!subtype(tt, this)) throw new Error(`Cannot decode service reference at type ${this.display()} from wire type ${tt.display()}`);
		return decodePrincipalId(b);
	}
	get name() {
		return `service {${this._fields.map(([key, value]) => key + ":" + value.name).join("; ")}}`;
	}
	valueToString(x) {
		return `service "${x.toText()}"`;
	}
	fieldsAsObject() {
		const fields = {};
		for (const [name, ty] of this._fields) fields[name] = ty;
		return fields;
	}
};
/**
* Takes an unknown value and returns a string representation of it.
* @param x - unknown value
* @returns {string} string representation of the value
*/
function toReadableString(x) {
	const str = JSON.stringify(x, (_key, value) => typeof value === "bigint" ? `BigInt(${value})` : value);
	return str && str.length > toReadableString_max ? str.substring(0, 397) + "..." : str;
}
/**
* Encode a array of values
* @param argTypes - array of Types
* @param args - array of values
* @returns {Uint8Array} serialised value
*/
function encode$1(argTypes, args) {
	if (args.length < argTypes.length) throw Error("Wrong number of message arguments");
	const typeTable = new TypeTable();
	argTypes.forEach((t) => t.buildTypeTable(typeTable));
	return concat(new TextEncoder().encode(magicNumber), typeTable.encode(), lebEncode(args.length), concat(...argTypes.map((t) => t.encodeType(typeTable))), concat(...zipWith(argTypes, args, (t, x) => {
		try {
			t.covariant(x);
		} catch (e) {
			throw /* @__PURE__ */ new Error(e.message + "\n\n");
		}
		return t.encodeValue(x);
	})));
}
/**
* Decode a binary value
* @param retTypes - Types expected in the buffer.
* @param bytes - hex-encoded string, or buffer.
* @returns Value deserialised to JS type
*/
function decode$1(retTypes, bytes) {
	const b = new PipeArrayBuffer(bytes);
	if (bytes.byteLength < 4) throw new Error("Message length smaller than magic number");
	const magicBuffer = safeRead(b, 4);
	const magic = new TextDecoder().decode(magicBuffer);
	if (magic !== magicNumber) throw new Error("Wrong magic number: " + JSON.stringify(magic));
	function readTypeTable(pipe) {
		const typeTable = [];
		const len = Number(lebDecode(pipe));
		for (let i = 0; i < len; i++) {
			const ty = Number(slebDecode(pipe));
			switch (ty) {
				case IDLTypeIds.Opt:
				case IDLTypeIds.Vector: {
					const t = Number(slebDecode(pipe));
					typeTable.push([ty, t]);
					break;
				}
				case IDLTypeIds.Record:
				case IDLTypeIds.Variant: {
					const fields = [];
					let objectLength = Number(lebDecode(pipe));
					let prevHash;
					while (objectLength--) {
						const hash = Number(lebDecode(pipe));
						if (hash >= Math.pow(2, 32)) throw new Error("field id out of 32-bit range");
						if (typeof prevHash === "number" && prevHash >= hash) throw new Error("field id collision or not sorted");
						prevHash = hash;
						const t = Number(slebDecode(pipe));
						fields.push([hash, t]);
					}
					typeTable.push([ty, fields]);
					break;
				}
				case IDLTypeIds.Func: {
					const args = [];
					let argLength = Number(lebDecode(pipe));
					while (argLength--) args.push(Number(slebDecode(pipe)));
					const returnValues = [];
					let returnValuesLength = Number(lebDecode(pipe));
					while (returnValuesLength--) returnValues.push(Number(slebDecode(pipe)));
					const annotations = [];
					let annotationLength = Number(lebDecode(pipe));
					while (annotationLength--) switch (Number(lebDecode(pipe))) {
						case 1:
							annotations.push("query");
							break;
						case 2:
							annotations.push("oneway");
							break;
						case 3:
							annotations.push("composite_query");
							break;
						default: throw new Error("unknown annotation");
					}
					typeTable.push([ty, [
						args,
						returnValues,
						annotations
					]]);
					break;
				}
				case IDLTypeIds.Service: {
					let servLength = Number(lebDecode(pipe));
					const methods = [];
					while (servLength--) {
						const nameLength = Number(lebDecode(pipe));
						const funcName = new TextDecoder().decode(safeRead(pipe, nameLength));
						const funcType = slebDecode(pipe);
						methods.push([funcName, funcType]);
					}
					typeTable.push([ty, methods]);
					break;
				}
				default: throw new Error("Illegal op_code: " + ty);
			}
		}
		const rawList = [];
		const length = Number(lebDecode(pipe));
		for (let i = 0; i < length; i++) rawList.push(Number(slebDecode(pipe)));
		return [typeTable, rawList];
	}
	const [rawTable, rawTypes] = readTypeTable(b);
	if (rawTypes.length < retTypes.length) throw new Error("Wrong number of return values");
	const table = rawTable.map((_) => Rec());
	function getType(t) {
		if (t < -24) throw new Error("future value not supported");
		if (t < 0) switch (t) {
			case -1: return Null;
			case -2: return Bool;
			case -3: return Nat;
			case -4: return Int;
			case -5: return Nat8;
			case -6: return Nat16;
			case -7: return Nat32;
			case -8: return Nat64;
			case -9: return Int8;
			case -10: return Int16;
			case -11: return Int32;
			case -12: return Int64;
			case -13: return Float32;
			case -14: return Float64;
			case -15: return Text;
			case -16: return Reserved;
			case -17: return Empty;
			case -24: return Principal;
			default: throw new Error("Illegal op_code: " + t);
		}
		if (t >= rawTable.length) throw new Error("type index out of range");
		return table[t];
	}
	function buildType(entry) {
		switch (entry[0]) {
			case IDLTypeIds.Vector: return Vec(getType(entry[1]));
			case IDLTypeIds.Opt: return Opt(getType(entry[1]));
			case IDLTypeIds.Record: {
				const fields = {};
				for (const [hash, ty] of entry[1]) {
					const name = `_${hash}_`;
					fields[name] = getType(ty);
				}
				const record = Record(fields);
				const tuple = record.tryAsTuple();
				if (Array.isArray(tuple)) return Tuple(...tuple);
				else return record;
			}
			case IDLTypeIds.Variant: {
				const fields = {};
				for (const [hash, ty] of entry[1]) {
					const name = `_${hash}_`;
					fields[name] = getType(ty);
				}
				return Variant(fields);
			}
			case IDLTypeIds.Func: {
				const [args, returnValues, annotations] = entry[1];
				return Func(args.map((t) => getType(t)), returnValues.map((t) => getType(t)), annotations);
			}
			case IDLTypeIds.Service: {
				const rec = {};
				const methods = entry[1];
				for (const [name, typeRef] of methods) {
					let type = getType(typeRef);
					if (type instanceof RecClass) type = type.getType();
					if (!(type instanceof FuncClass)) throw new Error("Illegal service definition: services can only contain functions");
					rec[name] = type;
				}
				return Service(rec);
			}
			default: throw new Error("Illegal op_code: " + entry[0]);
		}
	}
	rawTable.forEach((entry, i) => {
		if (entry[0] === IDLTypeIds.Func) {
			const t = buildType(entry);
			table[i].fill(t);
		}
	});
	rawTable.forEach((entry, i) => {
		if (entry[0] !== IDLTypeIds.Func) {
			const t = buildType(entry);
			table[i].fill(t);
		}
	});
	resetSubtypeCache();
	const types = rawTypes.map((t) => getType(t));
	try {
		const output = retTypes.map((t, i) => {
			return t.decodeValue(b, types[i]);
		});
		for (let ind = retTypes.length; ind < types.length; ind++) types[ind].decodeValue(b, types[ind]);
		if (b.byteLength > 0) throw new Error("decode: Left-over bytes");
		return output;
	} finally {
		resetSubtypeCache();
	}
}
var Empty = new EmptyClass();
var Reserved = new ReservedClass();
/**
* Client-only type for deserializing unknown data. Not supported by Candid, and its use is discouraged.
*/
var Unknown = new UnknownClass();
var Bool = new BoolClass();
var Null = new NullClass();
var Text = new TextClass();
var Int = new IntClass();
var Nat = new NatClass();
var Float32 = new FloatClass(32);
var Float64 = new FloatClass(64);
var Int8 = new FixedIntClass(8);
var Int16 = new FixedIntClass(16);
var Int32 = new FixedIntClass(32);
var Int64 = new FixedIntClass(64);
var Nat8 = new FixedNatClass(8);
var Nat16 = new FixedNatClass(16);
var Nat32 = new FixedNatClass(32);
var Nat64 = new FixedNatClass(64);
var Principal = new PrincipalClass();
/**
*
* @param types array of any types
* @returns TupleClass from those types
*/
function Tuple(...types) {
	return new TupleClass(types);
}
/**
*
* @param t IDL Type
* @returns VecClass from that type
*/
function Vec(t) {
	return new VecClass(t);
}
/**
*
* @param t IDL Type
* @returns OptClass of Type
*/
function Opt(t) {
	return new OptClass(t);
}
/**
*
* @param t Record of string and IDL Type
* @returns RecordClass of string and Type
*/
function Record(t) {
	return new RecordClass(t);
}
/**
*
* @param fields Record of string and IDL Type
* @returns VariantClass
*/
function Variant(fields) {
	return new VariantClass(fields);
}
/**
*
* @returns new RecClass
*/
function Rec() {
	return new RecClass();
}
/**
*
* @param args array of IDL Types
* @param ret array of IDL Types
* @param annotations array of strings, [] by default
* @returns new FuncClass
*/
function Func(args, ret, annotations = []) {
	return new FuncClass(args, ret, annotations);
}
/**
*
* @param t Record of string and FuncClass
* @returns ServiceClass
*/
function Service(t) {
	return new ServiceClass(t);
}
/**
* The list of relations between types we assume to hold. Uses the types .name property as key
*/
var Relations = class Relations {
	constructor(relations = /* @__PURE__ */ new Map()) {
		this.rels = relations;
	}
	copy() {
		const copy = /* @__PURE__ */ new Map();
		for (const [key, value] of this.rels.entries()) {
			const valCopy = new Map(value);
			copy.set(key, valCopy);
		}
		return new Relations(copy);
	}
	known(t1, t2) {
		return this.rels.get(t1.name)?.get(t2.name);
	}
	addNegative(t1, t2) {
		this.addNames(t1.name, t2.name, false);
	}
	add(t1, t2) {
		this.addNames(t1.name, t2.name, true);
	}
	display() {
		let result = "";
		for (const [t1, v] of this.rels) for (const [t2, known] of v) result += `${t1} ${known ? ":<" : "!<:"} ${t2}\n`;
		return result;
	}
	addNames(t1, t2, isSubtype) {
		const t1Map = this.rels.get(t1);
		if (t1Map == void 0) {
			const newMap = /* @__PURE__ */ new Map();
			newMap.set(t2, isSubtype);
			this.rels.set(t1, newMap);
		} else t1Map.set(t2, isSubtype);
	}
};
var subtypeCache = new Relations();
/** Resets the global subtyping cache */
function resetSubtypeCache() {
	subtypeCache = new Relations();
}
function eqFunctionAnnotations(t1, t2) {
	const t1Annotations = new Set(t1.annotations);
	const t2Annotations = new Set(t2.annotations);
	if (t1Annotations.size !== t2Annotations.size) return false;
	for (const a of t1Annotations) if (!t2Annotations.has(a)) return false;
	return true;
}
function canBeOmmitted(t) {
	return t instanceof OptClass || t instanceof NullClass || t instanceof ReservedClass;
}
/**
* Subtyping on Candid types t1 <: t2 (Exported for testing)
* @param t1 The potential subtype
* @param t2 The potential supertype
*/
function subtype(t1, t2) {
	const isSubtype = subtype_(subtypeCache.copy(), t1, t2);
	if (isSubtype) subtypeCache.add(t1, t2);
	else subtypeCache.addNegative(t1, t2);
	return isSubtype;
}
function subtype_(relations, t1, t2) {
	if (t1.name === t2.name) return true;
	const known = relations.known(t1, t2);
	if (known !== void 0) return known;
	relations.add(t1, t2);
	if (t2 instanceof ReservedClass) return true;
	if (t1 instanceof EmptyClass) return true;
	if (t1 instanceof NatClass && t2 instanceof IntClass) return true;
	if (t1 instanceof VecClass && t2 instanceof VecClass) return subtype_(relations, t1._type, t2._type);
	if (t2 instanceof OptClass) return true;
	if (t1 instanceof RecordClass && t2 instanceof RecordClass) {
		const t1Object = t1.fieldsAsObject;
		for (const [label, ty2] of t2._fields) {
			const ty1 = t1Object[idlLabelToId(label)];
			if (!ty1) {
				if (!canBeOmmitted(ty2)) return false;
			} else if (!subtype_(relations, ty1, ty2)) return false;
		}
		return true;
	}
	if (t1 instanceof FuncClass && t2 instanceof FuncClass) {
		if (!eqFunctionAnnotations(t1, t2)) return false;
		for (let i = 0; i < t1.argTypes.length; i++) {
			const argTy1 = t1.argTypes[i];
			if (i < t2.argTypes.length) {
				if (!subtype_(relations, t2.argTypes[i], argTy1)) return false;
			} else if (!canBeOmmitted(argTy1)) return false;
		}
		for (let i = 0; i < t2.retTypes.length; i++) {
			const retTy2 = t2.retTypes[i];
			if (i < t1.retTypes.length) {
				if (!subtype_(relations, t1.retTypes[i], retTy2)) return false;
			} else if (!canBeOmmitted(retTy2)) return false;
		}
		return true;
	}
	if (t1 instanceof VariantClass && t2 instanceof VariantClass) {
		const t2Object = t2.alternativesAsObject;
		for (const [label, ty1] of t1._fields) {
			const ty2 = t2Object[idlLabelToId(label)];
			if (!ty2) return false;
			if (!subtype_(relations, ty1, ty2)) return false;
		}
		return true;
	}
	if (t1 instanceof ServiceClass && t2 instanceof ServiceClass) {
		const t1Object = t1.fieldsAsObject();
		for (const [name, ty2] of t2._fields) {
			const ty1 = t1Object[name];
			if (!ty1) return false;
			if (!subtype_(relations, ty1, ty2)) return false;
		}
		return true;
	}
	if (t1 instanceof RecClass) return subtype_(relations, t1.getType(), t2);
	if (t2 instanceof RecClass) return subtype_(relations, t1, t2.getType());
	return false;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+candid@3.3.1_@dfinity+principal@3.3.1/node_modules/@dfinity/candid/lib/esm/candid-core.js
var InputBox = class {
	constructor(idl, ui) {
		this.idl = idl;
		this.ui = ui;
		this.label = null;
		this.value = void 0;
		const status = document.createElement("span");
		status.className = "status";
		this.status = status;
		if (ui.input) {
			ui.input.addEventListener("blur", () => {
				if (ui.input.value === "") return;
				this.parse();
			});
			ui.input.addEventListener("input", () => {
				status.style.display = "none";
				ui.input.classList.remove("reject");
			});
		}
	}
	isRejected() {
		return this.value === void 0;
	}
	parse(config = {}) {
		if (this.ui.form) {
			const value = this.ui.form.parse(config);
			this.value = value;
			return value;
		}
		if (this.ui.input) {
			const input = this.ui.input;
			try {
				const value = this.ui.parse(this.idl, config, input.value);
				if (!this.idl.covariant(value)) throw new Error(`${input.value} is not of type ${this.idl.display()}`);
				this.status.style.display = "none";
				this.value = value;
				return value;
			} catch (err) {
				input.classList.add("reject");
				this.status.style.display = "block";
				this.status.innerHTML = "InputError: " + err.message;
				this.value = void 0;
				return;
			}
		}
		return null;
	}
	render(dom) {
		const container = document.createElement("span");
		if (this.label) {
			const label = document.createElement("label");
			label.innerText = this.label;
			container.appendChild(label);
		}
		if (this.ui.input) {
			container.appendChild(this.ui.input);
			container.appendChild(this.status);
		}
		if (this.ui.form) this.ui.form.render(container);
		dom.appendChild(container);
	}
};
var InputForm = class {
	constructor(ui) {
		this.ui = ui;
		this.form = [];
	}
	renderForm(dom) {
		if (this.ui.container) {
			this.form.forEach((e) => e.render(this.ui.container));
			dom.appendChild(this.ui.container);
		} else this.form.forEach((e) => e.render(dom));
	}
	render(dom) {
		if (this.ui.open && this.ui.event) {
			dom.appendChild(this.ui.open);
			const form = this;
			form.ui.open.addEventListener(form.ui.event, () => {
				if (form.ui.container) form.ui.container.innerHTML = "";
				else {
					const oldContainer = form.ui.open.nextElementSibling;
					if (oldContainer) oldContainer.parentNode.removeChild(oldContainer);
				}
				form.generateForm();
				form.renderForm(dom);
			});
		} else {
			this.generateForm();
			this.renderForm(dom);
		}
	}
};
var RecordForm = class extends InputForm {
	constructor(fields, ui) {
		super(ui);
		this.fields = fields;
		this.ui = ui;
	}
	generateForm() {
		this.form = this.fields.map(([key, type]) => {
			const input = this.ui.render(type);
			if (this.ui.labelMap && this.ui.labelMap.hasOwnProperty(key)) input.label = this.ui.labelMap[key] + " ";
			else input.label = key + " ";
			return input;
		});
	}
	parse(config) {
		const v = {};
		this.fields.forEach(([key, _], i) => {
			const value = this.form[i].parse(config);
			v[key] = value;
		});
		if (this.form.some((input) => input.isRejected())) return;
		return v;
	}
};
var TupleForm = class extends InputForm {
	constructor(components, ui) {
		super(ui);
		this.components = components;
		this.ui = ui;
	}
	generateForm() {
		this.form = this.components.map((type) => {
			return this.ui.render(type);
		});
	}
	parse(config) {
		const v = [];
		this.components.forEach((_, i) => {
			const value = this.form[i].parse(config);
			v.push(value);
		});
		if (this.form.some((input) => input.isRejected())) return;
		return v;
	}
};
var VariantForm = class extends InputForm {
	constructor(fields, ui) {
		super(ui);
		this.fields = fields;
		this.ui = ui;
	}
	generateForm() {
		const index = this.ui.open.selectedIndex;
		const [_, type] = this.fields[index];
		const variant = this.ui.render(type);
		this.form = [variant];
	}
	parse(config) {
		const select = this.ui.open;
		const selected = select.options[select.selectedIndex].value;
		const value = this.form[0].parse(config);
		if (value === void 0) return;
		const v = {};
		v[selected] = value;
		return v;
	}
};
var OptionForm = class extends InputForm {
	constructor(ty, ui) {
		super(ui);
		this.ty = ty;
		this.ui = ui;
	}
	generateForm() {
		if (this.ui.open.checked) {
			const opt = this.ui.render(this.ty);
			this.form = [opt];
		} else this.form = [];
	}
	parse(config) {
		if (this.form.length === 0) return [];
		else {
			const value = this.form[0].parse(config);
			if (value === void 0) return;
			return [value];
		}
	}
};
var VecForm = class extends InputForm {
	constructor(ty, ui) {
		super(ui);
		this.ty = ty;
		this.ui = ui;
	}
	generateForm() {
		const len = +this.ui.open.value;
		this.form = [];
		for (let i = 0; i < len; i++) {
			const t = this.ui.render(this.ty);
			this.form.push(t);
		}
	}
	parse(config) {
		const value = this.form.map((input) => {
			return input.parse(config);
		});
		if (this.form.some((input) => input.isRejected())) return;
		return value;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+candid@3.3.1_@dfinity+principal@3.3.1/node_modules/@dfinity/candid/lib/esm/candid-ui.js
var InputConfig = { parse: parsePrimitive };
var FormConfig = { render: renderInput };
var inputBox = (t, config) => {
	return new InputBox(t, {
		...InputConfig,
		...config
	});
};
var recordForm = (fields, config) => {
	return new RecordForm(fields, {
		...FormConfig,
		...config
	});
};
var tupleForm = (components, config) => {
	return new TupleForm(components, {
		...FormConfig,
		...config
	});
};
var variantForm = (fields, config) => {
	return new VariantForm(fields, {
		...FormConfig,
		...config
	});
};
var optForm = (ty, config) => {
	return new OptionForm(ty, {
		...FormConfig,
		...config
	});
};
var vecForm = (ty, config) => {
	return new VecForm(ty, {
		...FormConfig,
		...config
	});
};
var Render = class extends Visitor {
	visitType(t, _d) {
		const input = document.createElement("input");
		input.classList.add("argument");
		input.placeholder = t.display();
		return inputBox(t, { input });
	}
	visitNull(t, _d) {
		return inputBox(t, {});
	}
	visitRecord(t, fields, _d) {
		let config = {};
		if (fields.length > 1) {
			const container = document.createElement("div");
			container.classList.add("popup-form");
			config = { container };
		}
		return inputBox(t, { form: recordForm(fields, config) });
	}
	visitTuple(t, components, _d) {
		let config = {};
		if (components.length > 1) {
			const container = document.createElement("div");
			container.classList.add("popup-form");
			config = { container };
		}
		return inputBox(t, { form: tupleForm(components, config) });
	}
	visitVariant(t, fields, _d) {
		const select = document.createElement("select");
		for (const [key, _type] of fields) {
			const option = new Option(key);
			select.add(option);
		}
		select.selectedIndex = -1;
		select.classList.add("open");
		return inputBox(t, { form: variantForm(fields, {
			open: select,
			event: "change"
		}) });
	}
	visitOpt(t, ty, _d) {
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.classList.add("open");
		return inputBox(t, { form: optForm(ty, {
			open: checkbox,
			event: "change"
		}) });
	}
	visitVec(t, ty, _d) {
		const len = document.createElement("input");
		len.type = "number";
		len.min = "0";
		len.max = "100";
		len.style.width = "8rem";
		len.placeholder = "len";
		len.classList.add("open");
		const container = document.createElement("div");
		container.classList.add("popup-form");
		return inputBox(t, { form: vecForm(ty, {
			open: len,
			event: "change",
			container
		}) });
	}
	visitRec(_t, ty, _d) {
		return renderInput(ty);
	}
};
var Parse = class extends Visitor {
	visitNull(_t, _v) {
		return null;
	}
	visitBool(_t, v) {
		if (v === "true") return true;
		if (v === "false") return false;
		throw new Error(`Cannot parse ${v} as boolean`);
	}
	visitText(_t, v) {
		return v;
	}
	visitFloat(_t, v) {
		return parseFloat(v);
	}
	visitFixedInt(t, v) {
		if (t._bits <= 32) return parseInt(v, 10);
		else return BigInt(v);
	}
	visitFixedNat(t, v) {
		if (t._bits <= 32) return parseInt(v, 10);
		else return BigInt(v);
	}
	visitNumber(_t, v) {
		return BigInt(v);
	}
	visitPrincipal(_t, v) {
		return Principal$1.fromText(v);
	}
	visitService(_t, v) {
		return Principal$1.fromText(v);
	}
	visitFunc(_t, v) {
		const x = v.split(".", 2);
		return [Principal$1.fromText(x[0]), x[1]];
	}
};
var Random = class extends Visitor {
	visitNull(_t, _v) {
		return null;
	}
	visitBool(_t, _v) {
		return Math.random() < .5;
	}
	visitText(_t, _v) {
		return Math.random().toString(36).substring(6);
	}
	visitFloat(_t, _v) {
		return Math.random();
	}
	visitInt(_t, _v) {
		return BigInt(this.generateNumber(true));
	}
	visitNat(_t, _v) {
		return BigInt(this.generateNumber(false));
	}
	visitFixedInt(t, v) {
		const x = this.generateNumber(true);
		if (t._bits <= 32) return x;
		else return BigInt(v);
	}
	visitFixedNat(t, v) {
		const x = this.generateNumber(false);
		if (t._bits <= 32) return x;
		else return BigInt(v);
	}
	generateNumber(signed) {
		const num = Math.floor(Math.random() * 100);
		if (signed && Math.random() < .5) return -num;
		else return num;
	}
};
function parsePrimitive(t, config, d) {
	if (config.random && d === "") return t.accept(new Random(), d);
	else return t.accept(new Parse(), d);
}
/**
*
* @param t an IDL type
* @returns an input for that type
*/
function renderInput(t) {
	return t.accept(new Render(), null);
}
/**
*
* @param t an IDL Type
* @param input an InputBox
* @param value any
* @returns rendering that value to the provided input
*/
function renderValue(t, input, value) {
	return t.accept(new RenderValue(), {
		input,
		value
	});
}
var RenderValue = class extends Visitor {
	visitType(t, d) {
		d.input.ui.input.value = t.valueToString(d.value);
	}
	visitNull(_t, _d) {}
	visitText(_t, d) {
		d.input.ui.input.value = d.value;
	}
	visitRec(_t, ty, d) {
		renderValue(ty, d.input, d.value);
	}
	visitOpt(_t, ty, d) {
		if (d.value.length === 0) return;
		else {
			const form = d.input.ui.form;
			const open = form.ui.open;
			open.checked = true;
			open.dispatchEvent(new Event(form.ui.event));
			renderValue(ty, form.form[0], d.value[0]);
		}
	}
	visitRecord(_t, fields, d) {
		const form = d.input.ui.form;
		fields.forEach(([key, type], i) => {
			renderValue(type, form.form[i], d.value[key]);
		});
	}
	visitTuple(_t, components, d) {
		const form = d.input.ui.form;
		components.forEach((type, i) => {
			renderValue(type, form.form[i], d.value[i]);
		});
	}
	visitVariant(_t, fields, d) {
		const form = d.input.ui.form;
		const selected = Object.entries(d.value)[0];
		fields.forEach(([key, type], i) => {
			if (key === selected[0]) {
				const open = form.ui.open;
				open.selectedIndex = i;
				open.dispatchEvent(new Event(form.ui.event));
				renderValue(type, form.form[0], selected[1]);
			}
		});
	}
	visitVec(_t, ty, d) {
		const form = d.input.ui.form;
		const len = d.value.length;
		const open = form.ui.open;
		open.value = len;
		open.dispatchEvent(new Event(form.ui.event));
		d.value.forEach((v, i) => {
			renderValue(ty, form.form[i], v);
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/utils/buffer.js
/**
* Returns a true Uint8Array from an ArrayBufferLike object.
* @param bufLike a buffer-like object
* @returns Uint8Array
*/
function uint8FromBufLike(bufLike) {
	if (!bufLike) throw new Error("Input cannot be null or undefined");
	if (bufLike instanceof Uint8Array) return bufLike;
	if (bufLike instanceof ArrayBuffer) return new Uint8Array(bufLike);
	if (Array.isArray(bufLike)) return new Uint8Array(bufLike);
	if ("buffer" in bufLike) return uint8FromBufLike(bufLike.buffer);
	return new Uint8Array(bufLike);
}
/**
* Compares two Uint8Arrays for equality.
* @param a The first Uint8Array.
* @param b The second Uint8Array.
* @returns True if the Uint8Arrays are equal, false otherwise.
*/
function uint8Equals(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/request_id.js
/**
*
* @param value unknown value
* @returns Uint8Array
*/
function hashValue(value) {
	if (typeof value === "string") return hashString(value);
	else if (typeof value === "number") return sha256(lebEncode(value));
	else if (value instanceof Uint8Array || ArrayBuffer.isView(value)) return sha256(uint8FromBufLike(value));
	else if (Array.isArray(value)) return sha256(concatBytes(...value.map(hashValue)));
	else if (value && typeof value === "object" && value._isPrincipal) return sha256(value.toUint8Array());
	else if (typeof value === "object" && value !== null && typeof value.toHash === "function") return hashValue(value.toHash());
	else if (typeof value === "object") return hashOfMap(value);
	else if (typeof value === "bigint") return sha256(lebEncode(value));
	throw InputError.fromCode(new HashValueErrorCode(value));
}
var hashString = (value) => {
	return sha256(new TextEncoder().encode(value));
};
/**
* Get the RequestId of the provided ic-ref request.
* RequestId is the result of the representation-independent-hash function.
* https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
* @param request - ic-ref request to hash into RequestId
*/
function requestIdOf(request) {
	return hashOfMap(request);
}
/**
* Hash a map into a Uint8Array using the representation-independent-hash function.
* https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
* @param map - Any non-nested object
* @returns Uint8Array
*/
function hashOfMap(map) {
	return sha256(concatBytes(...Object.entries(map).filter(([, value]) => value !== void 0).map(([key, value]) => {
		return [hashString(key), hashValue(value)];
	}).sort(([k1], [k2]) => {
		return compare(k1, k2);
	}).map((x) => concatBytes(...x))));
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/constants.js
/**
* The `\x0Aic-request` domain separator used in the signature of IC requests.
*/
var IC_REQUEST_DOMAIN_SEPARATOR = new TextEncoder().encode("\nic-request");
/**
* The `\x0Bic-response` domain separator used in the signature of IC responses.
*/
var IC_RESPONSE_DOMAIN_SEPARATOR = new TextEncoder().encode("\vic-response");
/**
* The `\x1Aic-request-auth-delegation` domain separator used in the signature of delegations.
*/
var IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR = new TextEncoder().encode("ic-request-auth-delegation");
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/auth.js
/**
* An Identity that can sign blobs.
*/
var SignIdentity = class {
	/**
	* Get the principal represented by this identity. Normally should be a
	* `Principal.selfAuthenticating()`.
	*/
	getPrincipal() {
		if (!this._principal) this._principal = Principal$1.selfAuthenticating(new Uint8Array(this.getPublicKey().toDer()));
		return this._principal;
	}
	/**
	* Transform a request into a signed version of the request. This is done last
	* after the transforms on the body of a request. The returned object can be
	* anything, but must be serializable to CBOR.
	* @param request - internet computer request to transform
	*/
	async transformRequest(request) {
		const { body, ...fields } = request;
		const requestId = requestIdOf(body);
		return {
			...fields,
			body: {
				content: body,
				sender_pubkey: this.getPublicKey().toDer(),
				sender_sig: await this.sign(concatBytes(IC_REQUEST_DOMAIN_SEPARATOR, requestId))
			}
		};
	}
};
var AnonymousIdentity = class {
	getPrincipal() {
		return Principal$1.anonymous();
	}
	async transformRequest(request) {
		return {
			...request,
			body: { content: request.body }
		};
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+cbor@0.2.2/node_modules/@dfinity/cbor/dist/cbor.mjs
var w = class extends Error {
	constructor(n) {
		super(n), this.name = "DecodingError";
	}
};
var m = 55799;
var L = Symbol("CBOR_STOP_CODE");
var g = /* @__PURE__ */ ((t) => (t[t.False = 20] = "False", t[t.True = 21] = "True", t[t.Null = 22] = "Null", t[t.Undefined = 23] = "Undefined", t[t.Break = 31] = "Break", t))(g || {});
var c = /* @__PURE__ */ ((t) => (t[t.UnsignedInteger = 0] = "UnsignedInteger", t[t.NegativeInteger = 1] = "NegativeInteger", t[t.ByteString = 2] = "ByteString", t[t.TextString = 3] = "TextString", t[t.Array = 4] = "Array", t[t.Map = 5] = "Map", t[t.Tag = 6] = "Tag", t[t.Simple = 7] = "Simple", t))(c || {});
var z = 23;
var Y = 255;
var G = 65535;
var P = 4294967295;
var H = BigInt("0xffffffffffffffff");
var d = /* @__PURE__ */ ((t) => (t[t.Value = 23] = "Value", t[t.OneByte = 24] = "OneByte", t[t.TwoBytes = 25] = "TwoBytes", t[t.FourBytes = 26] = "FourBytes", t[t.EightBytes = 27] = "EightBytes", t[t.Indefinite = 31] = "Indefinite", t))(d || {});
var h = !1;
function W(t) {
	return t == null;
}
function R(t, n) {
	const e = new Uint8Array(n);
	return e.set(t), e;
}
var K = new TextDecoder();
function Z(t) {
	return (t & 224) >> 5;
}
function q(t) {
	return t & 31;
}
var A = /* @__PURE__ */ new Uint8Array();
var y;
var a = 0;
function ut(t, n) {
	A = t, a = 0;
	const e = B(n);
	return (n == null ? void 0 : n(e)) ?? e;
}
function B(t) {
	const [n, e] = N();
	switch (n) {
		case c.UnsignedInteger: return E(e);
		case c.NegativeInteger: return j(e);
		case c.ByteString: return $(e);
		case c.TextString: return F(e);
		case c.Array: return J(e, t);
		case c.Map: return b(e, t);
		case c.Tag: return M(e, t);
		case c.Simple: return Q(e);
	}
	throw new w(`Unsupported major type: ${n}`);
}
function N() {
	const t = A.at(a);
	if (W(t)) throw new w("Provided CBOR data is empty");
	const n = Z(t), e = q(t);
	return a++, [n, e];
}
function J(t, n) {
	const e = E(t);
	if (e === 1 / 0) {
		const u = [];
		let f = B(n);
		for (; f !== L;) u.push((n == null ? void 0 : n(f)) ?? f), f = B(n);
		return u;
	}
	const i = new Array(e);
	for (let u = 0; u < e; u++) {
		const f = B(n);
		i[u] = (n == null ? void 0 : n(f)) ?? f;
	}
	return i;
}
function Q(t) {
	switch (t) {
		case g.False: return !1;
		case g.True: return !0;
		case g.Null: return null;
		case g.Undefined: return;
		case g.Break: return L;
	}
	throw new w(`Unrecognized simple type: ${t.toString(2)}`);
}
function b(t, n) {
	const e = E(t), i = {};
	if (e === 1 / 0) {
		let [u, f] = N();
		for (; u !== c.Simple && f !== g.Break;) {
			const l = F(f), U = B(n);
			i[l] = (n == null ? void 0 : n(U, l)) ?? U, [u, f] = N();
		}
		return i;
	}
	for (let u = 0; u < e; u++) {
		const [f, l] = N();
		if (f !== c.TextString) throw new w("Map keys must be text strings");
		const U = F(l), D = B(n);
		i[U] = (n == null ? void 0 : n(D, U)) ?? D;
	}
	return i;
}
function E(t) {
	if (t <= d.Value) return t;
	switch (y = new DataView(A.buffer, A.byteOffset + a), t) {
		case d.OneByte: return a++, y.getUint8(0);
		case d.TwoBytes: return a += 2, y.getUint16(0, h);
		case d.FourBytes: return a += 4, y.getUint32(0, h);
		case d.EightBytes: return a += 8, y.getBigUint64(0, h);
		case d.Indefinite: return 1 / 0;
		default: throw new w(`Unsupported integer info: ${t.toString(2)}`);
	}
}
function j(t) {
	const n = E(t);
	return typeof n == "number" ? -1 - n : -1n - n;
}
function $(t) {
	const n = E(t);
	if (n > Number.MAX_SAFE_INTEGER) throw new w("Byte length is too large");
	const e = Number(n);
	return a += e, A.slice(a - e, a);
}
function F(t) {
	const n = $(t);
	return K.decode(n);
}
function M(t, n) {
	const e = E(t);
	if (e === m) return B(n);
	throw new w(`Unsupported tag: ${e}.`);
}
var x = class extends Error {
	constructor(n) {
		super(n), this.name = "SerializationError";
	}
};
var p = 2048;
var C = 100;
var v = new TextEncoder();
function S(t) {
	return t << 5;
}
var o = new Uint8Array(p);
var r = new DataView(o.buffer);
var s = 0;
var O = [];
function dt(t, n) {
	s = 0;
	return it(m, (n == null ? void 0 : n(t)) ?? t, n), o.slice(0, s);
}
function _(t, n) {
	if (s > o.length - C && (o = R(o, o.length * 2), r = new DataView(o.buffer)), t === !1 || t === !0 || t === null || t === void 0) {
		et(t);
		return;
	}
	if (typeof t == "number" || typeof t == "bigint") {
		ft(t);
		return;
	}
	if (typeof t == "string") {
		X(t);
		return;
	}
	if (t instanceof Uint8Array) {
		V(t);
		return;
	}
	if (t instanceof ArrayBuffer) {
		V(new Uint8Array(t));
		return;
	}
	if (Array.isArray(t)) {
		tt(t, n);
		return;
	}
	if (typeof t == "object") {
		nt(t, n);
		return;
	}
	throw new x(`Unsupported type: ${typeof t}`);
}
function tt(t, n) {
	I(c.Array, t.length), t.forEach((e, i) => {
		_((n == null ? void 0 : n(e, i.toString())) ?? e, n);
	});
}
function nt(t, n) {
	O = Object.entries(t), I(c.Map, O.length), O.forEach(([e, i]) => {
		X(e), _((n == null ? void 0 : n(i, e)) ?? i, n);
	});
}
function I(t, n) {
	if (n <= z) {
		r.setUint8(s++, S(t) | Number(n));
		return;
	}
	if (n <= Y) {
		r.setUint8(s++, S(t) | d.OneByte), r.setUint8(s, Number(n)), s += 1;
		return;
	}
	if (n <= G) {
		r.setUint8(s++, S(t) | d.TwoBytes), r.setUint16(s, Number(n), h), s += 2;
		return;
	}
	if (n <= P) {
		r.setUint8(s++, S(t) | d.FourBytes), r.setUint32(s, Number(n), h), s += 4;
		return;
	}
	if (n <= H) {
		r.setUint8(s++, S(t) | d.EightBytes), r.setBigUint64(s, BigInt(n), h), s += 8;
		return;
	}
	throw new x(`Value too large to encode: ${n}`);
}
function et(t) {
	I(c.Simple, st(t));
}
function st(t) {
	if (t === !1) return g.False;
	if (t === !0) return g.True;
	if (t === null) return g.Null;
	if (t === void 0) return g.Undefined;
	throw new x(`Unrecognized simple value: ${t.toString()}`);
}
function k(t, n) {
	I(t, n.length), s > o.length - n.length && (o = R(o, o.length + n.length), r = new DataView(o.buffer)), o.set(n, s), s += n.length;
}
function T(t, n) {
	I(t, n);
}
function ct(t) {
	T(c.UnsignedInteger, t);
}
function ot(t) {
	T(c.NegativeInteger, typeof t == "bigint" ? -1n - t : -1 - t);
}
function ft(t) {
	t >= 0 ? ct(t) : ot(t);
}
function X(t) {
	k(c.TextString, v.encode(t));
}
function V(t) {
	k(c.ByteString, t);
}
function it(t, n, e) {
	I(c.Tag, t), _(n, e);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/cbor.js
function hasCborValueMethod(value) {
	return typeof value === "object" && value !== null && "toCborValue" in value;
}
/**
* Encode a JavaScript value into CBOR. If the value is an instance of {@link ToCborValue},
* the {@link ToCborValue.toCborValue} method will be called to get the value to encode.
* @param value The value to encode
*/
function encode(value) {
	try {
		return dt(value, (value) => {
			if (Principal$1.isPrincipal(value)) return value.toUint8Array();
			if (Expiry.isExpiry(value)) return value.toBigInt();
			if (hasCborValueMethod(value)) return value.toCborValue();
			return value;
		});
	} catch (error) {
		throw InputError.fromCode(new CborEncodeErrorCode(error, value));
	}
}
/**
* Decode a CBOR encoded value into a JavaScript value.
* @param input The CBOR encoded value
*/
function decode(input) {
	try {
		return ut(input);
	} catch (error) {
		throw InputError.fromCode(new CborDecodeErrorCode(error, input));
	}
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/utils/random.js
/**
* Generates a random unsigned 32-bit integer between 0 and 0xffffffff
* @returns {number} a random number
*/
var randomNumber = () => {
	if (typeof window !== "undefined" && !!window.crypto && !!window.crypto.getRandomValues) {
		const array = /* @__PURE__ */ new Uint32Array(1);
		window.crypto.getRandomValues(array);
		return array[0];
	}
	if (typeof crypto !== "undefined" && crypto.getRandomValues) {
		const array = /* @__PURE__ */ new Uint32Array(1);
		crypto.getRandomValues(array);
		return array[0];
	}
	if (typeof crypto !== "undefined" && crypto.randomInt) return crypto.randomInt(0, 4294967295);
	return Math.floor(Math.random() * 4294967295);
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/agent/http/types.js
/**
* @internal
*/
var Endpoint;
(function(Endpoint) {
	Endpoint["Query"] = "read";
	Endpoint["ReadState"] = "read_state";
	Endpoint["Call"] = "call";
})(Endpoint || (Endpoint = {}));
var SubmitRequestType;
(function(SubmitRequestType) {
	SubmitRequestType["Call"] = "call";
})(SubmitRequestType || (SubmitRequestType = {}));
var ReadRequestType;
(function(ReadRequestType) {
	ReadRequestType["Query"] = "query";
	ReadRequestType["ReadState"] = "read_state";
})(ReadRequestType || (ReadRequestType = {}));
/**
* Create a random Nonce, based on random values
*/
function makeNonce() {
	const buffer = /* @__PURE__ */ new ArrayBuffer(16);
	const view = new DataView(buffer);
	const rand1 = randomNumber();
	const rand2 = randomNumber();
	const rand3 = randomNumber();
	const rand4 = randomNumber();
	view.setUint32(0, rand1);
	view.setUint32(4, rand2);
	view.setUint32(8, rand3);
	view.setUint32(12, rand4);
	return Object.assign(new Uint8Array(buffer), { __nonce__: void 0 });
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/agent/http/transforms.js
var JSON_KEY_EXPIRY = "__expiry__";
var SECONDS_TO_MILLISECONDS = BigInt(1e3);
var MILLISECONDS_TO_NANOSECONDS = BigInt(1e6);
var MINUTES_TO_SECONDS = BigInt(60);
var EXPIRY_DELTA_THRESHOLD_MILLISECONDS = BigInt(90) * SECONDS_TO_MILLISECONDS;
function roundMillisToSeconds(millis) {
	return millis / SECONDS_TO_MILLISECONDS;
}
function roundMillisToMinutes(millis) {
	return roundMillisToSeconds(millis) / MINUTES_TO_SECONDS;
}
var Expiry = class Expiry {
	constructor(__expiry__) {
		this.__expiry__ = __expiry__;
		this._isExpiry = true;
	}
	/**
	* Creates an Expiry object from a delta in milliseconds.
	* If the delta is less than 90 seconds, the expiry is rounded down to the nearest second.
	* Otherwise, the expiry is rounded down to the nearest minute.
	* @param deltaInMs The milliseconds to add to the current time.
	* @param clockDriftMs The milliseconds to add to the current time, typically the clock drift between IC network clock and the client's clock. Defaults to `0` if not provided.
	* @returns {Expiry} The constructed Expiry object.
	*/
	static fromDeltaInMilliseconds(deltaInMs, clockDriftMs = 0) {
		const deltaMs = BigInt(deltaInMs);
		const expiryMs = BigInt(Date.now()) + deltaMs + BigInt(clockDriftMs);
		let roundedExpirySeconds;
		if (deltaMs < EXPIRY_DELTA_THRESHOLD_MILLISECONDS) roundedExpirySeconds = roundMillisToSeconds(expiryMs);
		else roundedExpirySeconds = roundMillisToMinutes(expiryMs) * MINUTES_TO_SECONDS;
		return new Expiry(roundedExpirySeconds * SECONDS_TO_MILLISECONDS * MILLISECONDS_TO_NANOSECONDS);
	}
	toBigInt() {
		return this.__expiry__;
	}
	toHash() {
		return lebEncode(this.__expiry__);
	}
	toString() {
		return this.__expiry__.toString();
	}
	/**
	* Serializes to JSON
	* @returns {JsonnableExpiry} a JSON object with a single key, {@link JSON_KEY_EXPIRY}, whose value is the expiry as a string
	*/
	toJSON() {
		return { [JSON_KEY_EXPIRY]: this.toString() };
	}
	/**
	* Deserializes a {@link JsonnableExpiry} object from a JSON string.
	* @param input The JSON string to deserialize.
	* @returns {Expiry} The deserialized Expiry object.
	*/
	static fromJSON(input) {
		const obj = JSON.parse(input);
		if (obj["__expiry__"]) try {
			const expiry = BigInt(obj[JSON_KEY_EXPIRY]);
			return new Expiry(expiry);
		} catch (error) {
			throw new InputError(new ExpiryJsonDeserializeErrorCode(`Not a valid BigInt: ${error}`));
		}
		throw new InputError(new ExpiryJsonDeserializeErrorCode(`The input does not contain the key ${JSON_KEY_EXPIRY}`));
	}
	static isExpiry(other) {
		return other instanceof Expiry || typeof other === "object" && other !== null && "_isExpiry" in other && other["_isExpiry"] === true && "__expiry__" in other && typeof other["__expiry__"] === "bigint";
	}
};
/**
* Create a Nonce transform, which takes a function that returns a Buffer, and adds it
* as the nonce to every call requests.
* @param nonceFn A function that returns a buffer. By default uses a semi-random method.
*/
function makeNonceTransform(nonceFn = makeNonce) {
	return async (request) => {
		const headers = request.request.headers;
		request.request.headers = headers;
		if (request.endpoint === Endpoint.Call) request.body.nonce = nonceFn();
	};
}
/**
* Maps the default fetch headers field to the serializable HttpHeaderField.
* @param headers Fetch definition of the headers type
* @returns array of header fields
*/
function httpHeadersTransform(headers) {
	const headerFields = [];
	headers.forEach((value, key) => {
		headerFields.push([key, value]);
	});
	return headerFields;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/utils.js
/**
* Hex, bytes and number utilities.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$8 = /* @__PURE__ */ BigInt(0);
var _1n$8 = /* @__PURE__ */ BigInt(1);
function _abool2(value, title = "") {
	if (typeof value !== "boolean") {
		const prefix = title && `"${title}"`;
		throw new Error(prefix + "expected boolean, got type=" + typeof value);
	}
	return value;
}
/** Asserts something is Uint8Array. */
function _abytes2(value, length, title = "") {
	const bytes = isBytes(value);
	const len = value?.length;
	const needsLen = length !== void 0;
	if (!bytes || needsLen && len !== length) {
		const prefix = title && `"${title}" `;
		const ofLen = needsLen ? ` of length ${length}` : "";
		const got = bytes ? `length=${len}` : `type=${typeof value}`;
		throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
	}
	return value;
}
function hexToNumber(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	return hex === "" ? _0n$8 : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
	return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
	abytes(bytes);
	return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
	return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
	return numberToBytesBE(n, len).reverse();
}
/**
* Takes hex string or Uint8Array, converts to Uint8Array.
* Validates output length.
* Will throw error for other types.
* @param title descriptive title for an error e.g. 'secret key'
* @param hex hex string or Uint8Array
* @param expectedLength optional, will compare to result array's length
* @returns
*/
function ensureBytes(title, hex, expectedLength) {
	let res;
	if (typeof hex === "string") try {
		res = hexToBytes(hex);
	} catch (e) {
		throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
	}
	else if (isBytes(hex)) res = Uint8Array.from(hex);
	else throw new Error(title + " must be hex string or Uint8Array");
	const len = res.length;
	if (typeof expectedLength === "number" && len !== expectedLength) throw new Error(title + " of length " + expectedLength + " expected, got " + len);
	return res;
}
function equalBytes(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
/**
* Copies Uint8Array. We can't use u8a.slice(), because u8a can be Buffer,
* and Buffer#slice creates mutable copy. Never use Buffers!
*/
function copyBytes(bytes) {
	return Uint8Array.from(bytes);
}
/**
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
/**
* Converts bytes to string using UTF8 encoding.
* @example bytesToUtf8(Uint8Array.from([97, 98, 99])) // 'abc'
*/
var isPosBig = (n) => typeof n === "bigint" && _0n$8 <= n;
function inRange(n, min, max) {
	return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
* Asserts min <= n < max. NOTE: It's < max and not <= max.
* @example
* aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
*/
function aInRange(title, n, min, max) {
	if (!inRange(n, min, max)) throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
/**
* Calculates amount of bits in a bigint.
* Same as `n.toString(2).length`
* TODO: merge with nLength in modular
*/
function bitLen(n) {
	let len = 0;
	for (; n > _0n$8; n >>= _1n$8, len += 1);
	return len;
}
/**
* Gets single bit at position.
* NOTE: first bit position is 0 (same as arrays)
* Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
*/
function bitGet(n, pos) {
	return n >> BigInt(pos) & _1n$8;
}
/**
* Calculate mask for N bits. Not using ** operator with bigints because of old engines.
* Same as BigInt(`0b${Array(i).fill('1').join('')}`)
*/
var bitMask = (n) => (_1n$8 << BigInt(n)) - _1n$8;
function isHash(val) {
	return typeof val === "function" && Number.isSafeInteger(val.outputLen);
}
function _validateObject(object, fields, optFields = {}) {
	if (!object || typeof object !== "object") throw new Error("expected valid options object");
	function checkField(fieldName, expectedType, isOpt) {
		const val = object[fieldName];
		if (isOpt && val === void 0) return;
		const current = typeof val;
		if (current !== expectedType || val === null) throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
	}
	Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
	Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
/**
* throws not implemented error
*/
var notImplemented = () => {
	throw new Error("not implemented");
};
/**
* Memoizes (caches) computation result.
* Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
*/
function memoized(fn) {
	const map = /* @__PURE__ */ new WeakMap();
	return (arg, ...args) => {
		const val = map.get(arg);
		if (val !== void 0) return val;
		const computed = fn(arg, ...args);
		map.set(arg, computed);
		return computed;
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/modular.js
/**
* Utils for modular division and fields.
* Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
* There is no division: it is replaced by modular multiplicative inverse.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$7 = BigInt(0);
var _1n$7 = BigInt(1);
var _2n$6 = /* @__PURE__ */ BigInt(2);
var _3n$4 = /* @__PURE__ */ BigInt(3);
var _4n$2 = /* @__PURE__ */ BigInt(4);
var _5n$1 = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n$2 = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
	const result = a % b;
	return result >= _0n$7 ? result : b + result;
}
/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
function pow2(x, power, modulo) {
	let res = x;
	while (power-- > _0n$7) {
		res *= res;
		res %= modulo;
	}
	return res;
}
/**
* Inverses number over modulo.
* Implemented using [Euclidean GCD](https://brilliant.org/wiki/extended-euclidean-algorithm/).
*/
function invert(number, modulo) {
	if (number === _0n$7) throw new Error("invert: expected non-zero number");
	if (modulo <= _0n$7) throw new Error("invert: expected positive modulus, got " + modulo);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$7, y = _1n$7, u = _1n$7, v = _0n$7;
	while (a !== _0n$7) {
		const q = b / a;
		const r = b % a;
		const m = x - u * q;
		const n = y - v * q;
		b = a, a = r, x = u, y = v, u = m, v = n;
	}
	if (b !== _1n$7) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
	if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
	const p1div4 = (Fp.ORDER + _1n$7) / _4n$2;
	const root = Fp.pow(n, p1div4);
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt5mod8(Fp, n) {
	const p5div8 = (Fp.ORDER - _5n$1) / _8n$2;
	const n2 = Fp.mul(n, _2n$6);
	const v = Fp.pow(n2, p5div8);
	const nv = Fp.mul(n, v);
	const i = Fp.mul(Fp.mul(nv, _2n$6), v);
	const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt9mod16(P) {
	const Fp_ = Field(P);
	const tn = tonelliShanks(P);
	const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
	const c2 = tn(Fp_, c1);
	const c3 = tn(Fp_, Fp_.neg(c1));
	const c4 = (P + _7n) / _16n;
	return (Fp, n) => {
		let tv1 = Fp.pow(n, c4);
		let tv2 = Fp.mul(tv1, c1);
		const tv3 = Fp.mul(tv1, c2);
		const tv4 = Fp.mul(tv1, c3);
		const e1 = Fp.eql(Fp.sqr(tv2), n);
		const e2 = Fp.eql(Fp.sqr(tv3), n);
		tv1 = Fp.cmov(tv1, tv2, e1);
		tv2 = Fp.cmov(tv4, tv3, e2);
		const e3 = Fp.eql(Fp.sqr(tv2), n);
		const root = Fp.cmov(tv1, tv2, e3);
		assertIsSquare(Fp, root, n);
		return root;
	};
}
/**
* Tonelli-Shanks square root search algorithm.
* 1. https://eprint.iacr.org/2012/685.pdf (page 12)
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* @param P field order
* @returns function that takes field Fp (created from P) and number n
*/
function tonelliShanks(P) {
	if (P < _3n$4) throw new Error("sqrt is not defined for small field");
	let Q = P - _1n$7;
	let S = 0;
	while (Q % _2n$6 === _0n$7) {
		Q /= _2n$6;
		S++;
	}
	let Z = _2n$6;
	const _Fp = Field(P);
	while (FpLegendre(_Fp, Z) === 1) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (S === 1) return sqrt3mod4;
	let cc = _Fp.pow(Z, Q);
	const Q1div2 = (Q + _1n$7) / _2n$6;
	return function tonelliSlow(Fp, n) {
		if (Fp.is0(n)) return n;
		if (FpLegendre(Fp, n) !== 1) throw new Error("Cannot find square root");
		let M = S;
		let c = Fp.mul(Fp.ONE, cc);
		let t = Fp.pow(n, Q);
		let R = Fp.pow(n, Q1div2);
		while (!Fp.eql(t, Fp.ONE)) {
			if (Fp.is0(t)) return Fp.ZERO;
			let i = 1;
			let t_tmp = Fp.sqr(t);
			while (!Fp.eql(t_tmp, Fp.ONE)) {
				i++;
				t_tmp = Fp.sqr(t_tmp);
				if (i === M) throw new Error("Cannot find square root");
			}
			const exponent = _1n$7 << BigInt(M - i - 1);
			const b = Fp.pow(c, exponent);
			M = i;
			c = Fp.sqr(b);
			t = Fp.mul(t, c);
			R = Fp.mul(R, b);
		}
		return R;
	};
}
/**
* Square root for a finite field. Will try optimized versions first:
*
* 1. P ≡ 3 (mod 4)
* 2. P ≡ 5 (mod 8)
* 3. P ≡ 9 (mod 16)
* 4. Tonelli-Shanks algorithm
*
* Different algorithms can give different roots, it is up to user to decide which one they want.
* For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
*/
function FpSqrt(P) {
	if (P % _4n$2 === _3n$4) return sqrt3mod4;
	if (P % _8n$2 === _5n$1) return sqrt5mod8;
	if (P % _16n === _9n) return sqrt9mod16(P);
	return tonelliShanks(P);
}
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$7) === _1n$7;
var FIELD_FIELDS = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function validateField(field) {
	_validateObject(field, FIELD_FIELDS.reduce((map, val) => {
		map[val] = "function";
		return map;
	}, {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "number",
		BITS: "number"
	}));
	return field;
}
/**
* Same as `pow` but for Fp: non-constant-time.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
*/
function FpPow(Fp, num, power) {
	if (power < _0n$7) throw new Error("invalid exponent, negatives unsupported");
	if (power === _0n$7) return Fp.ONE;
	if (power === _1n$7) return num;
	let p = Fp.ONE;
	let d = num;
	while (power > _0n$7) {
		if (power & _1n$7) p = Fp.mul(p, d);
		d = Fp.sqr(d);
		power >>= _1n$7;
	}
	return p;
}
/**
* Efficiently invert an array of Field elements.
* Exception-free. Will return `undefined` for 0 elements.
* @param passZero map 0 to 0 (instead of undefined)
*/
function FpInvertBatch(Fp, nums, passZero = false) {
	const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
	const multipliedAcc = nums.reduce((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = acc;
		return Fp.mul(acc, num);
	}, Fp.ONE);
	const invertedAcc = Fp.inv(multipliedAcc);
	nums.reduceRight((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = Fp.mul(acc, inverted[i]);
		return Fp.mul(acc, num);
	}, invertedAcc);
	return inverted;
}
/**
* Legendre symbol.
* Legendre constant is used to calculate Legendre symbol (a | p)
* which denotes the value of a^((p-1)/2) (mod p).
*
* * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
* * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
* * (a | p) ≡ 0    if a ≡ 0 (mod p)
*/
function FpLegendre(Fp, n) {
	const p1mod2 = (Fp.ORDER - _1n$7) / _2n$6;
	const powered = Fp.pow(n, p1mod2);
	const yes = Fp.eql(powered, Fp.ONE);
	const zero = Fp.eql(powered, Fp.ZERO);
	const no = Fp.eql(powered, Fp.neg(Fp.ONE));
	if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
	return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
	if (nBitLength !== void 0) anumber(nBitLength);
	const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
/**
* Creates a finite field. Major performance optimizations:
* * 1. Denormalized operations like mulN instead of mul.
* * 2. Identical object shape: never add or remove keys.
* * 3. `Object.freeze`.
* Fragile: always run a benchmark on a change.
* Security note: operations don't check 'isValid' for all elements for performance reasons,
* it is caller responsibility to check this.
* This is low-level code, please make sure you know what you're doing.
*
* Note about field properties:
* * CHARACTERISTIC p = prime number, number of elements in main subgroup.
* * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
*
* @param ORDER field order, probably prime, or could be composite
* @param bitLen how many bits the field consumes
* @param isLE (default: false) if encoding / decoding should be in little-endian
* @param redef optional faster redefinitions of sqrt and other methods
*/
function Field(ORDER, bitLenOrOpts, isLE = false, opts = {}) {
	if (ORDER <= _0n$7) throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
	let _nbitLength = void 0;
	let _sqrt = void 0;
	let modFromBytes = false;
	let allowedLengths = void 0;
	if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
		if (opts.sqrt || isLE) throw new Error("cannot specify opts in two arguments");
		const _opts = bitLenOrOpts;
		if (_opts.BITS) _nbitLength = _opts.BITS;
		if (_opts.sqrt) _sqrt = _opts.sqrt;
		if (typeof _opts.isLE === "boolean") isLE = _opts.isLE;
		if (typeof _opts.modFromBytes === "boolean") modFromBytes = _opts.modFromBytes;
		allowedLengths = _opts.allowedLengths;
	} else {
		if (typeof bitLenOrOpts === "number") _nbitLength = bitLenOrOpts;
		if (opts.sqrt) _sqrt = opts.sqrt;
	}
	const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
	if (BYTES > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let sqrtP;
	const f = Object.freeze({
		ORDER,
		isLE,
		BITS,
		BYTES,
		MASK: bitMask(BITS),
		ZERO: _0n$7,
		ONE: _1n$7,
		allowedLengths,
		create: (num) => mod(num, ORDER),
		isValid: (num) => {
			if (typeof num !== "bigint") throw new Error("invalid field element: expected bigint, got " + typeof num);
			return _0n$7 <= num && num < ORDER;
		},
		is0: (num) => num === _0n$7,
		isValidNot0: (num) => !f.is0(num) && f.isValid(num),
		isOdd: (num) => (num & _1n$7) === _1n$7,
		neg: (num) => mod(-num, ORDER),
		eql: (lhs, rhs) => lhs === rhs,
		sqr: (num) => mod(num * num, ORDER),
		add: (lhs, rhs) => mod(lhs + rhs, ORDER),
		sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
		mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
		pow: (num, power) => FpPow(f, num, power),
		div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
		sqrN: (num) => num * num,
		addN: (lhs, rhs) => lhs + rhs,
		subN: (lhs, rhs) => lhs - rhs,
		mulN: (lhs, rhs) => lhs * rhs,
		inv: (num) => invert(num, ORDER),
		sqrt: _sqrt || ((n) => {
			if (!sqrtP) sqrtP = FpSqrt(ORDER);
			return sqrtP(f, n);
		}),
		toBytes: (num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
		fromBytes: (bytes, skipValidation = true) => {
			if (allowedLengths) {
				if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
				const padded = new Uint8Array(BYTES);
				padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
				bytes = padded;
			}
			if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
			let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
			if (modFromBytes) scalar = mod(scalar, ORDER);
			if (!skipValidation) {
				if (!f.isValid(scalar)) throw new Error("invalid field element: outside of range 0..ORDER");
			}
			return scalar;
		},
		invertBatch: (lst) => FpInvertBatch(f, lst),
		cmov: (a, b, c) => c ? b : a
	});
	return Object.freeze(f);
}
/**
* Returns total number of bytes consumed by the field element.
* For example, 32 bytes for usual 256-bit weierstrass curve.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of field
*/
function getFieldBytesLength(fieldOrder) {
	if (typeof fieldOrder !== "bigint") throw new Error("field order must be bigint");
	const bitLength = fieldOrder.toString(2).length;
	return Math.ceil(bitLength / 8);
}
/**
* Returns minimal amount of bytes that can be safely reduced
* by field order.
* Should be 2^-128 for 128-bit curve such as P256.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of target hash
*/
function getMinHashLength(fieldOrder) {
	const length = getFieldBytesLength(fieldOrder);
	return length + Math.ceil(length / 2);
}
/**
* "Constant-time" private key generation utility.
* Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
* and convert them into private scalar, with the modulo bias being negligible.
* Needs at least 48 bytes of input for 32-byte private key.
* https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
* FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
* RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
* @param hash hash output from SHA3 or a similar function
* @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
* @param isLE interpret hash bytes as LE num
* @returns valid private scalar
*/
function mapHashToField(key, fieldOrder, isLE = false) {
	const len = key.length;
	const fieldLen = getFieldBytesLength(fieldOrder);
	const minLen = getMinHashLength(fieldOrder);
	if (len < 16 || len < minLen || len > 1024) throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
	const reduced = mod(isLE ? bytesToNumberLE(key) : bytesToNumberBE(key), fieldOrder - _1n$7) + _1n$7;
	return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/curve.js
/**
* Methods for elliptic curve multiplication by scalars.
* Contains wNAF, pippenger.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$6 = BigInt(0);
var _1n$6 = BigInt(1);
function negateCt(condition, item) {
	const neg = item.negate();
	return condition ? neg : item;
}
/**
* Takes a bunch of Projective Points but executes only one
* inversion on all of them. Inversion is very slow operation,
* so this improves performance massively.
* Optimization: converts a list of projective points to a list of identical points with Z=1.
*/
function normalizeZ(c, points) {
	const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
	return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits) {
	if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
	validateW(W, scalarBits);
	const windows = Math.ceil(scalarBits / W) + 1;
	const windowSize = 2 ** (W - 1);
	const maxNumber = 2 ** W;
	return {
		windows,
		windowSize,
		mask: bitMask(W),
		maxNumber,
		shiftBy: BigInt(W)
	};
}
function calcOffsets(n, window, wOpts) {
	const { windowSize, mask, maxNumber, shiftBy } = wOpts;
	let wbits = Number(n & mask);
	let nextN = n >> shiftBy;
	if (wbits > windowSize) {
		wbits -= maxNumber;
		nextN += _1n$6;
	}
	const offsetStart = window * windowSize;
	const offset = offsetStart + Math.abs(wbits) - 1;
	const isZero = wbits === 0;
	const isNeg = wbits < 0;
	const isNegF = window % 2 !== 0;
	return {
		nextN,
		offset,
		isZero,
		isNeg,
		isNegF,
		offsetF: offsetStart
	};
}
function validateMSMPoints(points, c) {
	if (!Array.isArray(points)) throw new Error("array expected");
	points.forEach((p, i) => {
		if (!(p instanceof c)) throw new Error("invalid point at index " + i);
	});
}
function validateMSMScalars(scalars, field) {
	if (!Array.isArray(scalars)) throw new Error("array of scalars expected");
	scalars.forEach((s, i) => {
		if (!field.isValid(s)) throw new Error("invalid scalar at index " + i);
	});
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
	return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
	if (n !== _0n$6) throw new Error("invalid wNAF");
}
/**
* Elliptic curve multiplication of Point by scalar. Fragile.
* Table generation takes **30MB of ram and 10ms on high-end CPU**,
* but may take much longer on slow devices. Actual generation will happen on
* first call of `multiply()`. By default, `BASE` point is precomputed.
*
* Scalars should always be less than curve order: this should be checked inside of a curve itself.
* Creates precomputation tables for fast multiplication:
* - private scalar is split by fixed size windows of W bits
* - every window point is collected from window's table & added to accumulator
* - since windows are different, same point inside tables won't be accessed more than once per calc
* - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
* - +1 window is neccessary for wNAF
* - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
*
* @todo Research returning 2d JS array of windows, instead of a single window.
* This would allow windows to be in different memory locations
*/
var wNAF = class {
	constructor(Point, bits) {
		this.BASE = Point.BASE;
		this.ZERO = Point.ZERO;
		this.Fn = Point.Fn;
		this.bits = bits;
	}
	_unsafeLadder(elm, n, p = this.ZERO) {
		let d = elm;
		while (n > _0n$6) {
			if (n & _1n$6) p = p.add(d);
			d = d.double();
			n >>= _1n$6;
		}
		return p;
	}
	/**
	* Creates a wNAF precomputation window. Used for caching.
	* Default window size is set by `utils.precompute()` and is equal to 8.
	* Number of precomputed points depends on the curve size:
	* 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
	* - 𝑊 is the window size
	* - 𝑛 is the bitlength of the curve order.
	* For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
	* @param point Point instance
	* @param W window size
	* @returns precomputed point tables flattened to a single array
	*/
	precomputeWindow(point, W) {
		const { windows, windowSize } = calcWOpts(W, this.bits);
		const points = [];
		let p = point;
		let base = p;
		for (let window = 0; window < windows; window++) {
			base = p;
			points.push(base);
			for (let i = 1; i < windowSize; i++) {
				base = base.add(p);
				points.push(base);
			}
			p = base.double();
		}
		return points;
	}
	/**
	* Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
	* More compact implementation:
	* https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
	* @returns real and fake (for const-time) points
	*/
	wNAF(W, precomputes, n) {
		if (!this.Fn.isValid(n)) throw new Error("invalid scalar");
		let p = this.ZERO;
		let f = this.BASE;
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) f = f.add(negateCt(isNegF, precomputes[offsetF]));
			else p = p.add(negateCt(isNeg, precomputes[offset]));
		}
		assert0(n);
		return {
			p,
			f
		};
	}
	/**
	* Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
	* @param acc accumulator point to add result of multiplication
	* @returns point
	*/
	wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			if (n === _0n$6) break;
			const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) continue;
			else {
				const item = precomputes[offset];
				acc = acc.add(isNeg ? item.negate() : item);
			}
		}
		assert0(n);
		return acc;
	}
	getPrecomputes(W, point, transform) {
		let comp = pointPrecomputes.get(point);
		if (!comp) {
			comp = this.precomputeWindow(point, W);
			if (W !== 1) {
				if (typeof transform === "function") comp = transform(comp);
				pointPrecomputes.set(point, comp);
			}
		}
		return comp;
	}
	cached(point, scalar, transform) {
		const W = getW(point);
		return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
	}
	unsafe(point, scalar, transform, prev) {
		const W = getW(point);
		if (W === 1) return this._unsafeLadder(point, scalar, prev);
		return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
	}
	createCache(P, W) {
		validateW(W, this.bits);
		pointWindowSizes.set(P, W);
		pointPrecomputes.delete(P);
	}
	hasCache(elm) {
		return getW(elm) !== 1;
	}
};
/**
* Endomorphism-specific multiplication for Koblitz curves.
* Cost: 128 dbl, 0-256 adds.
*/
function mulEndoUnsafe(Point, point, k1, k2) {
	let acc = point;
	let p1 = Point.ZERO;
	let p2 = Point.ZERO;
	while (k1 > _0n$6 || k2 > _0n$6) {
		if (k1 & _1n$6) p1 = p1.add(acc);
		if (k2 & _1n$6) p2 = p2.add(acc);
		acc = acc.double();
		k1 >>= _1n$6;
		k2 >>= _1n$6;
	}
	return {
		p1,
		p2
	};
}
/**
* Pippenger algorithm for multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
* 30x faster vs naive addition on L=4096, 10x faster than precomputes.
* For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
* Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
* @param c Curve Point constructor
* @param fieldN field over CURVE.N - important that it's not over CURVE.P
* @param points array of L curve points
* @param scalars array of L scalars (aka secret keys / bigints)
*/
function pippenger(c, fieldN, points, scalars) {
	validateMSMPoints(points, c);
	validateMSMScalars(scalars, fieldN);
	const plength = points.length;
	const slength = scalars.length;
	if (plength !== slength) throw new Error("arrays of points and scalars must have equal length");
	const zero = c.ZERO;
	const wbits = bitLen(BigInt(plength));
	let windowSize = 1;
	if (wbits > 12) windowSize = wbits - 3;
	else if (wbits > 4) windowSize = wbits - 2;
	else if (wbits > 0) windowSize = 2;
	const MASK = bitMask(windowSize);
	const buckets = new Array(Number(MASK) + 1).fill(zero);
	const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
	let sum = zero;
	for (let i = lastBits; i >= 0; i -= windowSize) {
		buckets.fill(zero);
		for (let j = 0; j < slength; j++) {
			const scalar = scalars[j];
			const wbits = Number(scalar >> BigInt(i) & MASK);
			buckets[wbits] = buckets[wbits].add(points[j]);
		}
		let resI = zero;
		for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
			sumI = sumI.add(buckets[j]);
			resI = resI.add(sumI);
		}
		sum = sum.add(resI);
		if (i !== 0) for (let j = 0; j < windowSize; j++) sum = sum.double();
	}
	return sum;
}
function createField(order, field, isLE) {
	if (field) {
		if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		validateField(field);
		return field;
	} else return Field(order, { isLE });
}
/** Validates CURVE opts and creates fields */
function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
	if (FpFnLE === void 0) FpFnLE = type === "edwards";
	if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
	for (const p of [
		"p",
		"n",
		"h"
	]) {
		const val = CURVE[p];
		if (!(typeof val === "bigint" && val > _0n$6)) throw new Error(`CURVE.${p} must be positive bigint`);
	}
	const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
	const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
	const params = [
		"Gx",
		"Gy",
		"a",
		type === "weierstrass" ? "b" : "d"
	];
	for (const p of params) if (!Fp.isValid(CURVE[p])) throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
	CURVE = Object.freeze(Object.assign({}, CURVE));
	return {
		CURVE,
		Fp,
		Fn
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/hash-to-curve.js
var os2ip = bytesToNumberBE;
function i2osp(value, length) {
	anum(value);
	anum(length);
	if (value < 0 || value >= 1 << 8 * length) throw new Error("invalid I2OSP input: " + value);
	const res = Array.from({ length }).fill(0);
	for (let i = length - 1; i >= 0; i--) {
		res[i] = value & 255;
		value >>>= 8;
	}
	return new Uint8Array(res);
}
function strxor(a, b) {
	const arr = new Uint8Array(a.length);
	for (let i = 0; i < a.length; i++) arr[i] = a[i] ^ b[i];
	return arr;
}
function anum(item) {
	if (!Number.isSafeInteger(item)) throw new Error("number expected");
}
function normDST(DST) {
	if (!isBytes(DST) && typeof DST !== "string") throw new Error("DST must be Uint8Array or string");
	return typeof DST === "string" ? utf8ToBytes(DST) : DST;
}
/**
* Produces a uniformly random byte string using a cryptographic hash function H that outputs b bits.
* [RFC 9380 5.3.1](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.1).
*/
function expand_message_xmd(msg, DST, lenInBytes, H) {
	abytes(msg);
	anum(lenInBytes);
	DST = normDST(DST);
	if (DST.length > 255) DST = H(concatBytes(utf8ToBytes("H2C-OVERSIZE-DST-"), DST));
	const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
	const ell = Math.ceil(lenInBytes / b_in_bytes);
	if (lenInBytes > 65535 || ell > 255) throw new Error("expand_message_xmd: invalid lenInBytes");
	const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
	const Z_pad = i2osp(0, r_in_bytes);
	const l_i_b_str = i2osp(lenInBytes, 2);
	const b = new Array(ell);
	const b_0 = H(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
	b[0] = H(concatBytes(b_0, i2osp(1, 1), DST_prime));
	for (let i = 1; i <= ell; i++) {
		const args = [
			strxor(b_0, b[i - 1]),
			i2osp(i + 1, 1),
			DST_prime
		];
		b[i] = H(concatBytes(...args));
	}
	return concatBytes(...b).slice(0, lenInBytes);
}
/**
* Produces a uniformly random byte string using an extendable-output function (XOF) H.
* 1. The collision resistance of H MUST be at least k bits.
* 2. H MUST be an XOF that has been proved indifferentiable from
*    a random oracle under a reasonable cryptographic assumption.
* [RFC 9380 5.3.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.2).
*/
function expand_message_xof(msg, DST, lenInBytes, k, H) {
	abytes(msg);
	anum(lenInBytes);
	DST = normDST(DST);
	if (DST.length > 255) {
		const dkLen = Math.ceil(2 * k / 8);
		DST = H.create({ dkLen }).update(utf8ToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
	}
	if (lenInBytes > 65535 || DST.length > 255) throw new Error("expand_message_xof: invalid lenInBytes");
	return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
/**
* Hashes arbitrary-length byte strings to a list of one or more elements of a finite field F.
* [RFC 9380 5.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.2).
* @param msg a byte string containing the message to hash
* @param count the number of elements of F to output
* @param options `{DST: string, p: bigint, m: number, k: number, expand: 'xmd' | 'xof', hash: H}`, see above
* @returns [u_0, ..., u_(count - 1)], a list of field elements.
*/
function hash_to_field(msg, count, options) {
	_validateObject(options, {
		p: "bigint",
		m: "number",
		k: "number",
		hash: "function"
	});
	const { p, k, m, hash, expand, DST } = options;
	if (!isHash(options.hash)) throw new Error("expected valid hash");
	abytes(msg);
	anum(count);
	const log2p = p.toString(2).length;
	const L = Math.ceil((log2p + k) / 8);
	const len_in_bytes = count * m * L;
	let prb;
	if (expand === "xmd") prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
	else if (expand === "xof") prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
	else if (expand === "_internal_pass") prb = msg;
	else throw new Error("expand must be \"xmd\" or \"xof\"");
	const u = new Array(count);
	for (let i = 0; i < count; i++) {
		const e = new Array(m);
		for (let j = 0; j < m; j++) {
			const elm_offset = L * (j + i * m);
			const tv = prb.subarray(elm_offset, elm_offset + L);
			e[j] = mod(os2ip(tv), p);
		}
		u[i] = e;
	}
	return u;
}
function isogenyMap(field, map) {
	const coeff = map.map((i) => Array.from(i).reverse());
	return (x, y) => {
		const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
		const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
		x = field.mul(xn, xd_inv);
		y = field.mul(y, field.mul(yn, yd_inv));
		return {
			x,
			y
		};
	};
}
var _DST_scalar = utf8ToBytes("HashToScalar-");
/** Creates hash-to-curve methods from EC Point and mapToCurve function. See {@link H2CHasher}. */
function createHasher(Point, mapToCurve, defaults) {
	if (typeof mapToCurve !== "function") throw new Error("mapToCurve() must be defined");
	function map(num) {
		return Point.fromAffine(mapToCurve(num));
	}
	function clear(initial) {
		const P = initial.clearCofactor();
		if (P.equals(Point.ZERO)) return Point.ZERO;
		P.assertValidity();
		return P;
	}
	return {
		defaults,
		hashToCurve(msg, options) {
			const u = hash_to_field(msg, 2, Object.assign({}, defaults, options));
			const u0 = map(u[0]);
			const u1 = map(u[1]);
			return clear(u0.add(u1));
		},
		encodeToCurve(msg, options) {
			const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
			return clear(map(hash_to_field(msg, 1, Object.assign({}, defaults, optsDst, options))[0]));
		},
		/** See {@link H2CHasher} */
		mapToCurve(scalars) {
			if (!Array.isArray(scalars)) throw new Error("expected array of bigints");
			for (const i of scalars) if (typeof i !== "bigint") throw new Error("expected array of bigints");
			return clear(map(scalars));
		},
		hashToScalar(msg, options) {
			const N = Point.Fn.ORDER;
			return hash_to_field(msg, 1, Object.assign({}, defaults, {
				p: N,
				m: 1,
				DST: _DST_scalar
			}, options))[0][0];
		}
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/weierstrass.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n$5) / den;
/**
* Splits scalar for GLV endomorphism.
*/
function _splitEndoScalar(k, basis, n) {
	const [[a1, b1], [a2, b2]] = basis;
	const c1 = divNearest(b2 * k, n);
	const c2 = divNearest(-b1 * k, n);
	let k1 = k - c1 * a1 - c2 * a2;
	let k2 = -c1 * b1 - c2 * b2;
	const k1neg = k1 < _0n$5;
	const k2neg = k2 < _0n$5;
	if (k1neg) k1 = -k1;
	if (k2neg) k2 = -k2;
	const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n$5;
	if (k1 < _0n$5 || k1 >= MAX_NUM || k2 < _0n$5 || k2 >= MAX_NUM) throw new Error("splitScalar (endomorphism): failed, k=" + k);
	return {
		k1neg,
		k1,
		k2neg,
		k2
	};
}
var _0n$5 = BigInt(0);
var _1n$5 = BigInt(1);
var _2n$5 = BigInt(2);
var _3n$3 = BigInt(3);
var _4n$1 = BigInt(4);
function _normFnElement(Fn, key) {
	const { BYTES: expected } = Fn;
	let num;
	if (typeof key === "bigint") num = key;
	else {
		let bytes = ensureBytes("private key", key);
		try {
			num = Fn.fromBytes(bytes);
		} catch (error) {
			throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
		}
	}
	if (!Fn.isValidNot0(num)) throw new Error("invalid private key: out of range [1..N-1]");
	return num;
}
/**
* Creates weierstrass Point constructor, based on specified curve options.
*
* @example
```js
const opts = {
p: BigInt('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff'),
n: BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'),
h: BigInt(1),
a: BigInt('0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc'),
b: BigInt('0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b'),
Gx: BigInt('0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296'),
Gy: BigInt('0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5'),
};
const p256_Point = weierstrass(opts);
```
*/
function weierstrassN(params, extraOpts = {}) {
	const validated = _createCurveFields("weierstrass", params, extraOpts);
	const { Fp, Fn } = validated;
	let CURVE = validated.CURVE;
	const { h: cofactor, n: CURVE_ORDER } = CURVE;
	_validateObject(extraOpts, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object",
		wrapPrivateKey: "boolean"
	});
	const { endo } = extraOpts;
	if (endo) {
		if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) throw new Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	}
	const lengths = getWLengths(Fp, Fn);
	function assertCompressionIsSupported() {
		if (!Fp.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
	}
	function pointToBytes(_c, point, isCompressed) {
		const { x, y } = point.toAffine();
		const bx = Fp.toBytes(x);
		_abool2(isCompressed, "isCompressed");
		if (isCompressed) {
			assertCompressionIsSupported();
			return concatBytes(pprefix(!Fp.isOdd(y)), bx);
		} else return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
	}
	function pointFromBytes(bytes) {
		_abytes2(bytes, void 0, "Point");
		const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
		const length = bytes.length;
		const head = bytes[0];
		const tail = bytes.subarray(1);
		if (length === comp && (head === 2 || head === 3)) {
			const x = Fp.fromBytes(tail);
			if (!Fp.isValid(x)) throw new Error("bad point: is not on curve, wrong x");
			const y2 = weierstrassEquation(x);
			let y;
			try {
				y = Fp.sqrt(y2);
			} catch (sqrtError) {
				const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
				throw new Error("bad point: is not on curve, sqrt error" + err);
			}
			assertCompressionIsSupported();
			const isYOdd = Fp.isOdd(y);
			if ((head & 1) === 1 !== isYOdd) y = Fp.neg(y);
			return {
				x,
				y
			};
		} else if (length === uncomp && head === 4) {
			const L = Fp.BYTES;
			const x = Fp.fromBytes(tail.subarray(0, L));
			const y = Fp.fromBytes(tail.subarray(L, L * 2));
			if (!isValidXY(x, y)) throw new Error("bad point: is not on curve");
			return {
				x,
				y
			};
		} else throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
	}
	const encodePoint = extraOpts.toBytes || pointToBytes;
	const decodePoint = extraOpts.fromBytes || pointFromBytes;
	function weierstrassEquation(x) {
		const x2 = Fp.sqr(x);
		const x3 = Fp.mul(x2, x);
		return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
	}
	/** Checks whether equation holds for given x, y: y² == x³ + ax + b */
	function isValidXY(x, y) {
		const left = Fp.sqr(y);
		const right = weierstrassEquation(x);
		return Fp.eql(left, right);
	}
	if (!isValidXY(CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n$3), _4n$1);
	const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
	if (Fp.is0(Fp.add(_4a3, _27b2))) throw new Error("bad curve params: a or b");
	/** Asserts coordinate is valid: 0 <= n < Fp.ORDER. */
	function acoord(title, n, banZero = false) {
		if (!Fp.isValid(n) || banZero && Fp.is0(n)) throw new Error(`bad point coordinate ${title}`);
		return n;
	}
	function aprjpoint(other) {
		if (!(other instanceof Point)) throw new Error("ProjectivePoint expected");
	}
	function splitEndoScalarN(k) {
		if (!endo || !endo.basises) throw new Error("no endo");
		return _splitEndoScalar(k, endo.basises, Fn.ORDER);
	}
	const toAffineMemo = memoized((p, iz) => {
		const { X, Y, Z } = p;
		if (Fp.eql(Z, Fp.ONE)) return {
			x: X,
			y: Y
		};
		const is0 = p.is0();
		if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(Z);
		const x = Fp.mul(X, iz);
		const y = Fp.mul(Y, iz);
		const zz = Fp.mul(Z, iz);
		if (is0) return {
			x: Fp.ZERO,
			y: Fp.ZERO
		};
		if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
		return {
			x,
			y
		};
	});
	const assertValidMemo = memoized((p) => {
		if (p.is0()) {
			if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y)) return;
			throw new Error("bad point: ZERO");
		}
		const { x, y } = p.toAffine();
		if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error("bad point: x or y not field elements");
		if (!isValidXY(x, y)) throw new Error("bad point: equation left != right");
		if (!p.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return true;
	});
	function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
		k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
		k1p = negateCt(k1neg, k1p);
		k2p = negateCt(k2neg, k2p);
		return k1p.add(k2p);
	}
	/**
	* Projective Point works in 3d / projective (homogeneous) coordinates:(X, Y, Z) ∋ (x=X/Z, y=Y/Z).
	* Default Point works in 2d / affine coordinates: (x, y).
	* We're doing calculations in projective, because its operations don't require costly inversion.
	*/
	class Point {
		/** Does NOT validate if the point is valid. Use `.assertValidity()`. */
		constructor(X, Y, Z) {
			this.X = acoord("x", X);
			this.Y = acoord("y", Y, true);
			this.Z = acoord("z", Z);
			Object.freeze(this);
		}
		static CURVE() {
			return CURVE;
		}
		/** Does NOT validate if the point is valid. Use `.assertValidity()`. */
		static fromAffine(p) {
			const { x, y } = p || {};
			if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error("invalid affine point");
			if (p instanceof Point) throw new Error("projective point not allowed");
			if (Fp.is0(x) && Fp.is0(y)) return Point.ZERO;
			return new Point(x, y, Fp.ONE);
		}
		static fromBytes(bytes) {
			const P = Point.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
			P.assertValidity();
			return P;
		}
		static fromHex(hex) {
			return Point.fromBytes(ensureBytes("pointHex", hex));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		/**
		*
		* @param windowSize
		* @param isLazy true will defer table computation until the first multiplication
		* @returns
		*/
		precompute(windowSize = 8, isLazy = true) {
			wnaf.createCache(this, windowSize);
			if (!isLazy) this.multiply(_3n$3);
			return this;
		}
		/** A point on curve is valid if it conforms to equation. */
		assertValidity() {
			assertValidMemo(this);
		}
		hasEvenY() {
			const { y } = this.toAffine();
			if (!Fp.isOdd) throw new Error("Field doesn't support isOdd");
			return !Fp.isOdd(y);
		}
		/** Compare one point to another. */
		equals(other) {
			aprjpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
			const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
			return U1 && U2;
		}
		/** Flips point to one corresponding to (x, -y) in Affine coordinates. */
		negate() {
			return new Point(this.X, Fp.neg(this.Y), this.Z);
		}
		double() {
			const { a, b } = CURVE;
			const b3 = Fp.mul(b, _3n$3);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			let t0 = Fp.mul(X1, X1);
			let t1 = Fp.mul(Y1, Y1);
			let t2 = Fp.mul(Z1, Z1);
			let t3 = Fp.mul(X1, Y1);
			t3 = Fp.add(t3, t3);
			Z3 = Fp.mul(X1, Z1);
			Z3 = Fp.add(Z3, Z3);
			X3 = Fp.mul(a, Z3);
			Y3 = Fp.mul(b3, t2);
			Y3 = Fp.add(X3, Y3);
			X3 = Fp.sub(t1, Y3);
			Y3 = Fp.add(t1, Y3);
			Y3 = Fp.mul(X3, Y3);
			X3 = Fp.mul(t3, X3);
			Z3 = Fp.mul(b3, Z3);
			t2 = Fp.mul(a, t2);
			t3 = Fp.sub(t0, t2);
			t3 = Fp.mul(a, t3);
			t3 = Fp.add(t3, Z3);
			Z3 = Fp.add(t0, t0);
			t0 = Fp.add(Z3, t0);
			t0 = Fp.add(t0, t2);
			t0 = Fp.mul(t0, t3);
			Y3 = Fp.add(Y3, t0);
			t2 = Fp.mul(Y1, Z1);
			t2 = Fp.add(t2, t2);
			t0 = Fp.mul(t2, t3);
			X3 = Fp.sub(X3, t0);
			Z3 = Fp.mul(t2, t1);
			Z3 = Fp.add(Z3, Z3);
			Z3 = Fp.add(Z3, Z3);
			return new Point(X3, Y3, Z3);
		}
		add(other) {
			aprjpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			const a = CURVE.a;
			const b3 = Fp.mul(CURVE.b, _3n$3);
			let t0 = Fp.mul(X1, X2);
			let t1 = Fp.mul(Y1, Y2);
			let t2 = Fp.mul(Z1, Z2);
			let t3 = Fp.add(X1, Y1);
			let t4 = Fp.add(X2, Y2);
			t3 = Fp.mul(t3, t4);
			t4 = Fp.add(t0, t1);
			t3 = Fp.sub(t3, t4);
			t4 = Fp.add(X1, Z1);
			let t5 = Fp.add(X2, Z2);
			t4 = Fp.mul(t4, t5);
			t5 = Fp.add(t0, t2);
			t4 = Fp.sub(t4, t5);
			t5 = Fp.add(Y1, Z1);
			X3 = Fp.add(Y2, Z2);
			t5 = Fp.mul(t5, X3);
			X3 = Fp.add(t1, t2);
			t5 = Fp.sub(t5, X3);
			Z3 = Fp.mul(a, t4);
			X3 = Fp.mul(b3, t2);
			Z3 = Fp.add(X3, Z3);
			X3 = Fp.sub(t1, Z3);
			Z3 = Fp.add(t1, Z3);
			Y3 = Fp.mul(X3, Z3);
			t1 = Fp.add(t0, t0);
			t1 = Fp.add(t1, t0);
			t2 = Fp.mul(a, t2);
			t4 = Fp.mul(b3, t4);
			t1 = Fp.add(t1, t2);
			t2 = Fp.sub(t0, t2);
			t2 = Fp.mul(a, t2);
			t4 = Fp.add(t4, t2);
			t0 = Fp.mul(t1, t4);
			Y3 = Fp.add(Y3, t0);
			t0 = Fp.mul(t5, t4);
			X3 = Fp.mul(t3, X3);
			X3 = Fp.sub(X3, t0);
			t0 = Fp.mul(t3, t1);
			Z3 = Fp.mul(t5, Z3);
			Z3 = Fp.add(Z3, t0);
			return new Point(X3, Y3, Z3);
		}
		subtract(other) {
			return this.add(other.negate());
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		/**
		* Constant time multiplication.
		* Uses wNAF method. Windowed method may be 10% faster,
		* but takes 2x longer to generate and consumes 2x memory.
		* Uses precomputes when available.
		* Uses endomorphism for Koblitz curves.
		* @param scalar by which the point would be multiplied
		* @returns New point
		*/
		multiply(scalar) {
			const { endo } = extraOpts;
			if (!Fn.isValidNot0(scalar)) throw new Error("invalid scalar: out of range");
			let point, fake;
			const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
			/** See docs for {@link EndomorphismOpts} */
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
				const { p: k1p, f: k1f } = mul(k1);
				const { p: k2p, f: k2f } = mul(k2);
				fake = k1f.add(k2f);
				point = finishEndo(endo.beta, k1p, k2p, k1neg, k2neg);
			} else {
				const { p, f } = mul(scalar);
				point = p;
				fake = f;
			}
			return normalizeZ(Point, [point, fake])[0];
		}
		/**
		* Non-constant-time multiplication. Uses double-and-add algorithm.
		* It's faster, but should only be used when you don't care about
		* an exposed secret key e.g. sig verification, which works over *public* keys.
		*/
		multiplyUnsafe(sc) {
			const { endo } = extraOpts;
			const p = this;
			if (!Fn.isValid(sc)) throw new Error("invalid scalar: out of range");
			if (sc === _0n$5 || p.is0()) return Point.ZERO;
			if (sc === _1n$5) return p;
			if (wnaf.hasCache(this)) return this.multiply(sc);
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
				const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
				return finishEndo(endo.beta, p1, p2, k1neg, k2neg);
			} else return wnaf.unsafe(p, sc);
		}
		multiplyAndAddUnsafe(Q, a, b) {
			const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
			return sum.is0() ? void 0 : sum;
		}
		/**
		* Converts Projective point to affine (x, y) coordinates.
		* @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
		*/
		toAffine(invertedZ) {
			return toAffineMemo(this, invertedZ);
		}
		/**
		* Checks whether Point is free of torsion elements (is in prime subgroup).
		* Always torsion-free for cofactor=1 curves.
		*/
		isTorsionFree() {
			const { isTorsionFree } = extraOpts;
			if (cofactor === _1n$5) return true;
			if (isTorsionFree) return isTorsionFree(Point, this);
			return wnaf.unsafe(this, CURVE_ORDER).is0();
		}
		clearCofactor() {
			const { clearCofactor } = extraOpts;
			if (cofactor === _1n$5) return this;
			if (clearCofactor) return clearCofactor(Point, this);
			return this.multiplyUnsafe(cofactor);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(cofactor).is0();
		}
		toBytes(isCompressed = true) {
			_abool2(isCompressed, "isCompressed");
			this.assertValidity();
			return encodePoint(Point, this, isCompressed);
		}
		toHex(isCompressed = true) {
			return bytesToHex(this.toBytes(isCompressed));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
		get px() {
			return this.X;
		}
		get py() {
			return this.X;
		}
		get pz() {
			return this.Z;
		}
		toRawBytes(isCompressed = true) {
			return this.toBytes(isCompressed);
		}
		_setWindowSize(windowSize) {
			this.precompute(windowSize);
		}
		static normalizeZ(points) {
			return normalizeZ(Point, points);
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		static fromPrivateKey(privateKey) {
			return Point.BASE.multiply(_normFnElement(Fn, privateKey));
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
	Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
	Point.Fp = Fp;
	Point.Fn = Fn;
	const bits = Fn.BITS;
	const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
	Point.BASE.precompute(8);
	return Point;
}
function pprefix(hasEvenY) {
	return Uint8Array.of(hasEvenY ? 2 : 3);
}
/**
* Implementation of the Shallue and van de Woestijne method for any weierstrass curve.
* TODO: check if there is a way to merge this with uvRatio in Edwards; move to modular.
* b = True and y = sqrt(u / v) if (u / v) is square in F, and
* b = False and y = sqrt(Z * (u / v)) otherwise.
* @param Fp
* @param Z
* @returns
*/
function SWUFpSqrtRatio(Fp, Z) {
	const q = Fp.ORDER;
	let l = _0n$5;
	for (let o = q - _1n$5; o % _2n$5 === _0n$5; o /= _2n$5) l += _1n$5;
	const c1 = l;
	const _2n_pow_c1_1 = _2n$5 << c1 - _1n$5 - _1n$5;
	const _2n_pow_c1 = _2n_pow_c1_1 * _2n$5;
	const c2 = (q - _1n$5) / _2n_pow_c1;
	const c3 = (c2 - _1n$5) / _2n$5;
	const c4 = _2n_pow_c1 - _1n$5;
	const c5 = _2n_pow_c1_1;
	const c6 = Fp.pow(Z, c2);
	const c7 = Fp.pow(Z, (c2 + _1n$5) / _2n$5);
	let sqrtRatio = (u, v) => {
		let tv1 = c6;
		let tv2 = Fp.pow(v, c4);
		let tv3 = Fp.sqr(tv2);
		tv3 = Fp.mul(tv3, v);
		let tv5 = Fp.mul(u, tv3);
		tv5 = Fp.pow(tv5, c3);
		tv5 = Fp.mul(tv5, tv2);
		tv2 = Fp.mul(tv5, v);
		tv3 = Fp.mul(tv5, u);
		let tv4 = Fp.mul(tv3, tv2);
		tv5 = Fp.pow(tv4, c5);
		let isQR = Fp.eql(tv5, Fp.ONE);
		tv2 = Fp.mul(tv3, c7);
		tv5 = Fp.mul(tv4, tv1);
		tv3 = Fp.cmov(tv2, tv3, isQR);
		tv4 = Fp.cmov(tv5, tv4, isQR);
		for (let i = c1; i > _1n$5; i--) {
			let tv5 = i - _2n$5;
			tv5 = _2n$5 << tv5 - _1n$5;
			let tvv5 = Fp.pow(tv4, tv5);
			const e1 = Fp.eql(tvv5, Fp.ONE);
			tv2 = Fp.mul(tv3, tv1);
			tv1 = Fp.mul(tv1, tv1);
			tvv5 = Fp.mul(tv4, tv1);
			tv3 = Fp.cmov(tv2, tv3, e1);
			tv4 = Fp.cmov(tvv5, tv4, e1);
		}
		return {
			isValid: isQR,
			value: tv3
		};
	};
	if (Fp.ORDER % _4n$1 === _3n$3) {
		const c1 = (Fp.ORDER - _3n$3) / _4n$1;
		const c2 = Fp.sqrt(Fp.neg(Z));
		sqrtRatio = (u, v) => {
			let tv1 = Fp.sqr(v);
			const tv2 = Fp.mul(u, v);
			tv1 = Fp.mul(tv1, tv2);
			let y1 = Fp.pow(tv1, c1);
			y1 = Fp.mul(y1, tv2);
			const y2 = Fp.mul(y1, c2);
			const tv3 = Fp.mul(Fp.sqr(y1), v);
			const isQR = Fp.eql(tv3, u);
			return {
				isValid: isQR,
				value: Fp.cmov(y2, y1, isQR)
			};
		};
	}
	return sqrtRatio;
}
/**
* Simplified Shallue-van de Woestijne-Ulas Method
* https://www.rfc-editor.org/rfc/rfc9380#section-6.6.2
*/
function mapToCurveSimpleSWU(Fp, opts) {
	validateField(Fp);
	const { A, B, Z } = opts;
	if (!Fp.isValid(A) || !Fp.isValid(B) || !Fp.isValid(Z)) throw new Error("mapToCurveSimpleSWU: invalid opts");
	const sqrtRatio = SWUFpSqrtRatio(Fp, Z);
	if (!Fp.isOdd) throw new Error("Field does not have .isOdd()");
	return (u) => {
		let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
		tv1 = Fp.sqr(u);
		tv1 = Fp.mul(tv1, Z);
		tv2 = Fp.sqr(tv1);
		tv2 = Fp.add(tv2, tv1);
		tv3 = Fp.add(tv2, Fp.ONE);
		tv3 = Fp.mul(tv3, B);
		tv4 = Fp.cmov(Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
		tv4 = Fp.mul(tv4, A);
		tv2 = Fp.sqr(tv3);
		tv6 = Fp.sqr(tv4);
		tv5 = Fp.mul(tv6, A);
		tv2 = Fp.add(tv2, tv5);
		tv2 = Fp.mul(tv2, tv3);
		tv6 = Fp.mul(tv6, tv4);
		tv5 = Fp.mul(tv6, B);
		tv2 = Fp.add(tv2, tv5);
		x = Fp.mul(tv1, tv3);
		const { isValid, value } = sqrtRatio(tv2, tv6);
		y = Fp.mul(tv1, u);
		y = Fp.mul(y, value);
		x = Fp.cmov(x, tv3, isValid);
		y = Fp.cmov(y, value, isValid);
		const e1 = Fp.isOdd(u) === Fp.isOdd(y);
		y = Fp.cmov(Fp.neg(y), y, e1);
		const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
		x = Fp.mul(x, tv4_inv);
		return {
			x,
			y
		};
	};
}
function getWLengths(Fp, Fn) {
	return {
		secretKey: Fn.BYTES,
		publicKey: 1 + Fp.BYTES,
		publicKeyUncompressed: 1 + 2 * Fp.BYTES,
		publicKeyHasPrefix: true,
		signature: 2 * Fn.BYTES
	};
}
/** @deprecated use `weierstrass` in newer releases */
function weierstrassPoints(c) {
	const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
	return _weierstrass_new_output_to_legacy(c, weierstrassN(CURVE, curveOpts));
}
function _weierstrass_legacy_opts_to_new(c) {
	const CURVE = {
		a: c.a,
		b: c.b,
		p: c.Fp.ORDER,
		n: c.n,
		h: c.h,
		Gx: c.Gx,
		Gy: c.Gy
	};
	const Fp = c.Fp;
	let allowedLengths = c.allowedPrivateKeyLengths ? Array.from(new Set(c.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
	return {
		CURVE,
		curveOpts: {
			Fp,
			Fn: Field(CURVE.n, {
				BITS: c.nBitLength,
				allowedLengths,
				modFromBytes: c.wrapPrivateKey
			}),
			allowInfinityPoint: c.allowInfinityPoint,
			endo: c.endo,
			isTorsionFree: c.isTorsionFree,
			clearCofactor: c.clearCofactor,
			fromBytes: c.fromBytes,
			toBytes: c.toBytes
		}
	};
}
function _legacyHelperEquat(Fp, a, b) {
	/**
	* y² = x³ + ax + b: Short weierstrass curve formula. Takes x, returns y².
	* @returns y²
	*/
	function weierstrassEquation(x) {
		const x2 = Fp.sqr(x);
		const x3 = Fp.mul(x2, x);
		return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
	}
	return weierstrassEquation;
}
function _weierstrass_new_output_to_legacy(c, Point) {
	const { Fp, Fn } = Point;
	function isWithinCurveOrder(num) {
		return inRange(num, _1n$5, Fn.ORDER);
	}
	const weierstrassEquation = _legacyHelperEquat(Fp, c.a, c.b);
	return Object.assign({}, {
		CURVE: c,
		Point,
		ProjectivePoint: Point,
		normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
		weierstrassEquation,
		isWithinCurveOrder
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/bls.js
/**
* BLS != BLS.
* The file implements BLS (Boneh-Lynn-Shacham) signatures.
* Used in both BLS (Barreto-Lynn-Scott) and BN (Barreto-Naehrig)
* families of pairing-friendly curves.
* Consists of two curves: G1 and G2:
* - G1 is a subgroup of (x, y) E(Fq) over y² = x³ + 4.
* - G2 is a subgroup of ((x₁, x₂+i), (y₁, y₂+i)) E(Fq²) over y² = x³ + 4(1 + i) where i is √-1
* - Gt, created by bilinear (ate) pairing e(G1, G2), consists of p-th roots of unity in
*   Fq^k where k is embedding degree. Only degree 12 is currently supported, 24 is not.
* Pairing is used to aggregate and verify signatures.
* There are two modes of operation:
* - Long signatures:  X-byte keys + 2X-byte sigs (G1 keys + G2 sigs).
* - Short signatures: 2X-byte keys + X-byte sigs (G2 keys + G1 sigs).
* @module
**/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$4 = BigInt(0);
var _1n$4 = BigInt(1);
var _2n$4 = BigInt(2);
var _3n$2 = BigInt(3);
function NAfDecomposition(a) {
	const res = [];
	for (; a > _1n$4; a >>= _1n$4) if ((a & _1n$4) === _0n$4) res.unshift(0);
	else if ((a & _3n$2) === _3n$2) {
		res.unshift(-1);
		a += _1n$4;
	} else res.unshift(1);
	return res;
}
function aNonEmpty(arr) {
	if (!Array.isArray(arr) || arr.length === 0) throw new Error("expected non-empty array");
}
function createBlsPairing(fields, G1, G2, params) {
	const { Fp2, Fp12 } = fields;
	const { twistType, ateLoopSize, xNegative, postPrecompute } = params;
	let lineFunction;
	if (twistType === "multiplicative") lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul014(f, c0, Fp2.mul(c1, Px), Fp2.mul(c2, Py));
	else if (twistType === "divisive") lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul034(f, Fp2.mul(c2, Py), Fp2.mul(c1, Px), c0);
	else throw new Error("bls: unknown twist type");
	const Fp2div2 = Fp2.div(Fp2.ONE, Fp2.mul(Fp2.ONE, _2n$4));
	function pointDouble(ell, Rx, Ry, Rz) {
		const t0 = Fp2.sqr(Ry);
		const t1 = Fp2.sqr(Rz);
		const t2 = Fp2.mulByB(Fp2.mul(t1, _3n$2));
		const t3 = Fp2.mul(t2, _3n$2);
		const t4 = Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(Ry, Rz)), t1), t0);
		const c0 = Fp2.sub(t2, t0);
		const c1 = Fp2.mul(Fp2.sqr(Rx), _3n$2);
		const c2 = Fp2.neg(t4);
		ell.push([
			c0,
			c1,
			c2
		]);
		Rx = Fp2.mul(Fp2.mul(Fp2.mul(Fp2.sub(t0, t3), Rx), Ry), Fp2div2);
		Ry = Fp2.sub(Fp2.sqr(Fp2.mul(Fp2.add(t0, t3), Fp2div2)), Fp2.mul(Fp2.sqr(t2), _3n$2));
		Rz = Fp2.mul(t0, t4);
		return {
			Rx,
			Ry,
			Rz
		};
	}
	function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
		const t0 = Fp2.sub(Ry, Fp2.mul(Qy, Rz));
		const t1 = Fp2.sub(Rx, Fp2.mul(Qx, Rz));
		const c0 = Fp2.sub(Fp2.mul(t0, Qx), Fp2.mul(t1, Qy));
		const c1 = Fp2.neg(t0);
		const c2 = t1;
		ell.push([
			c0,
			c1,
			c2
		]);
		const t2 = Fp2.sqr(t1);
		const t3 = Fp2.mul(t2, t1);
		const t4 = Fp2.mul(t2, Rx);
		const t5 = Fp2.add(Fp2.sub(t3, Fp2.mul(t4, _2n$4)), Fp2.mul(Fp2.sqr(t0), Rz));
		Rx = Fp2.mul(t1, t5);
		Ry = Fp2.sub(Fp2.mul(Fp2.sub(t4, t5), t0), Fp2.mul(t3, Ry));
		Rz = Fp2.mul(Rz, t3);
		return {
			Rx,
			Ry,
			Rz
		};
	}
	const ATE_NAF = NAfDecomposition(ateLoopSize);
	const calcPairingPrecomputes = memoized((point) => {
		const { x, y } = point.toAffine();
		const Qx = x, Qy = y, negQy = Fp2.neg(y);
		let Rx = Qx, Ry = Qy, Rz = Fp2.ONE;
		const ell = [];
		for (const bit of ATE_NAF) {
			const cur = [];
			({Rx, Ry, Rz} = pointDouble(cur, Rx, Ry, Rz));
			if (bit) ({Rx, Ry, Rz} = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
			ell.push(cur);
		}
		if (postPrecompute) {
			const last = ell[ell.length - 1];
			postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
		}
		return ell;
	});
	function millerLoopBatch(pairs, withFinalExponent = false) {
		let f12 = Fp12.ONE;
		if (pairs.length) {
			const ellLen = pairs[0][0].length;
			for (let i = 0; i < ellLen; i++) {
				f12 = Fp12.sqr(f12);
				for (const [ell, Px, Py] of pairs) for (const [c0, c1, c2] of ell[i]) f12 = lineFunction(c0, c1, c2, f12, Px, Py);
			}
		}
		if (xNegative) f12 = Fp12.conjugate(f12);
		return withFinalExponent ? Fp12.finalExponentiate(f12) : f12;
	}
	function pairingBatch(pairs, withFinalExponent = true) {
		const res = [];
		normalizeZ(G1, pairs.map(({ g1 }) => g1));
		normalizeZ(G2, pairs.map(({ g2 }) => g2));
		for (const { g1, g2 } of pairs) {
			if (g1.is0() || g2.is0()) throw new Error("pairing is not available for ZERO point");
			g1.assertValidity();
			g2.assertValidity();
			const Qa = g1.toAffine();
			res.push([
				calcPairingPrecomputes(g2),
				Qa.x,
				Qa.y
			]);
		}
		return millerLoopBatch(res, withFinalExponent);
	}
	function pairing(Q, P, withFinalExponent = true) {
		return pairingBatch([{
			g1: Q,
			g2: P
		}], withFinalExponent);
	}
	return {
		Fp12,
		millerLoopBatch,
		pairing,
		pairingBatch,
		calcPairingPrecomputes
	};
}
function createBlsSig(blsPairing, PubCurve, SigCurve, SignatureCoder, isSigG1) {
	const { Fp12, pairingBatch } = blsPairing;
	function normPub(point) {
		return point instanceof PubCurve.Point ? point : PubCurve.Point.fromHex(point);
	}
	function normSig(point) {
		return point instanceof SigCurve.Point ? point : SigCurve.Point.fromHex(point);
	}
	function amsg(m) {
		if (!(m instanceof SigCurve.Point)) throw new Error(`expected valid message hashed to ${!isSigG1 ? "G2" : "G1"} curve`);
		return m;
	}
	const pair = !isSigG1 ? (a, b) => ({
		g1: a,
		g2: b
	}) : (a, b) => ({
		g1: b,
		g2: a
	});
	return {
		getPublicKey(secretKey) {
			const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
			return PubCurve.Point.BASE.multiply(sec);
		},
		sign(message, secretKey, unusedArg) {
			if (unusedArg != null) throw new Error("sign() expects 2 arguments");
			const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
			amsg(message).assertValidity();
			return message.multiply(sec);
		},
		verify(signature, message, publicKey, unusedArg) {
			if (unusedArg != null) throw new Error("verify() expects 3 arguments");
			signature = normSig(signature);
			publicKey = normPub(publicKey);
			const P = publicKey.negate();
			const G = PubCurve.Point.BASE;
			const Hm = amsg(message);
			const S = signature;
			const exp = pairingBatch([pair(P, Hm), pair(G, S)]);
			return Fp12.eql(exp, Fp12.ONE);
		},
		verifyBatch(signature, messages, publicKeys) {
			aNonEmpty(messages);
			if (publicKeys.length !== messages.length) throw new Error("amount of public keys and messages should be equal");
			const sig = normSig(signature);
			const nMessages = messages;
			const nPublicKeys = publicKeys.map(normPub);
			const messagePubKeyMap = /* @__PURE__ */ new Map();
			for (let i = 0; i < nPublicKeys.length; i++) {
				const pub = nPublicKeys[i];
				const msg = nMessages[i];
				let keys = messagePubKeyMap.get(msg);
				if (keys === void 0) {
					keys = [];
					messagePubKeyMap.set(msg, keys);
				}
				keys.push(pub);
			}
			const paired = [];
			const G = PubCurve.Point.BASE;
			try {
				for (const [msg, keys] of messagePubKeyMap) {
					const groupPublicKey = keys.reduce((acc, msg) => acc.add(msg));
					paired.push(pair(groupPublicKey, msg));
				}
				paired.push(pair(G.negate(), sig));
				return Fp12.eql(pairingBatch(paired), Fp12.ONE);
			} catch {
				return false;
			}
		},
		aggregatePublicKeys(publicKeys) {
			aNonEmpty(publicKeys);
			publicKeys = publicKeys.map((pub) => normPub(pub));
			const agg = publicKeys.reduce((sum, p) => sum.add(p), PubCurve.Point.ZERO);
			agg.assertValidity();
			return agg;
		},
		aggregateSignatures(signatures) {
			aNonEmpty(signatures);
			signatures = signatures.map((sig) => normSig(sig));
			const agg = signatures.reduce((sum, s) => sum.add(s), SigCurve.Point.ZERO);
			agg.assertValidity();
			return agg;
		},
		hash(messageBytes, DST) {
			abytes(messageBytes);
			const opts = DST ? { DST } : void 0;
			return SigCurve.hashToCurve(messageBytes, opts);
		},
		Signature: SignatureCoder
	};
}
function bls(CURVE) {
	const { Fp, Fr, Fp2, Fp6, Fp12 } = CURVE.fields;
	const G1_ = weierstrassPoints(CURVE.G1);
	const G1 = Object.assign(G1_, createHasher(G1_.Point, CURVE.G1.mapToCurve, {
		...CURVE.htfDefaults,
		...CURVE.G1.htfDefaults
	}));
	const G2_ = weierstrassPoints(CURVE.G2);
	const G2 = Object.assign(G2_, createHasher(G2_.Point, CURVE.G2.mapToCurve, {
		...CURVE.htfDefaults,
		...CURVE.G2.htfDefaults
	}));
	const pairingRes = createBlsPairing(CURVE.fields, G1.Point, G2.Point, {
		...CURVE.params,
		postPrecompute: CURVE.postPrecompute
	});
	const { millerLoopBatch, pairing, pairingBatch, calcPairingPrecomputes } = pairingRes;
	const longSignatures = createBlsSig(pairingRes, G1, G2, CURVE.G2.Signature, false);
	const shortSignatures = createBlsSig(pairingRes, G2, G1, CURVE.G1.ShortSignature, true);
	const rand = CURVE.randomBytes || randomBytes;
	const randomSecretKey = () => {
		const length = getMinHashLength(Fr.ORDER);
		return mapHashToField(rand(length), Fr.ORDER);
	};
	const utils = {
		randomSecretKey,
		randomPrivateKey: randomSecretKey,
		calcPairingPrecomputes
	};
	const { ShortSignature } = CURVE.G1;
	const { Signature } = CURVE.G2;
	function normP1Hash(point, htfOpts) {
		return point instanceof G1.Point ? point : shortSignatures.hash(ensureBytes("point", point), htfOpts?.DST);
	}
	function normP2Hash(point, htfOpts) {
		return point instanceof G2.Point ? point : longSignatures.hash(ensureBytes("point", point), htfOpts?.DST);
	}
	function getPublicKey(privateKey) {
		return longSignatures.getPublicKey(privateKey).toBytes(true);
	}
	function getPublicKeyForShortSignatures(privateKey) {
		return shortSignatures.getPublicKey(privateKey).toBytes(true);
	}
	function sign(message, privateKey, htfOpts) {
		const Hm = normP2Hash(message, htfOpts);
		const S = longSignatures.sign(Hm, privateKey);
		return message instanceof G2.Point ? S : Signature.toBytes(S);
	}
	function signShortSignature(message, privateKey, htfOpts) {
		const Hm = normP1Hash(message, htfOpts);
		const S = shortSignatures.sign(Hm, privateKey);
		return message instanceof G1.Point ? S : ShortSignature.toBytes(S);
	}
	function verify(signature, message, publicKey, htfOpts) {
		const Hm = normP2Hash(message, htfOpts);
		return longSignatures.verify(signature, Hm, publicKey);
	}
	function verifyShortSignature(signature, message, publicKey, htfOpts) {
		const Hm = normP1Hash(message, htfOpts);
		return shortSignatures.verify(signature, Hm, publicKey);
	}
	function aggregatePublicKeys(publicKeys) {
		const agg = longSignatures.aggregatePublicKeys(publicKeys);
		return publicKeys[0] instanceof G1.Point ? agg : agg.toBytes(true);
	}
	function aggregateSignatures(signatures) {
		const agg = longSignatures.aggregateSignatures(signatures);
		return signatures[0] instanceof G2.Point ? agg : Signature.toBytes(agg);
	}
	function aggregateShortSignatures(signatures) {
		const agg = shortSignatures.aggregateSignatures(signatures);
		return signatures[0] instanceof G1.Point ? agg : ShortSignature.toBytes(agg);
	}
	function verifyBatch(signature, messages, publicKeys, htfOpts) {
		const Hm = messages.map((m) => normP2Hash(m, htfOpts));
		return longSignatures.verifyBatch(signature, Hm, publicKeys);
	}
	G1.Point.BASE.precompute(4);
	return {
		longSignatures,
		shortSignatures,
		millerLoopBatch,
		pairing,
		pairingBatch,
		verifyBatch,
		fields: {
			Fr,
			Fp,
			Fp2,
			Fp6,
			Fp12
		},
		params: {
			ateLoopSize: CURVE.params.ateLoopSize,
			twistType: CURVE.params.twistType,
			r: CURVE.params.r,
			G1b: CURVE.G1.b,
			G2b: CURVE.G2.b
		},
		utils,
		getPublicKey,
		getPublicKeyForShortSignatures,
		sign,
		signShortSignature,
		verify,
		verifyShortSignature,
		aggregatePublicKeys,
		aggregateSignatures,
		aggregateShortSignatures,
		G1,
		G2,
		Signature,
		ShortSignature
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/tower.js
/**
* Towered extension fields.
* Rather than implementing a massive 12th-degree extension directly, it is more efficient
* to build it up from smaller extensions: a tower of extensions.
*
* For BLS12-381, the Fp12 field is implemented as a quadratic (degree two) extension,
* on top of a cubic (degree three) extension, on top of a quadratic extension of Fp.
*
* For more info: "Pairings for beginners" by Costello, section 7.3.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$3 = BigInt(0);
var _1n$3 = BigInt(1);
var _2n$3 = BigInt(2);
var _3n$1 = BigInt(3);
function calcFrobeniusCoefficients(Fp, nonResidue, modulus, degree, num = 1, divisor) {
	const _divisor = BigInt(divisor === void 0 ? degree : divisor);
	const towerModulus = modulus ** BigInt(degree);
	const res = [];
	for (let i = 0; i < num; i++) {
		const a = BigInt(i + 1);
		const powers = [];
		for (let j = 0, qPower = _1n$3; j < degree; j++) {
			const power = (a * qPower - a) / _divisor % towerModulus;
			powers.push(Fp.pow(nonResidue, power));
			qPower *= modulus;
		}
		res.push(powers);
	}
	return res;
}
function psiFrobenius(Fp, Fp2, base) {
	const PSI_X = Fp2.pow(base, (Fp.ORDER - _1n$3) / _3n$1);
	const PSI_Y = Fp2.pow(base, (Fp.ORDER - _1n$3) / _2n$3);
	function psi(x, y) {
		return [Fp2.mul(Fp2.frobeniusMap(x, 1), PSI_X), Fp2.mul(Fp2.frobeniusMap(y, 1), PSI_Y)];
	}
	const PSI2_X = Fp2.pow(base, (Fp.ORDER ** _2n$3 - _1n$3) / _3n$1);
	const PSI2_Y = Fp2.pow(base, (Fp.ORDER ** _2n$3 - _1n$3) / _2n$3);
	if (!Fp2.eql(PSI2_Y, Fp2.neg(Fp2.ONE))) throw new Error("psiFrobenius: PSI2_Y!==-1");
	function psi2(x, y) {
		return [Fp2.mul(x, PSI2_X), Fp2.neg(y)];
	}
	const mapAffine = (fn) => (c, P) => {
		const affine = P.toAffine();
		const p = fn(affine.x, affine.y);
		return c.fromAffine({
			x: p[0],
			y: p[1]
		});
	};
	return {
		psi,
		psi2,
		G2psi: mapAffine(psi),
		G2psi2: mapAffine(psi2),
		PSI_X,
		PSI_Y,
		PSI2_X,
		PSI2_Y
	};
}
var Fp2fromBigTuple = (Fp, tuple) => {
	if (tuple.length !== 2) throw new Error("invalid tuple");
	const fps = tuple.map((n) => Fp.create(n));
	return {
		c0: fps[0],
		c1: fps[1]
	};
};
var _Field2 = class {
	constructor(Fp, opts = {}) {
		this.MASK = _1n$3;
		const ORDER = Fp.ORDER;
		const FP2_ORDER = ORDER * ORDER;
		this.Fp = Fp;
		this.ORDER = FP2_ORDER;
		this.BITS = bitLen(FP2_ORDER);
		this.BYTES = Math.ceil(bitLen(FP2_ORDER) / 8);
		this.isLE = Fp.isLE;
		this.ZERO = {
			c0: Fp.ZERO,
			c1: Fp.ZERO
		};
		this.ONE = {
			c0: Fp.ONE,
			c1: Fp.ZERO
		};
		this.Fp_NONRESIDUE = Fp.create(opts.NONRESIDUE || BigInt(-1));
		this.Fp_div2 = Fp.div(Fp.ONE, _2n$3);
		this.NONRESIDUE = Fp2fromBigTuple(Fp, opts.FP2_NONRESIDUE);
		this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp, this.Fp_NONRESIDUE, Fp.ORDER, 2)[0];
		this.mulByB = opts.Fp2mulByB;
		Object.seal(this);
	}
	fromBigTuple(tuple) {
		return Fp2fromBigTuple(this.Fp, tuple);
	}
	create(num) {
		return num;
	}
	isValid({ c0, c1 }) {
		function isValidC(num, ORDER) {
			return typeof num === "bigint" && _0n$3 <= num && num < ORDER;
		}
		return isValidC(c0, this.ORDER) && isValidC(c1, this.ORDER);
	}
	is0({ c0, c1 }) {
		return this.Fp.is0(c0) && this.Fp.is0(c1);
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	eql({ c0, c1 }, { c0: r0, c1: r1 }) {
		return this.Fp.eql(c0, r0) && this.Fp.eql(c1, r1);
	}
	neg({ c0, c1 }) {
		return {
			c0: this.Fp.neg(c0),
			c1: this.Fp.neg(c1)
		};
	}
	pow(num, power) {
		return FpPow(this, num, power);
	}
	invertBatch(nums) {
		return FpInvertBatch(this, nums);
	}
	add(f1, f2) {
		const { c0, c1 } = f1;
		const { c0: r0, c1: r1 } = f2;
		return {
			c0: this.Fp.add(c0, r0),
			c1: this.Fp.add(c1, r1)
		};
	}
	sub({ c0, c1 }, { c0: r0, c1: r1 }) {
		return {
			c0: this.Fp.sub(c0, r0),
			c1: this.Fp.sub(c1, r1)
		};
	}
	mul({ c0, c1 }, rhs) {
		const { Fp } = this;
		if (typeof rhs === "bigint") return {
			c0: Fp.mul(c0, rhs),
			c1: Fp.mul(c1, rhs)
		};
		const { c0: r0, c1: r1 } = rhs;
		let t1 = Fp.mul(c0, r0);
		let t2 = Fp.mul(c1, r1);
		return {
			c0: Fp.sub(t1, t2),
			c1: Fp.sub(Fp.mul(Fp.add(c0, c1), Fp.add(r0, r1)), Fp.add(t1, t2))
		};
	}
	sqr({ c0, c1 }) {
		const { Fp } = this;
		const a = Fp.add(c0, c1);
		const b = Fp.sub(c0, c1);
		const c = Fp.add(c0, c0);
		return {
			c0: Fp.mul(a, b),
			c1: Fp.mul(c, c1)
		};
	}
	addN(a, b) {
		return this.add(a, b);
	}
	subN(a, b) {
		return this.sub(a, b);
	}
	mulN(a, b) {
		return this.mul(a, b);
	}
	sqrN(a) {
		return this.sqr(a);
	}
	div(lhs, rhs) {
		const { Fp } = this;
		return this.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : this.inv(rhs));
	}
	inv({ c0: a, c1: b }) {
		const { Fp } = this;
		const factor = Fp.inv(Fp.create(a * a + b * b));
		return {
			c0: Fp.mul(factor, Fp.create(a)),
			c1: Fp.mul(factor, Fp.create(-b))
		};
	}
	sqrt(num) {
		const { Fp } = this;
		const Fp2 = this;
		const { c0, c1 } = num;
		if (Fp.is0(c1)) {
			if (FpLegendre(Fp, c0) === 1) return Fp2.create({
				c0: Fp.sqrt(c0),
				c1: Fp.ZERO
			});
			else return Fp2.create({
				c0: Fp.ZERO,
				c1: Fp.sqrt(Fp.div(c0, this.Fp_NONRESIDUE))
			});
		}
		const a = Fp.sqrt(Fp.sub(Fp.sqr(c0), Fp.mul(Fp.sqr(c1), this.Fp_NONRESIDUE)));
		let d = Fp.mul(Fp.add(a, c0), this.Fp_div2);
		if (FpLegendre(Fp, d) === -1) d = Fp.sub(d, a);
		const a0 = Fp.sqrt(d);
		const candidateSqrt = Fp2.create({
			c0: a0,
			c1: Fp.div(Fp.mul(c1, this.Fp_div2), a0)
		});
		if (!Fp2.eql(Fp2.sqr(candidateSqrt), num)) throw new Error("Cannot find square root");
		const x1 = candidateSqrt;
		const x2 = Fp2.neg(x1);
		const { re: re1, im: im1 } = Fp2.reim(x1);
		const { re: re2, im: im2 } = Fp2.reim(x2);
		if (im1 > im2 || im1 === im2 && re1 > re2) return x1;
		return x2;
	}
	isOdd(x) {
		const { re: x0, im: x1 } = this.reim(x);
		const sign_0 = x0 % _2n$3;
		const zero_0 = x0 === _0n$3;
		const sign_1 = x1 % _2n$3;
		return BigInt(sign_0 || zero_0 && sign_1) == _1n$3;
	}
	fromBytes(b) {
		const { Fp } = this;
		if (b.length !== this.BYTES) throw new Error("fromBytes invalid length=" + b.length);
		return {
			c0: Fp.fromBytes(b.subarray(0, Fp.BYTES)),
			c1: Fp.fromBytes(b.subarray(Fp.BYTES))
		};
	}
	toBytes({ c0, c1 }) {
		return concatBytes(this.Fp.toBytes(c0), this.Fp.toBytes(c1));
	}
	cmov({ c0, c1 }, { c0: r0, c1: r1 }, c) {
		return {
			c0: this.Fp.cmov(c0, r0, c),
			c1: this.Fp.cmov(c1, r1, c)
		};
	}
	reim({ c0, c1 }) {
		return {
			re: c0,
			im: c1
		};
	}
	Fp4Square(a, b) {
		const Fp2 = this;
		const a2 = Fp2.sqr(a);
		const b2 = Fp2.sqr(b);
		return {
			first: Fp2.add(Fp2.mulByNonresidue(b2), a2),
			second: Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(a, b)), a2), b2)
		};
	}
	mulByNonresidue({ c0, c1 }) {
		return this.mul({
			c0,
			c1
		}, this.NONRESIDUE);
	}
	frobeniusMap({ c0, c1 }, power) {
		return {
			c0,
			c1: this.Fp.mul(c1, this.FROBENIUS_COEFFICIENTS[power % 2])
		};
	}
};
var _Field6 = class {
	constructor(Fp2) {
		this.MASK = _1n$3;
		this.Fp2 = Fp2;
		this.ORDER = Fp2.ORDER;
		this.BITS = 3 * Fp2.BITS;
		this.BYTES = 3 * Fp2.BYTES;
		this.isLE = Fp2.isLE;
		this.ZERO = {
			c0: Fp2.ZERO,
			c1: Fp2.ZERO,
			c2: Fp2.ZERO
		};
		this.ONE = {
			c0: Fp2.ONE,
			c1: Fp2.ZERO,
			c2: Fp2.ZERO
		};
		const { Fp } = Fp2;
		const frob = calcFrobeniusCoefficients(Fp2, Fp2.NONRESIDUE, Fp.ORDER, 6, 2, 3);
		this.FROBENIUS_COEFFICIENTS_1 = frob[0];
		this.FROBENIUS_COEFFICIENTS_2 = frob[1];
		Object.seal(this);
	}
	add({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.add(c0, r0),
			c1: Fp2.add(c1, r1),
			c2: Fp2.add(c2, r2)
		};
	}
	sub({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.sub(c0, r0),
			c1: Fp2.sub(c1, r1),
			c2: Fp2.sub(c2, r2)
		};
	}
	mul({ c0, c1, c2 }, rhs) {
		const { Fp2 } = this;
		if (typeof rhs === "bigint") return {
			c0: Fp2.mul(c0, rhs),
			c1: Fp2.mul(c1, rhs),
			c2: Fp2.mul(c2, rhs)
		};
		const { c0: r0, c1: r1, c2: r2 } = rhs;
		const t0 = Fp2.mul(c0, r0);
		const t1 = Fp2.mul(c1, r1);
		const t2 = Fp2.mul(c2, r2);
		return {
			c0: Fp2.add(t0, Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), Fp2.add(r1, r2)), Fp2.add(t1, t2)))),
			c1: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c1), Fp2.add(r0, r1)), Fp2.add(t0, t1)), Fp2.mulByNonresidue(t2)),
			c2: Fp2.sub(Fp2.add(t1, Fp2.mul(Fp2.add(c0, c2), Fp2.add(r0, r2))), Fp2.add(t0, t2))
		};
	}
	sqr({ c0, c1, c2 }) {
		const { Fp2 } = this;
		let t0 = Fp2.sqr(c0);
		let t1 = Fp2.mul(Fp2.mul(c0, c1), _2n$3);
		let t3 = Fp2.mul(Fp2.mul(c1, c2), _2n$3);
		let t4 = Fp2.sqr(c2);
		return {
			c0: Fp2.add(Fp2.mulByNonresidue(t3), t0),
			c1: Fp2.add(Fp2.mulByNonresidue(t4), t1),
			c2: Fp2.sub(Fp2.sub(Fp2.add(Fp2.add(t1, Fp2.sqr(Fp2.add(Fp2.sub(c0, c1), c2))), t3), t0), t4)
		};
	}
	addN(a, b) {
		return this.add(a, b);
	}
	subN(a, b) {
		return this.sub(a, b);
	}
	mulN(a, b) {
		return this.mul(a, b);
	}
	sqrN(a) {
		return this.sqr(a);
	}
	create(num) {
		return num;
	}
	isValid({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return Fp2.isValid(c0) && Fp2.isValid(c1) && Fp2.isValid(c2);
	}
	is0({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return Fp2.is0(c0) && Fp2.is0(c1) && Fp2.is0(c2);
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	neg({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.neg(c0),
			c1: Fp2.neg(c1),
			c2: Fp2.neg(c2)
		};
	}
	eql({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
		const { Fp2 } = this;
		return Fp2.eql(c0, r0) && Fp2.eql(c1, r1) && Fp2.eql(c2, r2);
	}
	sqrt(_) {
		return notImplemented();
	}
	div(lhs, rhs) {
		const { Fp2 } = this;
		const { Fp } = Fp2;
		return this.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : this.inv(rhs));
	}
	pow(num, power) {
		return FpPow(this, num, power);
	}
	invertBatch(nums) {
		return FpInvertBatch(this, nums);
	}
	inv({ c0, c1, c2 }) {
		const { Fp2 } = this;
		let t0 = Fp2.sub(Fp2.sqr(c0), Fp2.mulByNonresidue(Fp2.mul(c2, c1)));
		let t1 = Fp2.sub(Fp2.mulByNonresidue(Fp2.sqr(c2)), Fp2.mul(c0, c1));
		let t2 = Fp2.sub(Fp2.sqr(c1), Fp2.mul(c0, c2));
		let t4 = Fp2.inv(Fp2.add(Fp2.mulByNonresidue(Fp2.add(Fp2.mul(c2, t1), Fp2.mul(c1, t2))), Fp2.mul(c0, t0)));
		return {
			c0: Fp2.mul(t4, t0),
			c1: Fp2.mul(t4, t1),
			c2: Fp2.mul(t4, t2)
		};
	}
	fromBytes(b) {
		const { Fp2 } = this;
		if (b.length !== this.BYTES) throw new Error("fromBytes invalid length=" + b.length);
		const B2 = Fp2.BYTES;
		return {
			c0: Fp2.fromBytes(b.subarray(0, B2)),
			c1: Fp2.fromBytes(b.subarray(B2, B2 * 2)),
			c2: Fp2.fromBytes(b.subarray(2 * B2))
		};
	}
	toBytes({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return concatBytes(Fp2.toBytes(c0), Fp2.toBytes(c1), Fp2.toBytes(c2));
	}
	cmov({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c) {
		const { Fp2 } = this;
		return {
			c0: Fp2.cmov(c0, r0, c),
			c1: Fp2.cmov(c1, r1, c),
			c2: Fp2.cmov(c2, r2, c)
		};
	}
	fromBigSix(t) {
		const { Fp2 } = this;
		if (!Array.isArray(t) || t.length !== 6) throw new Error("invalid Fp6 usage");
		return {
			c0: Fp2.fromBigTuple(t.slice(0, 2)),
			c1: Fp2.fromBigTuple(t.slice(2, 4)),
			c2: Fp2.fromBigTuple(t.slice(4, 6))
		};
	}
	frobeniusMap({ c0, c1, c2 }, power) {
		const { Fp2 } = this;
		return {
			c0: Fp2.frobeniusMap(c0, power),
			c1: Fp2.mul(Fp2.frobeniusMap(c1, power), this.FROBENIUS_COEFFICIENTS_1[power % 6]),
			c2: Fp2.mul(Fp2.frobeniusMap(c2, power), this.FROBENIUS_COEFFICIENTS_2[power % 6])
		};
	}
	mulByFp2({ c0, c1, c2 }, rhs) {
		const { Fp2 } = this;
		return {
			c0: Fp2.mul(c0, rhs),
			c1: Fp2.mul(c1, rhs),
			c2: Fp2.mul(c2, rhs)
		};
	}
	mulByNonresidue({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.mulByNonresidue(c2),
			c1: c0,
			c2: c1
		};
	}
	mul1({ c0, c1, c2 }, b1) {
		const { Fp2 } = this;
		return {
			c0: Fp2.mulByNonresidue(Fp2.mul(c2, b1)),
			c1: Fp2.mul(c0, b1),
			c2: Fp2.mul(c1, b1)
		};
	}
	mul01({ c0, c1, c2 }, b0, b1) {
		const { Fp2 } = this;
		let t0 = Fp2.mul(c0, b0);
		let t1 = Fp2.mul(c1, b1);
		return {
			c0: Fp2.add(Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), b1), t1)), t0),
			c1: Fp2.sub(Fp2.sub(Fp2.mul(Fp2.add(b0, b1), Fp2.add(c0, c1)), t0), t1),
			c2: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c2), b0), t0), t1)
		};
	}
};
var _Field12 = class {
	constructor(Fp6, opts) {
		this.MASK = _1n$3;
		const { Fp2 } = Fp6;
		const { Fp } = Fp2;
		this.Fp6 = Fp6;
		this.ORDER = Fp2.ORDER;
		this.BITS = 2 * Fp6.BITS;
		this.BYTES = 2 * Fp6.BYTES;
		this.isLE = Fp6.isLE;
		this.ZERO = {
			c0: Fp6.ZERO,
			c1: Fp6.ZERO
		};
		this.ONE = {
			c0: Fp6.ONE,
			c1: Fp6.ZERO
		};
		this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp2, Fp2.NONRESIDUE, Fp.ORDER, 12, 1, 6)[0];
		this.X_LEN = opts.X_LEN;
		this.finalExponentiate = opts.Fp12finalExponentiate;
	}
	create(num) {
		return num;
	}
	isValid({ c0, c1 }) {
		const { Fp6 } = this;
		return Fp6.isValid(c0) && Fp6.isValid(c1);
	}
	is0({ c0, c1 }) {
		const { Fp6 } = this;
		return Fp6.is0(c0) && Fp6.is0(c1);
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	neg({ c0, c1 }) {
		const { Fp6 } = this;
		return {
			c0: Fp6.neg(c0),
			c1: Fp6.neg(c1)
		};
	}
	eql({ c0, c1 }, { c0: r0, c1: r1 }) {
		const { Fp6 } = this;
		return Fp6.eql(c0, r0) && Fp6.eql(c1, r1);
	}
	sqrt(_) {
		notImplemented();
	}
	inv({ c0, c1 }) {
		const { Fp6 } = this;
		let t = Fp6.inv(Fp6.sub(Fp6.sqr(c0), Fp6.mulByNonresidue(Fp6.sqr(c1))));
		return {
			c0: Fp6.mul(c0, t),
			c1: Fp6.neg(Fp6.mul(c1, t))
		};
	}
	div(lhs, rhs) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const { Fp } = Fp2;
		return this.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : this.inv(rhs));
	}
	pow(num, power) {
		return FpPow(this, num, power);
	}
	invertBatch(nums) {
		return FpInvertBatch(this, nums);
	}
	add({ c0, c1 }, { c0: r0, c1: r1 }) {
		const { Fp6 } = this;
		return {
			c0: Fp6.add(c0, r0),
			c1: Fp6.add(c1, r1)
		};
	}
	sub({ c0, c1 }, { c0: r0, c1: r1 }) {
		const { Fp6 } = this;
		return {
			c0: Fp6.sub(c0, r0),
			c1: Fp6.sub(c1, r1)
		};
	}
	mul({ c0, c1 }, rhs) {
		const { Fp6 } = this;
		if (typeof rhs === "bigint") return {
			c0: Fp6.mul(c0, rhs),
			c1: Fp6.mul(c1, rhs)
		};
		let { c0: r0, c1: r1 } = rhs;
		let t1 = Fp6.mul(c0, r0);
		let t2 = Fp6.mul(c1, r1);
		return {
			c0: Fp6.add(t1, Fp6.mulByNonresidue(t2)),
			c1: Fp6.sub(Fp6.mul(Fp6.add(c0, c1), Fp6.add(r0, r1)), Fp6.add(t1, t2))
		};
	}
	sqr({ c0, c1 }) {
		const { Fp6 } = this;
		let ab = Fp6.mul(c0, c1);
		return {
			c0: Fp6.sub(Fp6.sub(Fp6.mul(Fp6.add(Fp6.mulByNonresidue(c1), c0), Fp6.add(c0, c1)), ab), Fp6.mulByNonresidue(ab)),
			c1: Fp6.add(ab, ab)
		};
	}
	addN(a, b) {
		return this.add(a, b);
	}
	subN(a, b) {
		return this.sub(a, b);
	}
	mulN(a, b) {
		return this.mul(a, b);
	}
	sqrN(a) {
		return this.sqr(a);
	}
	fromBytes(b) {
		const { Fp6 } = this;
		if (b.length !== this.BYTES) throw new Error("fromBytes invalid length=" + b.length);
		return {
			c0: Fp6.fromBytes(b.subarray(0, Fp6.BYTES)),
			c1: Fp6.fromBytes(b.subarray(Fp6.BYTES))
		};
	}
	toBytes({ c0, c1 }) {
		const { Fp6 } = this;
		return concatBytes(Fp6.toBytes(c0), Fp6.toBytes(c1));
	}
	cmov({ c0, c1 }, { c0: r0, c1: r1 }, c) {
		const { Fp6 } = this;
		return {
			c0: Fp6.cmov(c0, r0, c),
			c1: Fp6.cmov(c1, r1, c)
		};
	}
	fromBigTwelve(t) {
		const { Fp6 } = this;
		return {
			c0: Fp6.fromBigSix(t.slice(0, 6)),
			c1: Fp6.fromBigSix(t.slice(6, 12))
		};
	}
	frobeniusMap(lhs, power) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const { c0, c1, c2 } = Fp6.frobeniusMap(lhs.c1, power);
		const coeff = this.FROBENIUS_COEFFICIENTS[power % 12];
		return {
			c0: Fp6.frobeniusMap(lhs.c0, power),
			c1: Fp6.create({
				c0: Fp2.mul(c0, coeff),
				c1: Fp2.mul(c1, coeff),
				c2: Fp2.mul(c2, coeff)
			})
		};
	}
	mulByFp2({ c0, c1 }, rhs) {
		const { Fp6 } = this;
		return {
			c0: Fp6.mulByFp2(c0, rhs),
			c1: Fp6.mulByFp2(c1, rhs)
		};
	}
	conjugate({ c0, c1 }) {
		return {
			c0,
			c1: this.Fp6.neg(c1)
		};
	}
	mul014({ c0, c1 }, o0, o1, o4) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		let t0 = Fp6.mul01(c0, o0, o1);
		let t1 = Fp6.mul1(c1, o4);
		return {
			c0: Fp6.add(Fp6.mulByNonresidue(t1), t0),
			c1: Fp6.sub(Fp6.sub(Fp6.mul01(Fp6.add(c1, c0), o0, Fp2.add(o1, o4)), t0), t1)
		};
	}
	mul034({ c0, c1 }, o0, o3, o4) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const a = Fp6.create({
			c0: Fp2.mul(c0.c0, o0),
			c1: Fp2.mul(c0.c1, o0),
			c2: Fp2.mul(c0.c2, o0)
		});
		const b = Fp6.mul01(c1, o3, o4);
		const e = Fp6.mul01(Fp6.add(c0, c1), Fp2.add(o0, o3), o4);
		return {
			c0: Fp6.add(Fp6.mulByNonresidue(b), a),
			c1: Fp6.sub(e, Fp6.add(a, b))
		};
	}
	_cyclotomicSquare({ c0, c1 }) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
		const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
		const { first: t3, second: t4 } = Fp2.Fp4Square(c0c0, c1c1);
		const { first: t5, second: t6 } = Fp2.Fp4Square(c1c0, c0c2);
		const { first: t7, second: t8 } = Fp2.Fp4Square(c0c1, c1c2);
		const t9 = Fp2.mulByNonresidue(t8);
		return {
			c0: Fp6.create({
				c0: Fp2.add(Fp2.mul(Fp2.sub(t3, c0c0), _2n$3), t3),
				c1: Fp2.add(Fp2.mul(Fp2.sub(t5, c0c1), _2n$3), t5),
				c2: Fp2.add(Fp2.mul(Fp2.sub(t7, c0c2), _2n$3), t7)
			}),
			c1: Fp6.create({
				c0: Fp2.add(Fp2.mul(Fp2.add(t9, c1c0), _2n$3), t9),
				c1: Fp2.add(Fp2.mul(Fp2.add(t4, c1c1), _2n$3), t4),
				c2: Fp2.add(Fp2.mul(Fp2.add(t6, c1c2), _2n$3), t6)
			})
		};
	}
	_cyclotomicExp(num, n) {
		let z = this.ONE;
		for (let i = this.X_LEN - 1; i >= 0; i--) {
			z = this._cyclotomicSquare(z);
			if (bitGet(n, i)) z = this.mul(z, num);
		}
		return z;
	}
};
function tower12(opts) {
	const Fp = Field(opts.ORDER);
	const Fp2 = new _Field2(Fp, opts);
	const Fp6 = new _Field6(Fp2);
	return {
		Fp,
		Fp2,
		Fp6,
		Fp12: new _Field12(Fp6, opts)
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/bls12-381.js
/**
* bls12-381 is pairing-friendly Barreto-Lynn-Scott elliptic curve construction allowing to:

* Construct zk-SNARKs at the ~120-bit security, as per [Barbulescu-Duquesne 2017](https://hal.science/hal-01534101/file/main.pdf)
* Efficiently verify N aggregate signatures with 1 pairing and N ec additions:
the Boneh-Lynn-Shacham signature scheme is orders of magnitude more efficient than Schnorr

BLS can mean 2 different things:

* Barreto-Lynn-Scott: BLS12, a Pairing Friendly Elliptic Curve
* Boneh-Lynn-Shacham: A Signature Scheme.

### Summary

1. BLS Relies on expensive bilinear pairing
2. Secret Keys: 32 bytes
3. Public Keys: 48 OR 96 bytes - big-endian x coordinate of point on G1 OR G2 curve
4. Signatures: 96 OR 48 bytes - big-endian x coordinate of point on G2 OR G1 curve
5. The 12 stands for the Embedding degree.

Modes of operation:

* Long signatures:  48-byte keys + 96-byte sigs (G1 keys + G2 sigs).
* Short signatures: 96-byte keys + 48-byte sigs (G2 keys + G1 sigs).

### Formulas

- `P = pk x G` - public keys
- `S = pk x H(m)` - signing, uses hash-to-curve on m
- `e(P, H(m)) == e(G, S)` - verification using pairings
- `e(G, S) = e(G, SUM(n)(Si)) = MUL(n)(e(G, Si))` - signature aggregation

### Curves

G1 is ordinary elliptic curve. G2 is extension field curve, think "over complex numbers".

- G1: y² = x³ + 4
- G2: y² = x³ + 4(u + 1) where u = √−1; r-order subgroup of E'(Fp²), M-type twist

### Towers

Pairing G1 + G2 produces element in Fp₁₂, 12-degree polynomial.
Fp₁₂ is usually implemented using tower of lower-degree polynomials for speed.

- Fp₁₂ = Fp₆² => Fp₂³
- Fp(u) / (u² - β) where β = -1
- Fp₂(v) / (v³ - ξ) where ξ = u + 1
- Fp₆(w) / (w² - γ) where γ = v
- Fp²[u] = Fp/u²+1
- Fp⁶[v] = Fp²/v³-1-u
- Fp¹²[w] = Fp⁶/w²-v

### Params

* Embedding degree (k): 12
* Seed is sometimes named x or t
* t = -15132376222941642752
* p = (t-1)² * (t⁴-t²+1)/3 + t
* r = t⁴-t²+1
* Ate loop size: X

To verify curve parameters, see
[pairing-friendly-curves spec](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves-11).
Basic math is done over finite fields over p.
More complicated math is done over polynominal extension fields.

### Compatibility and notes
1. It is compatible with Algorand, Chia, Dfinity, Ethereum, Filecoin, ZEC.
Filecoin uses little endian byte arrays for secret keys - make sure to reverse byte order.
2. Make sure to correctly select mode: "long signature" or "short signature".
3. Compatible with specs:
RFC 9380,
[cfrg-pairing-friendly-curves-11](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves-11),
[cfrg-bls-signature-05](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/).

*
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$2 = BigInt(0);
var _1n$2 = BigInt(1);
var _2n$2 = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var BLS_X = BigInt("0xd201000000010000");
var BLS_X_LEN = bitLen(BLS_X);
var bls12_381_CURVE_G1 = {
	p: BigInt("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab"),
	n: BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001"),
	h: BigInt("0x396c8c005555e1568c00aaab0000aaab"),
	a: _0n$2,
	b: _4n,
	Gx: BigInt("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"),
	Gy: BigInt("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1")
};
var bls12_381_Fr = Field(bls12_381_CURVE_G1.n, {
	modFromBytes: true,
	isLE: true
});
var { Fp: Fp$1, Fp2, Fp6, Fp12 } = tower12({
	ORDER: bls12_381_CURVE_G1.p,
	X_LEN: BLS_X_LEN,
	FP2_NONRESIDUE: [_1n$2, _1n$2],
	Fp2mulByB: ({ c0, c1 }) => {
		const t0 = Fp$1.mul(c0, _4n);
		const t1 = Fp$1.mul(c1, _4n);
		return {
			c0: Fp$1.sub(t0, t1),
			c1: Fp$1.add(t0, t1)
		};
	},
	Fp12finalExponentiate: (num) => {
		const x = BLS_X;
		const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
		const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
		const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x));
		const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
		const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x));
		const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x));
		const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x)), Fp12._cyclotomicSquare(t2));
		const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x));
		const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
		const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
		const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
		const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
		return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
	}
});
var { G2psi, G2psi2 } = psiFrobenius(Fp$1, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE));
/**
* Default hash_to_field / hash-to-curve for BLS.
* m: 1 for G1, 2 for G2
* k: target security level in bits
* hash: any function, e.g. BBS+ uses BLAKE2: see [github](https://github.com/hyperledger/aries-framework-go/issues/2247).
* Parameter values come from [section 8.8.2 of RFC 9380](https://www.rfc-editor.org/rfc/rfc9380#section-8.8.2).
*/
var htfDefaults = Object.freeze({
	DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
	encodeDST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
	p: Fp$1.ORDER,
	m: 2,
	k: 128,
	expand: "xmd",
	hash: sha256
});
var bls12_381_CURVE_G2 = {
	p: Fp2.ORDER,
	n: bls12_381_CURVE_G1.n,
	h: BigInt("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5"),
	a: Fp2.ZERO,
	b: Fp2.fromBigTuple([_4n, _4n]),
	Gx: Fp2.fromBigTuple([BigInt("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"), BigInt("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")]),
	Gy: Fp2.fromBigTuple([BigInt("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"), BigInt("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")])
};
var COMPZERO = setMask(Fp$1.toBytes(_0n$2), {
	infinity: true,
	compressed: true
});
function parseMask(bytes) {
	bytes = bytes.slice();
	const mask = bytes[0] & 224;
	const compressed = !!(mask >> 7 & 1);
	const infinity = !!(mask >> 6 & 1);
	const sort = !!(mask >> 5 & 1);
	bytes[0] &= 31;
	return {
		compressed,
		infinity,
		sort,
		value: bytes
	};
}
function setMask(bytes, mask) {
	if (bytes[0] & 224) throw new Error("setMask: non-empty mask");
	if (mask.compressed) bytes[0] |= 128;
	if (mask.infinity) bytes[0] |= 64;
	if (mask.sort) bytes[0] |= 32;
	return bytes;
}
function pointG1ToBytes(_c, point, isComp) {
	const { BYTES: L, ORDER: P } = Fp$1;
	const is0 = point.is0();
	const { x, y } = point.toAffine();
	if (isComp) {
		if (is0) return COMPZERO.slice();
		const sort = Boolean(y * _2n$2 / P);
		return setMask(numberToBytesBE(x, L), {
			compressed: true,
			sort
		});
	} else if (is0) return concatBytes(Uint8Array.of(64), new Uint8Array(2 * L - 1));
	else return concatBytes(numberToBytesBE(x, L), numberToBytesBE(y, L));
}
function signatureG1ToBytes(point) {
	point.assertValidity();
	const { BYTES: L, ORDER: P } = Fp$1;
	const { x, y } = point.toAffine();
	if (point.is0()) return COMPZERO.slice();
	const sort = Boolean(y * _2n$2 / P);
	return setMask(numberToBytesBE(x, L), {
		compressed: true,
		sort
	});
}
function pointG1FromBytes(bytes) {
	const { compressed, infinity, sort, value } = parseMask(bytes);
	const { BYTES: L, ORDER: P } = Fp$1;
	if (value.length === 48 && compressed) {
		const compressedValue = bytesToNumberBE(value);
		const x = Fp$1.create(compressedValue & bitMask(Fp$1.BITS));
		if (infinity) {
			if (x !== _0n$2) throw new Error("invalid G1 point: non-empty, at infinity, with compression");
			return {
				x: _0n$2,
				y: _0n$2
			};
		}
		const right = Fp$1.add(Fp$1.pow(x, _3n), Fp$1.create(bls12_381_CURVE_G1.b));
		let y = Fp$1.sqrt(right);
		if (!y) throw new Error("invalid G1 point: compressed point");
		if (y * _2n$2 / P !== BigInt(sort)) y = Fp$1.neg(y);
		return {
			x: Fp$1.create(x),
			y: Fp$1.create(y)
		};
	} else if (value.length === 96 && !compressed) {
		const x = bytesToNumberBE(value.subarray(0, L));
		const y = bytesToNumberBE(value.subarray(L));
		if (infinity) {
			if (x !== _0n$2 || y !== _0n$2) throw new Error("G1: non-empty point at infinity");
			return bls12_381.G1.Point.ZERO.toAffine();
		}
		return {
			x: Fp$1.create(x),
			y: Fp$1.create(y)
		};
	} else throw new Error("invalid G1 point: expected 48/96 bytes");
}
function signatureG1FromBytes(hex) {
	const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex, 48));
	const P = Fp$1.ORDER;
	const Point = bls12_381.G1.Point;
	const compressedValue = bytesToNumberBE(value);
	if (infinity) return Point.ZERO;
	const x = Fp$1.create(compressedValue & bitMask(Fp$1.BITS));
	const right = Fp$1.add(Fp$1.pow(x, _3n), Fp$1.create(bls12_381_CURVE_G1.b));
	let y = Fp$1.sqrt(right);
	if (!y) throw new Error("invalid G1 point: compressed");
	const aflag = BigInt(sort);
	if (y * _2n$2 / P !== aflag) y = Fp$1.neg(y);
	const point = Point.fromAffine({
		x,
		y
	});
	point.assertValidity();
	return point;
}
function pointG2ToBytes(_c, point, isComp) {
	const { BYTES: L, ORDER: P } = Fp$1;
	const is0 = point.is0();
	const { x, y } = point.toAffine();
	if (isComp) {
		if (is0) return concatBytes(COMPZERO, numberToBytesBE(_0n$2, L));
		const flag = Boolean(y.c1 === _0n$2 ? y.c0 * _2n$2 / P : y.c1 * _2n$2 / P);
		return concatBytes(setMask(numberToBytesBE(x.c1, L), {
			compressed: true,
			sort: flag
		}), numberToBytesBE(x.c0, L));
	} else {
		if (is0) return concatBytes(Uint8Array.of(64), new Uint8Array(4 * L - 1));
		const { re: x0, im: x1 } = Fp2.reim(x);
		const { re: y0, im: y1 } = Fp2.reim(y);
		return concatBytes(numberToBytesBE(x1, L), numberToBytesBE(x0, L), numberToBytesBE(y1, L), numberToBytesBE(y0, L));
	}
}
function signatureG2ToBytes(point) {
	point.assertValidity();
	const { BYTES: L } = Fp$1;
	if (point.is0()) return concatBytes(COMPZERO, numberToBytesBE(_0n$2, L));
	const { x, y } = point.toAffine();
	const { re: x0, im: x1 } = Fp2.reim(x);
	const { re: y0, im: y1 } = Fp2.reim(y);
	const tmp = y1 > _0n$2 ? y1 * _2n$2 : y0 * _2n$2;
	const sort = Boolean(tmp / Fp$1.ORDER & _1n$2);
	const z2 = x0;
	return concatBytes(setMask(numberToBytesBE(x1, L), {
		sort,
		compressed: true
	}), numberToBytesBE(z2, L));
}
function pointG2FromBytes(bytes) {
	const { BYTES: L, ORDER: P } = Fp$1;
	const { compressed, infinity, sort, value } = parseMask(bytes);
	if (!compressed && !infinity && sort || !compressed && infinity && sort || sort && infinity && compressed) throw new Error("invalid encoding flag: " + (bytes[0] & 224));
	const slc = (b, from, to) => bytesToNumberBE(b.slice(from, to));
	if (value.length === 96 && compressed) {
		if (infinity) {
			if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) throw new Error("invalid G2 point: compressed");
			return {
				x: Fp2.ZERO,
				y: Fp2.ZERO
			};
		}
		const x_1 = slc(value, 0, L);
		const x_0 = slc(value, L, 2 * L);
		const x = Fp2.create({
			c0: Fp$1.create(x_0),
			c1: Fp$1.create(x_1)
		});
		const right = Fp2.add(Fp2.pow(x, _3n), bls12_381_CURVE_G2.b);
		let y = Fp2.sqrt(right);
		const Y_bit = y.c1 === _0n$2 ? y.c0 * _2n$2 / P : y.c1 * _2n$2 / P ? _1n$2 : _0n$2;
		y = sort && Y_bit > 0 ? y : Fp2.neg(y);
		return {
			x,
			y
		};
	} else if (value.length === 192 && !compressed) {
		if (infinity) {
			if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) throw new Error("invalid G2 point: uncompressed");
			return {
				x: Fp2.ZERO,
				y: Fp2.ZERO
			};
		}
		const x1 = slc(value, 0 * L, 1 * L);
		const x0 = slc(value, 1 * L, 2 * L);
		const y1 = slc(value, 2 * L, 3 * L);
		const y0 = slc(value, 3 * L, 4 * L);
		return {
			x: Fp2.fromBigTuple([x0, x1]),
			y: Fp2.fromBigTuple([y0, y1])
		};
	} else throw new Error("invalid G2 point: expected 96/192 bytes");
}
function signatureG2FromBytes(hex) {
	const { ORDER: P } = Fp$1;
	const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex));
	const Point = bls12_381.G2.Point;
	const half = value.length / 2;
	if (half !== 48 && half !== 96) throw new Error("invalid compressed signature length, expected 96/192 bytes");
	const z1 = bytesToNumberBE(value.slice(0, half));
	const z2 = bytesToNumberBE(value.slice(half));
	if (infinity) return Point.ZERO;
	const x1 = Fp$1.create(z1 & bitMask(Fp$1.BITS));
	const x2 = Fp$1.create(z2);
	const x = Fp2.create({
		c0: x2,
		c1: x1
	});
	const y2 = Fp2.add(Fp2.pow(x, _3n), bls12_381_CURVE_G2.b);
	let y = Fp2.sqrt(y2);
	if (!y) throw new Error("Failed to find a square root");
	const { re: y0, im: y1 } = Fp2.reim(y);
	const aflag1 = BigInt(sort);
	const isGreater = y1 > _0n$2 && y1 * _2n$2 / P !== aflag1;
	const is0 = y1 === _0n$2 && y0 * _2n$2 / P !== aflag1;
	if (isGreater || is0) y = Fp2.neg(y);
	const point = Point.fromAffine({
		x,
		y
	});
	point.assertValidity();
	return point;
}
/**
* bls12-381 pairing-friendly curve.
* @example
* import { bls12_381 as bls } from '@noble/curves/bls12-381';
* // G1 keys, G2 signatures
* const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
* const message = '64726e3da8';
* const publicKey = bls.getPublicKey(privateKey);
* const signature = bls.sign(message, privateKey);
* const isValid = bls.verify(signature, message, publicKey);
*/
var bls12_381 = bls({
	fields: {
		Fp: Fp$1,
		Fp2,
		Fp6,
		Fp12,
		Fr: bls12_381_Fr
	},
	G1: {
		...bls12_381_CURVE_G1,
		Fp: Fp$1,
		htfDefaults: {
			...htfDefaults,
			m: 1,
			DST: "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_"
		},
		wrapPrivateKey: true,
		allowInfinityPoint: true,
		isTorsionFree: (c, point) => {
			const beta = BigInt("0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe");
			const phi = new c(Fp$1.mul(point.X, beta), point.Y, point.Z);
			return point.multiplyUnsafe(BLS_X).negate().multiplyUnsafe(BLS_X).equals(phi);
		},
		clearCofactor: (_c, point) => {
			return point.multiplyUnsafe(BLS_X).add(point);
		},
		mapToCurve: mapToG1,
		fromBytes: pointG1FromBytes,
		toBytes: pointG1ToBytes,
		ShortSignature: {
			fromBytes(bytes) {
				abytes(bytes);
				return signatureG1FromBytes(bytes);
			},
			fromHex(hex) {
				return signatureG1FromBytes(hex);
			},
			toBytes(point) {
				return signatureG1ToBytes(point);
			},
			toRawBytes(point) {
				return signatureG1ToBytes(point);
			},
			toHex(point) {
				return bytesToHex(signatureG1ToBytes(point));
			}
		}
	},
	G2: {
		...bls12_381_CURVE_G2,
		Fp: Fp2,
		hEff: BigInt("0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551"),
		htfDefaults: { ...htfDefaults },
		wrapPrivateKey: true,
		allowInfinityPoint: true,
		mapToCurve: mapToG2,
		isTorsionFree: (c, P) => {
			return P.multiplyUnsafe(BLS_X).negate().equals(G2psi(c, P));
		},
		clearCofactor: (c, P) => {
			const x = BLS_X;
			let t1 = P.multiplyUnsafe(x).negate();
			let t2 = G2psi(c, P);
			let t3 = P.double();
			t3 = G2psi2(c, t3);
			t3 = t3.subtract(t2);
			t2 = t1.add(t2);
			t2 = t2.multiplyUnsafe(x).negate();
			t3 = t3.add(t2);
			t3 = t3.subtract(t1);
			return t3.subtract(P);
		},
		fromBytes: pointG2FromBytes,
		toBytes: pointG2ToBytes,
		Signature: {
			fromBytes(bytes) {
				abytes(bytes);
				return signatureG2FromBytes(bytes);
			},
			fromHex(hex) {
				return signatureG2FromBytes(hex);
			},
			toBytes(point) {
				return signatureG2ToBytes(point);
			},
			toRawBytes(point) {
				return signatureG2ToBytes(point);
			},
			toHex(point) {
				return bytesToHex(signatureG2ToBytes(point));
			}
		}
	},
	params: {
		ateLoopSize: BLS_X,
		r: bls12_381_CURVE_G1.n,
		xNegative: true,
		twistType: "multiplicative"
	},
	htfDefaults,
	hash: sha256
});
var isogenyMapG2 = isogenyMap(Fp2, [
	[
		["0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6", "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6"],
		["0x0", "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a"],
		["0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e", "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d"],
		["0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1", "0x0"]
	],
	[
		["0x0", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63"],
		["0xc", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f"],
		["0x1", "0x0"]
	],
	[
		["0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706", "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706"],
		["0x0", "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be"],
		["0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c", "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f"],
		["0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10", "0x0"]
	],
	[
		["0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb"],
		["0x0", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3"],
		["0x12", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99"],
		["0x1", "0x0"]
	]
].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
var isogenyMapG1 = isogenyMap(Fp$1, [
	[
		"0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7",
		"0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb",
		"0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0",
		"0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861",
		"0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9",
		"0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983",
		"0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84",
		"0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e",
		"0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317",
		"0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e",
		"0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b",
		"0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229"
	],
	[
		"0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c",
		"0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff",
		"0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19",
		"0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8",
		"0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e",
		"0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5",
		"0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a",
		"0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e",
		"0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641",
		"0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a",
		"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
	],
	[
		"0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33",
		"0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696",
		"0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6",
		"0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb",
		"0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb",
		"0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0",
		"0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2",
		"0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29",
		"0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587",
		"0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30",
		"0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132",
		"0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e",
		"0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8",
		"0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133",
		"0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b",
		"0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604"
	],
	[
		"0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1",
		"0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d",
		"0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2",
		"0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416",
		"0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d",
		"0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac",
		"0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c",
		"0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9",
		"0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a",
		"0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55",
		"0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8",
		"0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092",
		"0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc",
		"0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7",
		"0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f",
		"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
	]
].map((i) => i.map((j) => BigInt(j))));
var G1_SWU = mapToCurveSimpleSWU(Fp$1, {
	A: Fp$1.create(BigInt("0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d")),
	B: Fp$1.create(BigInt("0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0")),
	Z: Fp$1.create(BigInt(11))
});
var G2_SWU = mapToCurveSimpleSWU(Fp2, {
	A: Fp2.create({
		c0: Fp$1.create(_0n$2),
		c1: Fp$1.create(BigInt(240))
	}),
	B: Fp2.create({
		c0: Fp$1.create(BigInt(1012)),
		c1: Fp$1.create(BigInt(1012))
	}),
	Z: Fp2.create({
		c0: Fp$1.create(BigInt(-2)),
		c1: Fp$1.create(BigInt(-1))
	})
});
function mapToG1(scalars) {
	const { x, y } = G1_SWU(Fp$1.create(scalars[0]));
	return isogenyMapG1(x, y);
}
function mapToG2(scalars) {
	const { x, y } = G2_SWU(Fp2.fromBigTuple(scalars));
	return isogenyMapG2(x, y);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/utils/bls.js
/**
*
* @param pk primary key: Uint8Array
* @param sig signature: Uint8Array
* @param msg message: Uint8Array
* @returns boolean
*/
function blsVerify(pk, sig, msg) {
	const primaryKey = typeof pk === "string" ? pk : bytesToHex(pk);
	const signature = typeof sig === "string" ? sig : bytesToHex(sig);
	const message = typeof msg === "string" ? msg : bytesToHex(msg);
	return bls12_381.verifyShortSignature(signature, message, primaryKey);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/utils/leb.js
var MILLISECOND_TO_NANOSECONDS = BigInt(1e6);
var decodeLeb128 = (buf) => {
	return lebDecode(new PipeArrayBuffer(buf));
};
var decodeTime = (buf) => {
	const timestampMs = decodeLeb128(buf) / MILLISECOND_TO_NANOSECONDS;
	return new Date(Number(timestampMs));
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/certificate.js
var MINUTES_TO_MSEC = 6e4;
var DAYS_TO_MINUTES = 1440;
var DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES = 5;
var DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE = 5;
var DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES = 30 * DAYS_TO_MINUTES;
var NodeType;
(function(NodeType) {
	NodeType[NodeType["Empty"] = 0] = "Empty";
	NodeType[NodeType["Fork"] = 1] = "Fork";
	NodeType[NodeType["Labeled"] = 2] = "Labeled";
	NodeType[NodeType["Leaf"] = 3] = "Leaf";
	NodeType[NodeType["Pruned"] = 4] = "Pruned";
})(NodeType || (NodeType = {}));
function isBufferGreaterThan(a, b) {
	for (let i = 0; i < a.length; i++) if (a[i] > b[i]) return true;
	return false;
}
var Certificate = class Certificate {
	#disableTimeVerification = false;
	#agent = void 0;
	/**
	* Create a new instance of a certificate, automatically verifying it.
	* @param {CreateCertificateOptions} options {@link CreateCertificateOptions}
	* @throws if the verification of the certificate fails
	*/
	static async create(options) {
		const cert = Certificate.createUnverified(options);
		await cert.verify();
		return cert;
	}
	static createUnverified(options) {
		return new Certificate(options.certificate, options.rootKey, options.canisterId, options.blsVerify ?? blsVerify, options.maxAgeInMinutes, options.disableTimeVerification, options.agent);
	}
	constructor(certificate, _rootKey, _canisterId, _blsVerify, _maxAgeInMinutes = DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES, disableTimeVerification = false, agent) {
		this._rootKey = _rootKey;
		this._canisterId = _canisterId;
		this._blsVerify = _blsVerify;
		this._maxAgeInMinutes = _maxAgeInMinutes;
		this.#disableTimeVerification = disableTimeVerification;
		this.cert = decode(certificate);
		if (agent && "getTimeDiffMsecs" in agent && "hasSyncedTime" in agent && "syncTime" in agent) this.#agent = agent;
	}
	/**
	* Lookup a path in the certificate tree, using {@link lookup_path}.
	* @param path The path to lookup.
	* @returns The result of the lookup.
	*/
	lookup_path(path) {
		return lookup_path(path, this.cert.tree);
	}
	/**
	* Lookup a subtree in the certificate tree, using {@link lookup_subtree}.
	* @param path The path to lookup.
	* @returns The result of the lookup.
	*/
	lookup_subtree(path) {
		return lookup_subtree(path, this.cert.tree);
	}
	async verify() {
		const rootHash = await reconstruct(this.cert.tree);
		const derKey = await this._checkDelegationAndGetKey(this.cert.delegation);
		const sig = this.cert.signature;
		const key = extractDER(derKey);
		const msg = concatBytes(domain_sep("ic-state-root"), rootHash);
		const lookupTime = lookupResultToBuffer(this.lookup_path(["time"]));
		if (!lookupTime) throw ProtocolError.fromCode(new CertificateVerificationErrorCode("Certificate does not contain a time"));
		if (!this.#disableTimeVerification) {
			const timeDiffMsecs = this.#agent?.getTimeDiffMsecs() ?? 0;
			const maxAgeInMsec = this._maxAgeInMinutes * MINUTES_TO_MSEC;
			const now = /* @__PURE__ */ new Date();
			const adjustedNow = now.getTime() + timeDiffMsecs;
			const earliestCertificateTime = adjustedNow - maxAgeInMsec;
			const latestCertificateTime = adjustedNow + DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE * MINUTES_TO_MSEC;
			const certTime = decodeTime(lookupTime);
			const isCertificateTimePast = certTime.getTime() < earliestCertificateTime;
			const isCertificateTimeFuture = certTime.getTime() > latestCertificateTime;
			if ((isCertificateTimePast || isCertificateTimeFuture) && this.#agent && !this.#agent.hasSyncedTime()) {
				await this.#agent.syncTime(this._canisterId);
				return await this.verify();
			}
			if (isCertificateTimePast) throw TrustError.fromCode(new CertificateTimeErrorCode(this._maxAgeInMinutes, certTime, now, timeDiffMsecs, "past"));
			else if (isCertificateTimeFuture) {
				if (this.#agent?.hasSyncedTime()) throw UnknownError.fromCode(new UnexpectedErrorCode("System time has been synced with the IC network, but certificate is still too far in the future."));
				throw TrustError.fromCode(new CertificateTimeErrorCode(5, certTime, now, timeDiffMsecs, "future"));
			}
		}
		try {
			if (!await this._blsVerify(key, sig, msg)) throw TrustError.fromCode(new CertificateVerificationErrorCode("Invalid signature"));
		} catch (err) {
			throw TrustError.fromCode(new CertificateVerificationErrorCode("Signature verification failed", err));
		}
	}
	async _checkDelegationAndGetKey(d) {
		if (!d) return this._rootKey;
		const cert = Certificate.createUnverified({
			certificate: d.certificate,
			rootKey: this._rootKey,
			canisterId: this._canisterId,
			blsVerify: this._blsVerify,
			disableTimeVerification: this.#disableTimeVerification,
			maxAgeInMinutes: DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES,
			agent: this.#agent
		});
		if (cert.cert.delegation) throw ProtocolError.fromCode(new CertificateHasTooManyDelegationsErrorCode());
		await cert.verify();
		const subnetIdBytes = d.subnet_id;
		const subnetId = Principal$1.fromUint8Array(subnetIdBytes);
		if (!check_canister_ranges({
			canisterId: this._canisterId,
			subnetId,
			tree: cert.cert.tree
		})) throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(this._canisterId, subnetId));
		const publicKeyLookup = lookupResultToBuffer(cert.lookup_path([
			"subnet",
			subnetIdBytes,
			"public_key"
		]));
		if (!publicKeyLookup) throw TrustError.fromCode(new MissingLookupValueErrorCode(`Could not find subnet key for subnet ID ${subnetId.toText()}`));
		return publicKeyLookup;
	}
};
var DER_PREFIX = hexToBytes("308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100");
var KEY_LENGTH = 96;
function extractDER(buf) {
	const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
	if (buf.byteLength !== expectedLength) throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(expectedLength, buf.byteLength));
	const prefix = buf.slice(0, DER_PREFIX.byteLength);
	if (!uint8Equals(prefix, DER_PREFIX)) throw ProtocolError.fromCode(new DerPrefixMismatchErrorCode(DER_PREFIX, prefix));
	return buf.slice(DER_PREFIX.byteLength);
}
/**
* Utility function to constrain the type of a lookup result
* @param result the result of a lookup
* @returns {Uint8Array | undefined} the value if the lookup was found, `undefined` otherwise
*/
function lookupResultToBuffer(result) {
	if (result.status !== LookupPathStatus.Found) return;
	if (result.value instanceof Uint8Array) return result.value;
}
/**
* @param t The hash tree to reconstruct
*/
async function reconstruct(t) {
	switch (t[0]) {
		case NodeType.Empty: return sha256(domain_sep("ic-hashtree-empty"));
		case NodeType.Pruned: return t[1];
		case NodeType.Leaf: return sha256(concatBytes(domain_sep("ic-hashtree-leaf"), t[1]));
		case NodeType.Labeled: return sha256(concatBytes(domain_sep("ic-hashtree-labeled"), t[1], await reconstruct(t[2])));
		case NodeType.Fork: return sha256(concatBytes(domain_sep("ic-hashtree-fork"), await reconstruct(t[1]), await reconstruct(t[2])));
		default: throw UNREACHABLE_ERROR;
	}
}
/**
* Creates a domain separator for hashing by encoding the input string
* with its length as a prefix.
* @param s - The input string to encode.
* @returns A Uint8Array containing the encoded domain separator.
*/
function domain_sep(s) {
	return concatBytes(new Uint8Array([s.length]), new TextEncoder().encode(s));
}
function pathToLabel(path) {
	return typeof path[0] === "string" ? utf8ToBytes(path[0]) : path[0];
}
var LookupPathStatus;
(function(LookupPathStatus) {
	LookupPathStatus["Unknown"] = "Unknown";
	LookupPathStatus["Absent"] = "Absent";
	LookupPathStatus["Found"] = "Found";
	LookupPathStatus["Error"] = "Error";
})(LookupPathStatus || (LookupPathStatus = {}));
var LookupSubtreeStatus;
(function(LookupSubtreeStatus) {
	LookupSubtreeStatus["Absent"] = "Absent";
	LookupSubtreeStatus["Unknown"] = "Unknown";
	LookupSubtreeStatus["Found"] = "Found";
})(LookupSubtreeStatus || (LookupSubtreeStatus = {}));
var LookupLabelStatus;
(function(LookupLabelStatus) {
	LookupLabelStatus["Absent"] = "Absent";
	LookupLabelStatus["Unknown"] = "Unknown";
	LookupLabelStatus["Found"] = "Found";
	LookupLabelStatus["Less"] = "Less";
	LookupLabelStatus["Greater"] = "Greater";
})(LookupLabelStatus || (LookupLabelStatus = {}));
/**
* Lookup a path in a tree. If the path is a subtree, use {@link lookup_subtree} instead.
* @param path the path to look up
* @param tree the tree to search
* @returns {LookupResult} the result of the lookup
*/
function lookup_path(path, tree) {
	if (path.length === 0) switch (tree[0]) {
		case NodeType.Empty: return { status: LookupPathStatus.Absent };
		case NodeType.Leaf:
			if (!tree[1]) throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for leaf"));
			if (tree[1] instanceof Uint8Array) return {
				status: LookupPathStatus.Found,
				value: tree[1].slice(tree[1].byteOffset, tree[1].byteLength + tree[1].byteOffset)
			};
			throw UNREACHABLE_ERROR;
		case NodeType.Pruned: return { status: LookupPathStatus.Unknown };
		case NodeType.Labeled:
		case NodeType.Fork: return { status: LookupPathStatus.Error };
		default: throw UNREACHABLE_ERROR;
	}
	const lookupResult = find_label(pathToLabel(path), tree);
	switch (lookupResult.status) {
		case LookupLabelStatus.Found: return lookup_path(path.slice(1), lookupResult.value);
		case LookupLabelStatus.Absent:
		case LookupLabelStatus.Greater:
		case LookupLabelStatus.Less: return { status: LookupPathStatus.Absent };
		case LookupLabelStatus.Unknown: return { status: LookupPathStatus.Unknown };
		default: throw UNREACHABLE_ERROR;
	}
}
/**
* Lookup a subtree in a tree.
* @param path the path to look up
* @param tree the tree to search
* @returns {SubtreeLookupResult} the result of the lookup
*/
function lookup_subtree(path, tree) {
	if (path.length === 0) return {
		status: LookupSubtreeStatus.Found,
		value: tree
	};
	const lookupResult = find_label(pathToLabel(path), tree);
	switch (lookupResult.status) {
		case LookupLabelStatus.Found: return lookup_subtree(path.slice(1), lookupResult.value);
		case LookupLabelStatus.Unknown: return { status: LookupSubtreeStatus.Unknown };
		case LookupLabelStatus.Absent:
		case LookupLabelStatus.Greater:
		case LookupLabelStatus.Less: return { status: LookupSubtreeStatus.Absent };
		default: throw UNREACHABLE_ERROR;
	}
}
/**
* If the tree is a fork, flatten it into an array of trees
* @param {HashTree} t the tree to flatten
* @returns {HashTree[]} the flattened tree
*/
function flatten_forks(t) {
	switch (t[0]) {
		case NodeType.Empty: return [];
		case NodeType.Fork: return flatten_forks(t[1]).concat(flatten_forks(t[2]));
		default: return [t];
	}
}
/**
* Find a label in a tree
* @param label the label to find
* @param tree the tree to search
* @returns {LabelLookupResult} the result of the label lookup
*/
function find_label(label, tree) {
	switch (tree[0]) {
		case NodeType.Labeled:
			if (isBufferGreaterThan(label, tree[1])) return { status: LookupLabelStatus.Greater };
			if (uint8Equals(label, tree[1])) return {
				status: LookupLabelStatus.Found,
				value: tree[2]
			};
			return { status: LookupLabelStatus.Less };
		case NodeType.Fork: {
			const leftLookupResult = find_label(label, tree[1]);
			switch (leftLookupResult.status) {
				case LookupLabelStatus.Greater: {
					const rightLookupResult = find_label(label, tree[2]);
					if (rightLookupResult.status === LookupLabelStatus.Less) return { status: LookupLabelStatus.Absent };
					return rightLookupResult;
				}
				case LookupLabelStatus.Unknown: {
					const rightLookupResult = find_label(label, tree[2]);
					if (rightLookupResult.status === LookupLabelStatus.Less) return { status: LookupLabelStatus.Unknown };
					return rightLookupResult;
				}
				default: return leftLookupResult;
			}
		}
		case NodeType.Pruned: return { status: LookupLabelStatus.Unknown };
		default: return { status: LookupLabelStatus.Absent };
	}
}
/**
* Check if a canister ID falls within the canister ranges of a given subnet
* @param params the parameters with which to check the canister ranges
* @param params.canisterId the canister ID to check
* @param params.subnetId the subnet ID from which to check the canister ranges
* @param params.tree the hash tree in which to lookup the subnet's canister ranges
* @returns {boolean} `true` if the canister is in the range, `false` otherwise
*/
function check_canister_ranges(params) {
	const { canisterId, subnetId, tree } = params;
	const rangeLookup = lookup_path([
		"subnet",
		subnetId.toUint8Array(),
		"canister_ranges"
	], tree);
	if (rangeLookup.status !== LookupPathStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode(`Could not find canister ranges for subnet ${subnetId.toText()}`, rangeLookup.status));
	if (!(rangeLookup.value instanceof Uint8Array)) throw ProtocolError.fromCode(new MalformedLookupFoundValueErrorCode(`Could not find canister ranges for subnet ${subnetId.toText()}`));
	return decode(rangeLookup.value).map((v) => [Principal$1.fromUint8Array(v[0]), Principal$1.fromUint8Array(v[1])]).some((r) => r[0].ltEq(canisterId) && r[1].gtEq(canisterId));
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js
/**
* Requests information from a canister's `read_state` endpoint.
* Can be used to request information about the canister's controllers, time, module hash, candid interface, and more.
* @param {CanisterStatusOptions} options The configuration for the canister status request.
* @see {@link CanisterStatusOptions} for detailed options.
* @returns {Promise<StatusMap>} A map populated with data from the requested paths. Each path is a key in the map, and the value is the data obtained from the certificate for that path.
* @example
* const status = await canisterStatus({
*   paths: ['controllers', 'candid'],
*   ...options
* });
*
* const controllers = status.get('controllers');
*/
var request = async (options) => {
	const { agent, paths, disableCertificateTimeVerification = false } = options;
	const canisterId = Principal$1.from(options.canisterId);
	const uniquePaths = [...new Set(paths)];
	const status = /* @__PURE__ */ new Map();
	const promises = uniquePaths.map((path, index) => {
		const encodedPath = encodePath(path, canisterId);
		return (async () => {
			try {
				if (agent.rootKey === null) throw ExternalError.fromCode(new MissingRootKeyErrorCode());
				const rootKey = agent.rootKey;
				const response = await agent.readState(canisterId, { paths: [encodedPath] });
				const certificate = await Certificate.create({
					certificate: response.certificate,
					rootKey,
					canisterId,
					disableTimeVerification: disableCertificateTimeVerification,
					agent
				});
				const lookup = (cert, path) => {
					if (path === "subnet") return {
						path,
						data: fetchNodeKeys(response.certificate, canisterId, rootKey)
					};
					else return {
						path,
						data: lookupResultToBuffer(cert.lookup_path(encodedPath))
					};
				};
				const { path, data } = lookup(certificate, uniquePaths[index]);
				if (!data) {
					console.warn(`Expected to find result for path ${path}, but instead found nothing.`);
					if (typeof path === "string") status.set(path, null);
					else status.set(path.key, null);
				} else switch (path) {
					case "time":
						status.set(path, decodeTime(data));
						break;
					case "controllers":
						status.set(path, decodeControllers(data));
						break;
					case "module_hash":
						status.set(path, bytesToHex(data));
						break;
					case "subnet":
						status.set(path, data);
						break;
					case "candid":
						status.set(path, new TextDecoder().decode(data));
						break;
					default: if (typeof path !== "string" && "key" in path && "path" in path) switch (path.decodeStrategy) {
						case "raw":
							status.set(path.key, data);
							break;
						case "leb128":
							status.set(path.key, decodeLeb128(data));
							break;
						case "cbor":
							status.set(path.key, decode(data));
							break;
						case "hex":
							status.set(path.key, bytesToHex(data));
							break;
						case "utf-8": status.set(path.key, new TextDecoder().decode(data));
					}
				}
			} catch (error) {
				if (error instanceof AgentError && (error.hasCode(CertificateVerificationErrorCode) || error.hasCode(CertificateTimeErrorCode))) throw error;
				if (typeof path !== "string" && "key" in path && "path" in path) status.set(path.key, null);
				else status.set(path, null);
				console.group();
				console.warn(`Expected to find result for path ${path}, but instead found nothing.`);
				console.warn(error);
				console.groupEnd();
			}
		})();
	});
	await Promise.all(promises);
	return status;
};
var fetchNodeKeys = (certificate, canisterId, root_key) => {
	if (!canisterId._isPrincipal) throw InputError.fromCode(new UnexpectedErrorCode("Invalid canisterId"));
	const cert = decode(certificate);
	const tree = cert.tree;
	let delegation = cert.delegation;
	let subnetId;
	if (delegation && delegation.subnet_id) subnetId = Principal$1.fromUint8Array(new Uint8Array(delegation.subnet_id));
	else if (!delegation && typeof root_key !== "undefined") {
		subnetId = Principal$1.selfAuthenticating(new Uint8Array(root_key));
		delegation = {
			subnet_id: subnetId.toUint8Array(),
			certificate: /* @__PURE__ */ new Uint8Array(0)
		};
	} else {
		subnetId = Principal$1.selfAuthenticating(Principal$1.fromText("tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe").toUint8Array());
		delegation = {
			subnet_id: subnetId.toUint8Array(),
			certificate: /* @__PURE__ */ new Uint8Array(0)
		};
	}
	if (!check_canister_ranges({
		canisterId,
		subnetId,
		tree
	})) throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(canisterId, subnetId));
	const subnetLookupResult = lookup_subtree([
		"subnet",
		delegation.subnet_id,
		"node"
	], tree);
	if (subnetLookupResult.status !== LookupSubtreeStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode("Node not found", subnetLookupResult.status));
	if (subnetLookupResult.value instanceof Uint8Array) throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid node tree"));
	const nodeForks = flatten_forks(subnetLookupResult.value);
	const nodeKeys = /* @__PURE__ */ new Map();
	nodeForks.forEach((fork) => {
		const node_id = Principal$1.from(fork[1]).toText();
		const publicKeyLookupResult = lookup_path(["public_key"], fork[2]);
		if (publicKeyLookupResult.status !== LookupPathStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode("Public key not found", publicKeyLookupResult.status));
		const derEncodedPublicKey = publicKeyLookupResult.value;
		if (derEncodedPublicKey.byteLength !== 44) throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(44, derEncodedPublicKey.byteLength));
		else nodeKeys.set(node_id, derEncodedPublicKey);
	});
	return {
		subnetId: Principal$1.fromUint8Array(new Uint8Array(delegation.subnet_id)).toText(),
		nodeKeys
	};
};
var encodePath = (path, canisterId) => {
	const canisterUint8Array = canisterId.toUint8Array();
	switch (path) {
		case "time": return [utf8ToBytes("time")];
		case "controllers": return [
			utf8ToBytes("canister"),
			canisterUint8Array,
			utf8ToBytes("controllers")
		];
		case "module_hash": return [
			utf8ToBytes("canister"),
			canisterUint8Array,
			utf8ToBytes("module_hash")
		];
		case "subnet": return [utf8ToBytes("subnet")];
		case "candid": return [
			utf8ToBytes("canister"),
			canisterUint8Array,
			utf8ToBytes("metadata"),
			utf8ToBytes("candid:service")
		];
		default: if ("key" in path && "path" in path) {
			if (typeof path["path"] === "string" || path["path"] instanceof Uint8Array) {
				const metaPath = path.path;
				const encoded = typeof metaPath === "string" ? utf8ToBytes(metaPath) : metaPath;
				return [
					utf8ToBytes("canister"),
					canisterUint8Array,
					utf8ToBytes("metadata"),
					encoded
				];
			} else return path["path"];
		}
	}
	throw UnknownError.fromCode(new UnexpectedErrorCode(`Error while encoding your path for canister status. Please ensure that your path ${path} was formatted correctly.`));
};
var decodeControllers = (buf) => {
	return decode(buf).map((buf) => {
		return Principal$1.fromUint8Array(buf);
	});
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/edwards.js
/**
* Twisted Edwards curve. The formula is: ax² + y² = 1 + dx²y².
* For design rationale of types / exports, see weierstrass module documentation.
* Untwisted Edwards curves exist, but they aren't used in real-world protocols.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$1 = BigInt(0);
var _1n$1 = BigInt(1);
var _2n$1 = BigInt(2);
var _8n$1 = BigInt(8);
function isEdValidXY(Fp, CURVE, x, y) {
	const x2 = Fp.sqr(x);
	const y2 = Fp.sqr(y);
	const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
	const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
	return Fp.eql(left, right);
}
function edwards(params, extraOpts = {}) {
	const validated = _createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
	const { Fp, Fn } = validated;
	let CURVE = validated.CURVE;
	const { h: cofactor } = CURVE;
	_validateObject(extraOpts, {}, { uvRatio: "function" });
	const MASK = _2n$1 << BigInt(Fn.BYTES * 8) - _1n$1;
	const modP = (n) => Fp.create(n);
	const uvRatio = extraOpts.uvRatio || ((u, v) => {
		try {
			return {
				isValid: true,
				value: Fp.sqrt(Fp.div(u, v))
			};
		} catch (e) {
			return {
				isValid: false,
				value: _0n$1
			};
		}
	});
	if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	/**
	* Asserts coordinate is valid: 0 <= n < MASK.
	* Coordinates >= Fp.ORDER are allowed for zip215.
	*/
	function acoord(title, n, banZero = false) {
		const min = banZero ? _1n$1 : _0n$1;
		aInRange("coordinate " + title, n, min, MASK);
		return n;
	}
	function aextpoint(other) {
		if (!(other instanceof Point)) throw new Error("ExtendedPoint expected");
	}
	const toAffineMemo = memoized((p, iz) => {
		const { X, Y, Z } = p;
		const is0 = p.is0();
		if (iz == null) iz = is0 ? _8n$1 : Fp.inv(Z);
		const x = modP(X * iz);
		const y = modP(Y * iz);
		const zz = Fp.mul(Z, iz);
		if (is0) return {
			x: _0n$1,
			y: _1n$1
		};
		if (zz !== _1n$1) throw new Error("invZ was invalid");
		return {
			x,
			y
		};
	});
	const assertValidMemo = memoized((p) => {
		const { a, d } = CURVE;
		if (p.is0()) throw new Error("bad point: ZERO");
		const { X, Y, Z, T } = p;
		const X2 = modP(X * X);
		const Y2 = modP(Y * Y);
		const Z2 = modP(Z * Z);
		const Z4 = modP(Z2 * Z2);
		const aX2 = modP(X2 * a);
		if (modP(Z2 * modP(aX2 + Y2)) !== modP(Z4 + modP(d * modP(X2 * Y2)))) throw new Error("bad point: equation left != right (1)");
		if (modP(X * Y) !== modP(Z * T)) throw new Error("bad point: equation left != right (2)");
		return true;
	});
	class Point {
		constructor(X, Y, Z, T) {
			this.X = acoord("x", X);
			this.Y = acoord("y", Y);
			this.Z = acoord("z", Z, true);
			this.T = acoord("t", T);
			Object.freeze(this);
		}
		static CURVE() {
			return CURVE;
		}
		static fromAffine(p) {
			if (p instanceof Point) throw new Error("extended point not allowed");
			const { x, y } = p || {};
			acoord("x", x);
			acoord("y", y);
			return new Point(x, y, _1n$1, modP(x * y));
		}
		static fromBytes(bytes, zip215 = false) {
			const len = Fp.BYTES;
			const { a, d } = CURVE;
			bytes = copyBytes(_abytes2(bytes, len, "point"));
			_abool2(zip215, "zip215");
			const normed = copyBytes(bytes);
			const lastByte = bytes[len - 1];
			normed[len - 1] = lastByte & -129;
			const y = bytesToNumberLE(normed);
			aInRange("point.y", y, _0n$1, zip215 ? MASK : Fp.ORDER);
			const y2 = modP(y * y);
			const u = modP(y2 - _1n$1);
			const v = modP(d * y2 - a);
			let { isValid, value: x } = uvRatio(u, v);
			if (!isValid) throw new Error("bad point: invalid y coordinate");
			const isXOdd = (x & _1n$1) === _1n$1;
			const isLastByteOdd = (lastByte & 128) !== 0;
			if (!zip215 && x === _0n$1 && isLastByteOdd) throw new Error("bad point: x=0 and x_0=1");
			if (isLastByteOdd !== isXOdd) x = modP(-x);
			return Point.fromAffine({
				x,
				y
			});
		}
		static fromHex(bytes, zip215 = false) {
			return Point.fromBytes(ensureBytes("point", bytes), zip215);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(windowSize = 8, isLazy = true) {
			wnaf.createCache(this, windowSize);
			if (!isLazy) this.multiply(_2n$1);
			return this;
		}
		assertValidity() {
			assertValidMemo(this);
		}
		equals(other) {
			aextpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			const X1Z2 = modP(X1 * Z2);
			const X2Z1 = modP(X2 * Z1);
			const Y1Z2 = modP(Y1 * Z2);
			const Y2Z1 = modP(Y2 * Z1);
			return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		negate() {
			return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
		}
		double() {
			const { a } = CURVE;
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const A = modP(X1 * X1);
			const B = modP(Y1 * Y1);
			const C = modP(_2n$1 * modP(Z1 * Z1));
			const D = modP(a * A);
			const x1y1 = X1 + Y1;
			const E = modP(modP(x1y1 * x1y1) - A - B);
			const G = D + B;
			const F = G - C;
			const H = D - B;
			const X3 = modP(E * F);
			const Y3 = modP(G * H);
			const T3 = modP(E * H);
			const Z3 = modP(F * G);
			return new Point(X3, Y3, Z3, T3);
		}
		add(other) {
			aextpoint(other);
			const { a, d } = CURVE;
			const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
			const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
			const A = modP(X1 * X2);
			const B = modP(Y1 * Y2);
			const C = modP(T1 * d * T2);
			const D = modP(Z1 * Z2);
			const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
			const F = D - C;
			const G = D + C;
			const H = modP(B - a * A);
			const X3 = modP(E * F);
			const Y3 = modP(G * H);
			const T3 = modP(E * H);
			const Z3 = modP(F * G);
			return new Point(X3, Y3, Z3, T3);
		}
		subtract(other) {
			return this.add(other.negate());
		}
		multiply(scalar) {
			if (!Fn.isValidNot0(scalar)) throw new Error("invalid scalar: expected 1 <= sc < curve.n");
			const { p, f } = wnaf.cached(this, scalar, (p) => normalizeZ(Point, p));
			return normalizeZ(Point, [p, f])[0];
		}
		multiplyUnsafe(scalar, acc = Point.ZERO) {
			if (!Fn.isValid(scalar)) throw new Error("invalid scalar: expected 0 <= sc < curve.n");
			if (scalar === _0n$1) return Point.ZERO;
			if (this.is0() || scalar === _1n$1) return this;
			return wnaf.unsafe(this, scalar, (p) => normalizeZ(Point, p), acc);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(cofactor).is0();
		}
		isTorsionFree() {
			return wnaf.unsafe(this, CURVE.n).is0();
		}
		toAffine(invertedZ) {
			return toAffineMemo(this, invertedZ);
		}
		clearCofactor() {
			if (cofactor === _1n$1) return this;
			return this.multiplyUnsafe(cofactor);
		}
		toBytes() {
			const { x, y } = this.toAffine();
			const bytes = Fp.toBytes(y);
			bytes[bytes.length - 1] |= x & _1n$1 ? 128 : 0;
			return bytes;
		}
		toHex() {
			return bytesToHex(this.toBytes());
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
		get ex() {
			return this.X;
		}
		get ey() {
			return this.Y;
		}
		get ez() {
			return this.Z;
		}
		get et() {
			return this.T;
		}
		static normalizeZ(points) {
			return normalizeZ(Point, points);
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		_setWindowSize(windowSize) {
			this.precompute(windowSize);
		}
		toRawBytes() {
			return this.toBytes();
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n$1, modP(CURVE.Gx * CURVE.Gy));
	Point.ZERO = new Point(_0n$1, _1n$1, _1n$1, _0n$1);
	Point.Fp = Fp;
	Point.Fn = Fn;
	const wnaf = new wNAF(Point, Fn.BITS);
	Point.BASE.precompute(8);
	return Point;
}
/**
* Base class for prime-order points like Ristretto255 and Decaf448.
* These points eliminate cofactor issues by representing equivalence classes
* of Edwards curve points.
*/
var PrimeEdwardsPoint = class {
	constructor(ep) {
		this.ep = ep;
	}
	static fromBytes(_bytes) {
		notImplemented();
	}
	static fromHex(_hex) {
		notImplemented();
	}
	get x() {
		return this.toAffine().x;
	}
	get y() {
		return this.toAffine().y;
	}
	clearCofactor() {
		return this;
	}
	assertValidity() {
		this.ep.assertValidity();
	}
	toAffine(invertedZ) {
		return this.ep.toAffine(invertedZ);
	}
	toHex() {
		return bytesToHex(this.toBytes());
	}
	toString() {
		return this.toHex();
	}
	isTorsionFree() {
		return true;
	}
	isSmallOrder() {
		return false;
	}
	add(other) {
		this.assertSame(other);
		return this.init(this.ep.add(other.ep));
	}
	subtract(other) {
		this.assertSame(other);
		return this.init(this.ep.subtract(other.ep));
	}
	multiply(scalar) {
		return this.init(this.ep.multiply(scalar));
	}
	multiplyUnsafe(scalar) {
		return this.init(this.ep.multiplyUnsafe(scalar));
	}
	double() {
		return this.init(this.ep.double());
	}
	negate() {
		return this.init(this.ep.negate());
	}
	precompute(windowSize, isLazy) {
		return this.init(this.ep.precompute(windowSize, isLazy));
	}
	/** @deprecated use `toBytes` */
	toRawBytes() {
		return this.toBytes();
	}
};
/**
* Initializes EdDSA signatures over given Edwards curve.
*/
function eddsa(Point, cHash, eddsaOpts = {}) {
	if (typeof cHash !== "function") throw new Error("\"hash\" function param is required");
	_validateObject(eddsaOpts, {}, {
		adjustScalarBytes: "function",
		randomBytes: "function",
		domain: "function",
		prehash: "function",
		mapToCurve: "function"
	});
	const { prehash } = eddsaOpts;
	const { BASE, Fp, Fn } = Point;
	const randomBytes$1 = eddsaOpts.randomBytes || randomBytes;
	const adjustScalarBytes = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
	const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
		_abool2(phflag, "phflag");
		if (ctx.length || phflag) throw new Error("Contexts/pre-hash are not supported");
		return data;
	});
	function modN_LE(hash) {
		return Fn.create(bytesToNumberLE(hash));
	}
	function getPrivateScalar(key) {
		const len = lengths.secretKey;
		key = ensureBytes("private key", key, len);
		const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
		const head = adjustScalarBytes(hashed.slice(0, len));
		return {
			head,
			prefix: hashed.slice(len, 2 * len),
			scalar: modN_LE(head)
		};
	}
	/** Convenience method that creates public key from scalar. RFC8032 5.1.5 */
	function getExtendedPublicKey(secretKey) {
		const { head, prefix, scalar } = getPrivateScalar(secretKey);
		const point = BASE.multiply(scalar);
		return {
			head,
			prefix,
			scalar,
			point,
			pointBytes: point.toBytes()
		};
	}
	/** Calculates EdDSA pub key. RFC8032 5.1.5. */
	function getPublicKey(secretKey) {
		return getExtendedPublicKey(secretKey).pointBytes;
	}
	function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
		const msg = concatBytes(...msgs);
		return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
	}
	/** Signs message with privateKey. RFC8032 5.1.6 */
	function sign(msg, secretKey, options = {}) {
		msg = ensureBytes("message", msg);
		if (prehash) msg = prehash(msg);
		const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
		const r = hashDomainToScalar(options.context, prefix, msg);
		const R = BASE.multiply(r).toBytes();
		const k = hashDomainToScalar(options.context, R, pointBytes, msg);
		const s = Fn.create(r + k * scalar);
		if (!Fn.isValid(s)) throw new Error("sign failed: invalid s");
		return _abytes2(concatBytes(R, Fn.toBytes(s)), lengths.signature, "result");
	}
	const verifyOpts = { zip215: true };
	/**
	* Verifies EdDSA signature against message and public key. RFC8032 5.1.7.
	* An extended group equation is checked.
	*/
	function verify(sig, msg, publicKey, options = verifyOpts) {
		const { context, zip215 } = options;
		const len = lengths.signature;
		sig = ensureBytes("signature", sig, len);
		msg = ensureBytes("message", msg);
		publicKey = ensureBytes("publicKey", publicKey, lengths.publicKey);
		if (zip215 !== void 0) _abool2(zip215, "zip215");
		if (prehash) msg = prehash(msg);
		const mid = len / 2;
		const r = sig.subarray(0, mid);
		const s = bytesToNumberLE(sig.subarray(mid, len));
		let A, R, SB;
		try {
			A = Point.fromBytes(publicKey, zip215);
			R = Point.fromBytes(r, zip215);
			SB = BASE.multiplyUnsafe(s);
		} catch (error) {
			return false;
		}
		if (!zip215 && A.isSmallOrder()) return false;
		const k = hashDomainToScalar(context, R.toBytes(), A.toBytes(), msg);
		return R.add(A.multiplyUnsafe(k)).subtract(SB).clearCofactor().is0();
	}
	const _size = Fp.BYTES;
	const lengths = {
		secretKey: _size,
		publicKey: _size,
		signature: 2 * _size,
		seed: _size
	};
	function randomSecretKey(seed = randomBytes$1(lengths.seed)) {
		return _abytes2(seed, lengths.seed, "seed");
	}
	function keygen(seed) {
		const secretKey = utils.randomSecretKey(seed);
		return {
			secretKey,
			publicKey: getPublicKey(secretKey)
		};
	}
	function isValidSecretKey(key) {
		return isBytes(key) && key.length === Fn.BYTES;
	}
	function isValidPublicKey(key, zip215) {
		try {
			return !!Point.fromBytes(key, zip215);
		} catch (error) {
			return false;
		}
	}
	const utils = {
		getExtendedPublicKey,
		randomSecretKey,
		isValidSecretKey,
		isValidPublicKey,
		/**
		* Converts ed public key to x public key. Uses formula:
		* - ed25519:
		*   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
		*   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
		* - ed448:
		*   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
		*   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
		*/
		toMontgomery(publicKey) {
			const { y } = Point.fromBytes(publicKey);
			const size = lengths.publicKey;
			const is25519 = size === 32;
			if (!is25519 && size !== 57) throw new Error("only defined for 25519 and 448");
			const u = is25519 ? Fp.div(_1n$1 + y, _1n$1 - y) : Fp.div(y - _1n$1, y + _1n$1);
			return Fp.toBytes(u);
		},
		toMontgomerySecret(secretKey) {
			const size = lengths.secretKey;
			_abytes2(secretKey, size);
			const hashed = cHash(secretKey.subarray(0, size));
			return adjustScalarBytes(hashed).subarray(0, size);
		},
		/** @deprecated */
		randomPrivateKey: randomSecretKey,
		/** @deprecated */
		precompute(windowSize = 8, point = Point.BASE) {
			return point.precompute(windowSize, false);
		}
	};
	return Object.freeze({
		keygen,
		getPublicKey,
		sign,
		verify,
		utils,
		Point,
		lengths
	});
}
function _eddsa_legacy_opts_to_new(c) {
	const CURVE = {
		a: c.a,
		d: c.d,
		p: c.Fp.ORDER,
		n: c.n,
		h: c.h,
		Gx: c.Gx,
		Gy: c.Gy
	};
	const curveOpts = {
		Fp: c.Fp,
		Fn: Field(CURVE.n, c.nBitLength, true),
		uvRatio: c.uvRatio
	};
	const eddsaOpts = {
		randomBytes: c.randomBytes,
		adjustScalarBytes: c.adjustScalarBytes,
		domain: c.domain,
		prehash: c.prehash,
		mapToCurve: c.mapToCurve
	};
	return {
		CURVE,
		curveOpts,
		hash: c.hash,
		eddsaOpts
	};
}
function _eddsa_new_output_to_legacy(c, eddsa) {
	const Point = eddsa.Point;
	return Object.assign({}, eddsa, {
		ExtendedPoint: Point,
		CURVE: c,
		nBitLength: Point.Fn.BITS,
		nByteLength: Point.Fn.BYTES
	});
}
function twistedEdwards(c) {
	const { CURVE, curveOpts, hash, eddsaOpts } = _eddsa_legacy_opts_to_new(c);
	return _eddsa_new_output_to_legacy(c, eddsa(edwards(CURVE, curveOpts), hash, eddsaOpts));
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/ed25519.js
/**
* ed25519 Twisted Edwards curve with following addons:
* - X25519 ECDH
* - Ristretto cofactor elimination
* - Elligator hash-to-group / point indistinguishability
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _5n = BigInt(5);
var _8n = BigInt(8);
var ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
var ed25519_CURVE = /* @__PURE__ */ (() => ({
	p: ed25519_CURVE_p,
	n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
	h: _8n,
	a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
	d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
	Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
	Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
}))();
function ed25519_pow_2_252_3(x) {
	const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
	const P = ed25519_CURVE_p;
	const b2 = x * x % P * x % P;
	const b5 = pow2(pow2(b2, _2n, P) * b2 % P, _1n, P) * x % P;
	const b10 = pow2(b5, _5n, P) * b5 % P;
	const b20 = pow2(b10, _10n, P) * b10 % P;
	const b40 = pow2(b20, _20n, P) * b20 % P;
	const b80 = pow2(b40, _40n, P) * b40 % P;
	return {
		pow_p_5_8: pow2(pow2(pow2(pow2(b80, _80n, P) * b80 % P, _80n, P) * b80 % P, _10n, P) * b10 % P, _2n, P) * x % P,
		b2
	};
}
function adjustScalarBytes(bytes) {
	bytes[0] &= 248;
	bytes[31] &= 127;
	bytes[31] |= 64;
	return bytes;
}
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function uvRatio(u, v) {
	const P = ed25519_CURVE_p;
	const v3 = mod(v * v * v, P);
	const pow = ed25519_pow_2_252_3(u * mod(v3 * v3 * v, P)).pow_p_5_8;
	let x = mod(u * v3 * pow, P);
	const vx2 = mod(v * x * x, P);
	const root1 = x;
	const root2 = mod(x * ED25519_SQRT_M1, P);
	const useRoot1 = vx2 === u;
	const useRoot2 = vx2 === mod(-u, P);
	const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
	if (useRoot1) x = root1;
	if (useRoot2 || noRoot) x = root2;
	if (isNegativeLE(x, P)) x = mod(-x, P);
	return {
		isValid: useRoot1 || useRoot2,
		value: x
	};
}
var Fp = /* @__PURE__ */ (() => Field(ed25519_CURVE.p, { isLE: true }))();
var Fn = /* @__PURE__ */ (() => Field(ed25519_CURVE.n, { isLE: true }))();
var ed25519Defaults = /* @__PURE__ */ (() => ({
	...ed25519_CURVE,
	Fp,
	hash: sha512,
	adjustScalarBytes,
	uvRatio
}))();
/**
* ed25519 curve with EdDSA signatures.
* @example
* import { ed25519 } from '@noble/curves/ed25519';
* const { secretKey, publicKey } = ed25519.keygen();
* const msg = new TextEncoder().encode('hello');
* const sig = ed25519.sign(msg, priv);
* ed25519.verify(sig, msg, pub); // Default mode: follows ZIP215
* ed25519.verify(sig, msg, pub, { zip215: false }); // RFC8032 / FIPS 186-5
*/
var ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();
var SQRT_M1 = ED25519_SQRT_M1;
var SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
var INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
var ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
var D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
var invertSqrt = (number) => uvRatio(_1n, number);
var MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
var bytes255ToNumberLE = (bytes) => ed25519.Point.Fp.create(bytesToNumberLE(bytes) & MAX_255B);
/**
* Computes Elligator map for Ristretto255.
* Described in [RFC9380](https://www.rfc-editor.org/rfc/rfc9380#appendix-B) and on
* the [website](https://ristretto.group/formulas/elligator.html).
*/
function calcElligatorRistrettoMap(r0) {
	const { d } = ed25519_CURVE;
	const P = ed25519_CURVE_p;
	const mod = (n) => Fp.create(n);
	const r = mod(SQRT_M1 * r0 * r0);
	const Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
	let c = BigInt(-1);
	const D = mod((c - d * r) * mod(r + d));
	let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
	let s_ = mod(s * r0);
	if (!isNegativeLE(s_, P)) s_ = mod(-s_);
	if (!Ns_D_is_sq) s = s_;
	if (!Ns_D_is_sq) c = r;
	const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D);
	const s2 = s * s;
	const W0 = mod((s + s) * D);
	const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
	const W2 = mod(_1n - s2);
	const W3 = mod(_1n + s2);
	return new ed25519.Point(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
}
function ristretto255_map(bytes) {
	abytes(bytes, 64);
	const R1 = calcElligatorRistrettoMap(bytes255ToNumberLE(bytes.subarray(0, 32)));
	const R2 = calcElligatorRistrettoMap(bytes255ToNumberLE(bytes.subarray(32, 64)));
	return new _RistrettoPoint(R1.add(R2));
}
/**
* Wrapper over Edwards Point for ristretto255.
*
* Each ed25519/ExtendedPoint has 8 different equivalent points. This can be
* a source of bugs for protocols like ring signatures. Ristretto was created to solve this.
* Ristretto point operates in X:Y:Z:T extended coordinates like ExtendedPoint,
* but it should work in its own namespace: do not combine those two.
* See [RFC9496](https://www.rfc-editor.org/rfc/rfc9496).
*/
var _RistrettoPoint = class _RistrettoPoint extends PrimeEdwardsPoint {
	constructor(ep) {
		super(ep);
	}
	static fromAffine(ap) {
		return new _RistrettoPoint(ed25519.Point.fromAffine(ap));
	}
	assertSame(other) {
		if (!(other instanceof _RistrettoPoint)) throw new Error("RistrettoPoint expected");
	}
	init(ep) {
		return new _RistrettoPoint(ep);
	}
	/** @deprecated use `import { ristretto255_hasher } from '@noble/curves/ed25519.js';` */
	static hashToCurve(hex) {
		return ristretto255_map(ensureBytes("ristrettoHash", hex, 64));
	}
	static fromBytes(bytes) {
		abytes(bytes, 32);
		const { a, d } = ed25519_CURVE;
		const P = ed25519_CURVE_p;
		const mod = (n) => Fp.create(n);
		const s = bytes255ToNumberLE(bytes);
		if (!equalBytes(Fp.toBytes(s), bytes) || isNegativeLE(s, P)) throw new Error("invalid ristretto255 encoding 1");
		const s2 = mod(s * s);
		const u1 = mod(_1n + a * s2);
		const u2 = mod(_1n - a * s2);
		const u1_2 = mod(u1 * u1);
		const u2_2 = mod(u2 * u2);
		const v = mod(a * d * u1_2 - u2_2);
		const { isValid, value: I } = invertSqrt(mod(v * u2_2));
		const Dx = mod(I * u2);
		const Dy = mod(I * Dx * v);
		let x = mod((s + s) * Dx);
		if (isNegativeLE(x, P)) x = mod(-x);
		const y = mod(u1 * Dy);
		const t = mod(x * y);
		if (!isValid || isNegativeLE(t, P) || y === _0n) throw new Error("invalid ristretto255 encoding 2");
		return new _RistrettoPoint(new ed25519.Point(x, y, _1n, t));
	}
	/**
	* Converts ristretto-encoded string to ristretto point.
	* Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
	* @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
	*/
	static fromHex(hex) {
		return _RistrettoPoint.fromBytes(ensureBytes("ristrettoHex", hex, 32));
	}
	static msm(points, scalars) {
		return pippenger(_RistrettoPoint, ed25519.Point.Fn, points, scalars);
	}
	/**
	* Encodes ristretto point to Uint8Array.
	* Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
	*/
	toBytes() {
		let { X, Y, Z, T } = this.ep;
		const P = ed25519_CURVE_p;
		const mod = (n) => Fp.create(n);
		const u1 = mod(mod(Z + Y) * mod(Z - Y));
		const u2 = mod(X * Y);
		const { value: invsqrt } = invertSqrt(mod(u1 * mod(u2 * u2)));
		const D1 = mod(invsqrt * u1);
		const D2 = mod(invsqrt * u2);
		const zInv = mod(D1 * D2 * T);
		let D;
		if (isNegativeLE(T * zInv, P)) {
			let _x = mod(Y * SQRT_M1);
			let _y = mod(X * SQRT_M1);
			X = _x;
			Y = _y;
			D = mod(D1 * INVSQRT_A_MINUS_D);
		} else D = D2;
		if (isNegativeLE(X * zInv, P)) Y = mod(-Y);
		let s = mod((Z - Y) * D);
		if (isNegativeLE(s, P)) s = mod(-s);
		return Fp.toBytes(s);
	}
	/**
	* Compares two Ristretto points.
	* Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
	*/
	equals(other) {
		this.assertSame(other);
		const { X: X1, Y: Y1 } = this.ep;
		const { X: X2, Y: Y2 } = other.ep;
		const mod = (n) => Fp.create(n);
		const one = mod(X1 * Y2) === mod(Y1 * X2);
		const two = mod(Y1 * Y2) === mod(X1 * X2);
		return one || two;
	}
	is0() {
		return this.equals(_RistrettoPoint.ZERO);
	}
};
_RistrettoPoint.BASE = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.BASE))();
_RistrettoPoint.ZERO = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.ZERO))();
_RistrettoPoint.Fp = /* @__PURE__ */ (() => Fp)();
_RistrettoPoint.Fn = /* @__PURE__ */ (() => Fn)();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/utils/expirableMap.js
var _a;
var _b;
/**
* A map that expires entries after a given time.
* Defaults to 10 minutes.
*/
var ExpirableMap = class {
	static {
		_a = Symbol.iterator, _b = Symbol.toStringTag;
	}
	#inner;
	#expirationTime;
	/**
	* Create a new ExpirableMap.
	* @param {ExpirableMapOptions<any, any>} options - options for the map.
	* @param {Iterable<[any, any]>} options.source - an optional source of entries to initialize the map with.
	* @param {number} options.expirationTime - the time in milliseconds after which entries will expire.
	*/
	constructor(options = {}) {
		this[_a] = this.entries.bind(this);
		this[_b] = "ExpirableMap";
		const { source = [], expirationTime = 6e5 } = options;
		const currentTime = Date.now();
		this.#inner = new Map([...source].map(([key, value]) => [key, {
			value,
			timestamp: currentTime
		}]));
		this.#expirationTime = expirationTime;
	}
	/**
	* Prune removes all expired entries.
	*/
	prune() {
		const currentTime = Date.now();
		for (const [key, entry] of this.#inner.entries()) if (currentTime - entry.timestamp > this.#expirationTime) this.#inner.delete(key);
		return this;
	}
	/**
	* Set the value for the given key. Prunes expired entries.
	* @param key for the entry
	* @param value of the entry
	* @returns this
	*/
	set(key, value) {
		this.prune();
		const entry = {
			value,
			timestamp: Date.now()
		};
		this.#inner.set(key, entry);
		return this;
	}
	/**
	* Get the value associated with the key, if it exists and has not expired.
	* @param key K
	* @returns the value associated with the key, or undefined if the key is not present or has expired.
	*/
	get(key) {
		const entry = this.#inner.get(key);
		if (entry === void 0) return;
		if (Date.now() - entry.timestamp > this.#expirationTime) {
			this.#inner.delete(key);
			return;
		}
		return entry.value;
	}
	/**
	* Clear all entries.
	*/
	clear() {
		this.#inner.clear();
	}
	/**
	* Entries returns the entries of the map, without the expiration time.
	* @returns an iterator over the entries of the map.
	*/
	entries() {
		const iterator = this.#inner.entries();
		const generator = function* () {
			for (const [key, value] of iterator) yield [key, value.value];
		};
		return generator();
	}
	/**
	* Values returns the values of the map, without the expiration time.
	* @returns an iterator over the values of the map.
	*/
	values() {
		const iterator = this.#inner.values();
		const generator = function* () {
			for (const value of iterator) yield value.value;
		};
		return generator();
	}
	/**
	* Keys returns the keys of the map
	* @returns an iterator over the keys of the map.
	*/
	keys() {
		return this.#inner.keys();
	}
	/**
	* forEach calls the callbackfn on each entry of the map.
	* @param callbackfn to call on each entry
	* @param thisArg to use as this when calling the callbackfn
	*/
	forEach(callbackfn, thisArg) {
		for (const [key, value] of this.#inner.entries()) callbackfn.call(thisArg, value.value, key, this);
	}
	/**
	* has returns true if the key exists and has not expired.
	* @param key K
	* @returns true if the key exists and has not expired.
	*/
	has(key) {
		return this.#inner.has(key);
	}
	/**
	* delete the entry for the given key.
	* @param key K
	* @returns true if the key existed and has been deleted.
	*/
	delete(key) {
		return this.#inner.delete(key);
	}
	/**
	* get size of the map.
	* @returns the size of the map.
	*/
	get size() {
		return this.#inner.size;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/der.js
var encodeLenBytes = (len) => {
	if (len <= 127) return 1;
	else if (len <= 255) return 2;
	else if (len <= 65535) return 3;
	else if (len <= 16777215) return 4;
	else throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
};
var encodeLen = (buf, offset, len) => {
	if (len <= 127) {
		buf[offset] = len;
		return 1;
	} else if (len <= 255) {
		buf[offset] = 129;
		buf[offset + 1] = len;
		return 2;
	} else if (len <= 65535) {
		buf[offset] = 130;
		buf[offset + 1] = len >> 8;
		buf[offset + 2] = len;
		return 3;
	} else if (len <= 16777215) {
		buf[offset] = 131;
		buf[offset + 1] = len >> 16;
		buf[offset + 2] = len >> 8;
		buf[offset + 3] = len;
		return 4;
	} else throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
};
var decodeLenBytes = (buf, offset) => {
	if (buf[offset] < 128) return 1;
	if (buf[offset] === 128) throw InputError.fromCode(new DerDecodeErrorCode("Invalid length 0"));
	if (buf[offset] === 129) return 2;
	if (buf[offset] === 130) return 3;
	if (buf[offset] === 131) return 4;
	throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
var decodeLen = (buf, offset) => {
	const lenBytes = decodeLenBytes(buf, offset);
	if (lenBytes === 1) return buf[offset];
	else if (lenBytes === 2) return buf[offset + 1];
	else if (lenBytes === 3) return (buf[offset + 1] << 8) + buf[offset + 2];
	else if (lenBytes === 4) return (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
	throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
Uint8Array.from([
	...[48, 12],
	...[6, 10],
	...[
		43,
		6,
		1,
		4,
		1,
		131,
		184,
		67,
		1,
		1
	]
]);
/**
* A DER encoded `SEQUENCE(OID)` for the Ed25519 algorithm
*/
var ED25519_OID = Uint8Array.from([
	...[48, 5],
	...[6, 3],
	...[
		43,
		101,
		112
	]
]);
Uint8Array.from([
	...[48, 16],
	...[6, 7],
	...[
		42,
		134,
		72,
		206,
		61,
		2,
		1
	],
	...[6, 5],
	...[
		43,
		129,
		4,
		0,
		10
	]
]);
Uint8Array.from([
	...[48, 29],
	...[6, 13],
	...[
		43,
		6,
		1,
		4,
		1,
		130,
		220,
		124,
		5,
		3,
		1,
		2,
		1
	],
	...[6, 12],
	...[
		43,
		6,
		1,
		4,
		1,
		130,
		220,
		124,
		5,
		3,
		2,
		1
	]
]);
/**
* Wraps the given `payload` in a DER encoding tagged with the given encoded `oid` like so:
* `SEQUENCE(oid, BITSTRING(payload))`
* @param payload The payload to encode as the bit string
* @param oid The DER encoded (and SEQUENCE wrapped!) OID to tag the payload with
*/
function wrapDER(payload, oid) {
	const bitStringHeaderLength = 2 + encodeLenBytes(payload.byteLength + 1);
	const len = oid.byteLength + bitStringHeaderLength + payload.byteLength;
	let offset = 0;
	const buf = new Uint8Array(1 + encodeLenBytes(len) + len);
	buf[offset++] = 48;
	offset += encodeLen(buf, offset, len);
	buf.set(oid, offset);
	offset += oid.byteLength;
	buf[offset++] = 3;
	offset += encodeLen(buf, offset, payload.byteLength + 1);
	buf[offset++] = 0;
	buf.set(new Uint8Array(payload), offset);
	return buf;
}
/**
* Extracts a payload from the given `derEncoded` data, and checks that it was tagged with the given `oid`.
*
* `derEncoded = SEQUENCE(oid, BITSTRING(payload))`
* @param derEncoded The DER encoded and tagged data
* @param oid The DER encoded (and SEQUENCE wrapped!) expected OID
* @returns The unwrapped payload
*/
var unwrapDER = (derEncoded, oid) => {
	let offset = 0;
	const expect = (n, msg) => {
		if (buf[offset++] !== n) throw InputError.fromCode(new DerDecodeErrorCode(`Expected ${msg} at offset ${offset}`));
	};
	const buf = new Uint8Array(derEncoded);
	expect(48, "sequence");
	offset += decodeLenBytes(buf, offset);
	if (!uint8Equals(buf.slice(offset, offset + oid.byteLength), oid)) throw InputError.fromCode(new DerDecodeErrorCode("Not the expected OID."));
	offset += oid.byteLength;
	expect(3, "bit string");
	const payloadLen = decodeLen(buf, offset) - 1;
	offset += decodeLenBytes(buf, offset);
	expect(0, "0 padding");
	const result = buf.slice(offset);
	if (payloadLen !== result.length) throw InputError.fromCode(new DerDecodeLengthMismatchErrorCode(payloadLen, result.length));
	return result;
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/public_key.js
var Ed25519PublicKey$1 = class Ed25519PublicKey$1 {
	static from(key) {
		return this.fromDer(key.toDer());
	}
	static fromRaw(rawKey) {
		return new Ed25519PublicKey$1(rawKey);
	}
	static fromDer(derKey) {
		return new Ed25519PublicKey$1(this.derDecode(derKey));
	}
	static {
		this.RAW_KEY_LENGTH = 32;
	}
	static derEncode(publicKey) {
		return wrapDER(publicKey, ED25519_OID);
	}
	static derDecode(key) {
		const unwrapped = unwrapDER(key, ED25519_OID);
		if (unwrapped.length !== this.RAW_KEY_LENGTH) throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
		return unwrapped;
	}
	#rawKey;
	get rawKey() {
		return this.#rawKey;
	}
	#derKey;
	get derKey() {
		return this.#derKey;
	}
	constructor(key) {
		if (key.byteLength !== Ed25519PublicKey$1.RAW_KEY_LENGTH) throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
		this.#rawKey = key;
		this.#derKey = Ed25519PublicKey$1.derEncode(key);
	}
	toDer() {
		return this.derKey;
	}
	toRaw() {
		return this.rawKey;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/observable.js
var Observable = class {
	constructor() {
		this.observers = [];
	}
	subscribe(func) {
		this.observers.push(func);
	}
	unsubscribe(func) {
		this.observers = this.observers.filter((observer) => observer !== func);
	}
	notify(data, ...rest) {
		this.observers.forEach((observer) => observer(data, ...rest));
	}
};
var ObservableLog = class extends Observable {
	constructor() {
		super();
	}
	print(message, ...rest) {
		this.notify({
			message,
			level: "info"
		}, ...rest);
	}
	warn(message, ...rest) {
		this.notify({
			message,
			level: "warn"
		}, ...rest);
	}
	error(message, error, ...rest) {
		this.notify({
			message,
			level: "error",
			error
		}, ...rest);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/polling/backoff.js
var RANDOMIZATION_FACTOR = .5;
var MULTIPLIER = 1.5;
var INITIAL_INTERVAL_MSEC = 500;
var MAX_INTERVAL_MSEC = 6e4;
var MAX_ELAPSED_TIME_MSEC = 9e5;
var MAX_ITERATIONS = 10;
/**
* Exponential backoff strategy.
*/
var ExponentialBackoff = class ExponentialBackoff {
	#currentInterval;
	#randomizationFactor;
	#multiplier;
	#maxInterval;
	#startTime;
	#maxElapsedTime;
	#maxIterations;
	#date;
	#count = 0;
	static {
		this.default = {
			initialInterval: INITIAL_INTERVAL_MSEC,
			randomizationFactor: RANDOMIZATION_FACTOR,
			multiplier: MULTIPLIER,
			maxInterval: MAX_INTERVAL_MSEC,
			maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
			maxIterations: MAX_ITERATIONS,
			date: Date
		};
	}
	constructor(options = ExponentialBackoff.default) {
		const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date = Date } = options;
		this.#currentInterval = initialInterval;
		this.#randomizationFactor = randomizationFactor;
		this.#multiplier = multiplier;
		this.#maxInterval = maxInterval;
		this.#date = date;
		this.#startTime = date.now();
		this.#maxElapsedTime = maxElapsedTime;
		this.#maxIterations = maxIterations;
	}
	get ellapsedTimeInMsec() {
		return this.#date.now() - this.#startTime;
	}
	get currentInterval() {
		return this.#currentInterval;
	}
	get count() {
		return this.#count;
	}
	get randomValueFromInterval() {
		const delta = this.#randomizationFactor * this.#currentInterval;
		const min = this.#currentInterval - delta;
		const max = this.#currentInterval + delta;
		return Math.random() * (max - min) + min;
	}
	incrementCurrentInterval() {
		this.#currentInterval = Math.min(this.#currentInterval * this.#multiplier, this.#maxInterval);
		this.#count++;
		return this.#currentInterval;
	}
	next() {
		if (this.ellapsedTimeInMsec >= this.#maxElapsedTime || this.#count >= this.#maxIterations) return null;
		else {
			this.incrementCurrentInterval();
			return this.randomValueFromInterval;
		}
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/agent/http/index.js
var RequestStatusResponseStatus;
(function(RequestStatusResponseStatus) {
	RequestStatusResponseStatus["Received"] = "received";
	RequestStatusResponseStatus["Processing"] = "processing";
	RequestStatusResponseStatus["Replied"] = "replied";
	RequestStatusResponseStatus["Rejected"] = "rejected";
	RequestStatusResponseStatus["Unknown"] = "unknown";
	RequestStatusResponseStatus["Done"] = "done";
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
var MINUTE_TO_MSECS = 6e4;
var MSECS_TO_NANOSECONDS = 1e6;
var DEFAULT_TIME_DIFF_MSECS = 0;
var IC_ROOT_KEY = "308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d9685f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484b01291091c5f87b98883463f98091a0baaae";
var IC0_DOMAIN = "ic0.app";
var IC0_SUB_DOMAIN = ".ic0.app";
var ICP0_DOMAIN = "icp0.io";
var ICP0_SUB_DOMAIN = ".icp0.io";
var ICP_API_DOMAIN = "icp-api.io";
var ICP_API_SUB_DOMAIN = ".icp-api.io";
var HTTP_STATUS_OK = 200;
var HTTP_STATUS_ACCEPTED = 202;
var HTTP_STATUS_NOT_FOUND = 404;
function getDefaultFetch() {
	let defaultFetch;
	if (typeof window !== "undefined") {
		if (window.fetch) defaultFetch = window.fetch.bind(window);
		else throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. You appear to be in a browser context, but window.fetch was not present."));
	} else if (typeof globalThis !== "undefined") {
		if (globalThis.fetch) defaultFetch = globalThis.fetch.bind(globalThis);
		else throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. You appear to be in a Node.js context, but global.fetch was not available."));
	} else if (typeof self !== "undefined") {
		if (self.fetch) defaultFetch = self.fetch.bind(self);
	}
	if (defaultFetch) return defaultFetch;
	throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. Please provide fetch to the HttpAgent constructor, or ensure it is available in the window or global context."));
}
function determineHost(configuredHost) {
	let host;
	if (configuredHost !== void 0) {
		if (!configuredHost.match(/^[a-z]+:/) && typeof window !== "undefined") host = new URL(window.location.protocol + "//" + configuredHost);
		else host = new URL(configuredHost);
	} else {
		const knownHosts = [
			"ic0.app",
			"icp0.io",
			"127.0.0.1",
			"localhost"
		];
		const remoteHosts = [".github.dev", ".gitpod.io"];
		const location = typeof window !== "undefined" ? window.location : void 0;
		const hostname = location?.hostname;
		let knownHost;
		if (hostname && typeof hostname === "string") {
			if (remoteHosts.some((host) => hostname.endsWith(host))) knownHost = hostname;
			else knownHost = knownHosts.find((host) => hostname.endsWith(host));
		}
		if (location && knownHost) host = new URL(`${location.protocol}//${knownHost}${location.port ? ":" + location.port : ""}`);
		else host = new URL("https://icp-api.io");
	}
	return host.toString();
}
/**
* A HTTP agent allows users to interact with a client of the internet computer
using the available methods. It exposes an API that closely follows the
public view of the internet computer, and is not intended to be exposed
directly to the majority of users due to its low-level interface.
* There is a pipeline to apply transformations to the request before sending
it to the client. This is to decouple signature, nonce generation and
other computations so that this class can stay as simple as possible while
allowing extensions.
*/
var HttpAgent = class HttpAgent {
	#rootKeyPromise;
	#shouldFetchRootKey;
	#timeDiffMsecs;
	#hasSyncedTime;
	#syncTimePromise;
	#shouldSyncTime;
	#identity;
	#fetch;
	#fetchOptions;
	#callOptions;
	#credentials;
	#retryTimes;
	#backoffStrategy;
	#maxIngressExpiryInMinutes;
	get #maxIngressExpiryInMs() {
		return this.#maxIngressExpiryInMinutes * MINUTE_TO_MSECS;
	}
	#queryPipeline;
	#updatePipeline;
	#subnetKeys;
	#verifyQuerySignatures;
	/**
	* @param options - Options for the HttpAgent
	* @deprecated Use `HttpAgent.create` or `HttpAgent.createSync` instead
	*/
	constructor(options = {}) {
		this.#rootKeyPromise = null;
		this.#shouldFetchRootKey = false;
		this.#timeDiffMsecs = DEFAULT_TIME_DIFF_MSECS;
		this.#hasSyncedTime = false;
		this.#syncTimePromise = null;
		this.#shouldSyncTime = false;
		this._isAgent = true;
		this.config = {};
		this.log = new ObservableLog();
		this.#queryPipeline = [];
		this.#updatePipeline = [];
		this.#subnetKeys = new ExpirableMap({ expirationTime: 5 * MINUTE_TO_MSECS });
		this.#verifyQuerySignatures = true;
		/**
		* See https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-query for details on validation
		* @param queryResponse - The response from the query
		* @param subnetStatus - The subnet status, including all node keys
		* @returns ApiQueryResponse
		*/
		this.#verifyQueryResponse = (queryResponse, subnetStatus) => {
			if (this.#verifyQuerySignatures === false) return queryResponse;
			const { status, signatures = [], requestId } = queryResponse;
			for (const sig of signatures) {
				const { timestamp, identity } = sig;
				const nodeId = Principal$1.fromUint8Array(identity).toText();
				let hash;
				if (status === QueryResponseStatus.Replied) {
					const { reply } = queryResponse;
					hash = hashOfMap({
						status,
						reply,
						timestamp: BigInt(timestamp),
						request_id: requestId
					});
				} else if (status === QueryResponseStatus.Rejected) {
					const { reject_code, reject_message, error_code } = queryResponse;
					hash = hashOfMap({
						status,
						reject_code,
						reject_message,
						error_code,
						timestamp: BigInt(timestamp),
						request_id: requestId
					});
				} else throw UnknownError.fromCode(new UnexpectedErrorCode(`Unknown status: ${status}`));
				const separatorWithHash = concatBytes(IC_RESPONSE_DOMAIN_SEPARATOR, hash);
				const pubKey = subnetStatus.nodeKeys.get(nodeId);
				if (!pubKey) throw ProtocolError.fromCode(new MalformedPublicKeyErrorCode());
				const rawKey = Ed25519PublicKey$1.fromDer(pubKey).rawKey;
				if (ed25519.verify(sig.signature, separatorWithHash, rawKey)) return queryResponse;
				throw TrustError.fromCode(new QuerySignatureVerificationFailedErrorCode(nodeId));
			}
			return queryResponse;
		};
		this.config = options;
		this.#fetch = options.fetch || getDefaultFetch() || fetch.bind(globalThis);
		this.#fetchOptions = options.fetchOptions;
		this.#callOptions = options.callOptions;
		this.#shouldFetchRootKey = options.shouldFetchRootKey ?? false;
		this.#shouldSyncTime = options.shouldSyncTime ?? false;
		if (options.rootKey) this.rootKey = options.rootKey;
		else if (this.#shouldFetchRootKey) this.rootKey = null;
		else this.rootKey = hexToBytes(IC_ROOT_KEY);
		const host = determineHost(options.host);
		this.host = new URL(host);
		if (options.verifyQuerySignatures !== void 0) this.#verifyQuerySignatures = options.verifyQuerySignatures;
		this.#retryTimes = options.retryTimes ?? 3;
		const defaultBackoffFactory = () => new ExponentialBackoff({ maxIterations: this.#retryTimes });
		this.#backoffStrategy = options.backoffStrategy || defaultBackoffFactory;
		if (this.host.hostname.endsWith(IC0_SUB_DOMAIN)) this.host.hostname = IC0_DOMAIN;
		else if (this.host.hostname.endsWith(ICP0_SUB_DOMAIN)) this.host.hostname = ICP0_DOMAIN;
		else if (this.host.hostname.endsWith(ICP_API_SUB_DOMAIN)) this.host.hostname = ICP_API_DOMAIN;
		if (options.credentials) {
			const { name, password } = options.credentials;
			this.#credentials = `${name}${password ? ":" + password : ""}`;
		}
		this.#identity = Promise.resolve(options.identity || new AnonymousIdentity());
		if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes > 5) throw InputError.fromCode(new IngressExpiryInvalidErrorCode("The maximum ingress expiry time is 5 minutes.", options.ingressExpiryInMinutes));
		if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes <= 0) throw InputError.fromCode(new IngressExpiryInvalidErrorCode("Ingress expiry time must be greater than 0.", options.ingressExpiryInMinutes));
		this.#maxIngressExpiryInMinutes = options.ingressExpiryInMinutes || 5;
		this.addTransform("update", makeNonceTransform(makeNonce));
		if (options.useQueryNonces) this.addTransform("query", makeNonceTransform(makeNonce));
		if (options.logToConsole) this.log.subscribe((log) => {
			if (log.level === "error") console.error(log.message);
			else if (log.level === "warn") console.warn(log.message);
			else console.log(log.message);
		});
	}
	static createSync(options = {}) {
		return new this({ ...options });
	}
	static async create(options = {}) {
		const agent = HttpAgent.createSync(options);
		await agent.#asyncGuard();
		return agent;
	}
	static async from(agent) {
		try {
			if ("config" in agent) return await HttpAgent.create(agent.config);
			return await HttpAgent.create({
				fetch: agent._fetch,
				fetchOptions: agent._fetchOptions,
				callOptions: agent._callOptions,
				host: agent._host.toString(),
				identity: agent._identity ?? void 0
			});
		} catch {
			throw InputError.fromCode(new CreateHttpAgentErrorCode());
		}
	}
	isLocal() {
		const hostname = this.host.hostname;
		return hostname === "127.0.0.1" || hostname.endsWith("127.0.0.1");
	}
	addTransform(type, fn, priority = fn.priority || 0) {
		if (type === "update") {
			const i = this.#updatePipeline.findIndex((x) => (x.priority || 0) < priority);
			this.#updatePipeline.splice(i >= 0 ? i : this.#updatePipeline.length, 0, Object.assign(fn, { priority }));
		} else if (type === "query") {
			const i = this.#queryPipeline.findIndex((x) => (x.priority || 0) < priority);
			this.#queryPipeline.splice(i >= 0 ? i : this.#queryPipeline.length, 0, Object.assign(fn, { priority }));
		}
	}
	async getPrincipal() {
		if (!this.#identity) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		return (await this.#identity).getPrincipal();
	}
	/**
	* Makes a call to a canister method.
	* @param canisterId - The ID of the canister to call. Can be a Principal or a string.
	* @param options - Options for the call.
	* @param options.methodName - The name of the method to call.
	* @param options.arg - The argument to pass to the method, as a Uint8Array.
	* @param options.effectiveCanisterId - (Optional) The effective canister ID, if different from the target canister ID.
	* @param options.callSync - (Optional) Whether to use synchronous call mode. Defaults to true.
	* @param options.nonce - (Optional) A unique nonce for the request. If provided, it will override any nonce set by transforms.
	* @param identity - (Optional) The identity to use for the call. If not provided, the agent's current identity will be used.
	* @returns A promise that resolves to the response of the call, including the request ID and response details.
	*/
	async call(canisterId, options, identity) {
		const callSync = options.callSync ?? true;
		const id = await (identity ?? this.#identity);
		if (!id) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		const canister = Principal$1.from(canisterId);
		const ecid = options.effectiveCanisterId ? Principal$1.from(options.effectiveCanisterId) : canister;
		await this.#asyncGuard(ecid);
		const sender = id.getPrincipal();
		const ingress_expiry = calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs);
		const submit = {
			request_type: SubmitRequestType.Call,
			canister_id: canister,
			method_name: options.methodName,
			arg: options.arg,
			sender,
			ingress_expiry
		};
		let transformedRequest = await this._transform({
			request: {
				body: null,
				method: "POST",
				headers: {
					"Content-Type": "application/cbor",
					...this.#credentials ? { Authorization: "Basic " + btoa(this.#credentials) } : {}
				}
			},
			endpoint: Endpoint.Call,
			body: submit
		});
		let nonce;
		if (options?.nonce) nonce = toNonce(options.nonce);
		else if (transformedRequest.body.nonce) nonce = toNonce(transformedRequest.body.nonce);
		else nonce = void 0;
		submit.nonce = nonce;
		/**
		* Converts a Uint8Array to a Nonce type.
		* @param buf - The buffer to convert.
		* @returns The buffer as a Nonce.
		*/
		function toNonce(buf) {
			return Object.assign(buf, { __nonce__: void 0 });
		}
		transformedRequest = await id.transformRequest(transformedRequest);
		const body = encode(transformedRequest.body);
		const backoff = this.#backoffStrategy();
		const requestId = requestIdOf(submit);
		try {
			const requestSync = () => {
				this.log.print(`fetching "/api/v3/canister/${ecid.toText()}/call" with request:`, transformedRequest);
				return this.#fetch("" + new URL(`/api/v3/canister/${ecid.toText()}/call`, this.host), {
					...this.#callOptions,
					...transformedRequest.request,
					body
				});
			};
			const requestAsync = () => {
				this.log.print(`fetching "/api/v2/canister/${ecid.toText()}/call" with request:`, transformedRequest);
				return this.#fetch("" + new URL(`/api/v2/canister/${ecid.toText()}/call`, this.host), {
					...this.#callOptions,
					...transformedRequest.request,
					body
				});
			};
			const requestFn = callSync ? requestSync : requestAsync;
			const { responseBodyBytes, ...response } = await this.#requestAndRetry({
				requestFn,
				backoff,
				tries: 0
			});
			const responseBody = responseBodyBytes.byteLength > 0 ? decode(responseBodyBytes) : null;
			return {
				requestId,
				response: {
					...response,
					body: responseBody
				},
				requestDetails: submit
			};
		} catch (error) {
			let callError;
			if (error instanceof AgentError) {
				if (error.hasCode(HttpV3ApiNotSupportedErrorCode)) {
					this.log.warn("v3 api not supported. Fall back to v2");
					return this.call(canisterId, {
						...options,
						callSync: false
					}, identity);
				} else if (error.hasCode(IngressExpiryInvalidErrorCode) && !this.#hasSyncedTime) {
					await this.syncTime(canister);
					return this.call(canister, options, identity);
				} else {
					error.code.requestContext = {
						requestId,
						senderPubKey: transformedRequest.body.sender_pubkey,
						senderSignature: transformedRequest.body.sender_sig,
						ingressExpiry: transformedRequest.body.content.ingress_expiry
					};
					callError = error;
				}
			} else callError = UnknownError.fromCode(new UnexpectedErrorCode(error));
			this.log.error(`Error while making call: ${callError.message}`, callError);
			throw callError;
		}
	}
	async #requestAndRetryQuery(args) {
		const { ecid, transformedRequest, body, requestId, backoff, tries } = args;
		const delay = tries === 0 ? 0 : backoff.next();
		this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with tries:`, {
			tries,
			backoff,
			delay
		});
		if (delay === null) throw UnknownError.fromCode(new TimeoutWaitingForResponseErrorCode(`Backoff strategy exhausted after ${tries} attempts.`, requestId));
		if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
		let response;
		try {
			this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with request:`, transformedRequest);
			const fetchResponse = await this.#fetch("" + new URL(`/api/v2/canister/${ecid.toString()}/query`, this.host), {
				...this.#fetchOptions,
				...transformedRequest.request,
				body
			});
			if (fetchResponse.status === HTTP_STATUS_OK) response = {
				...decode(uint8FromBufLike(await fetchResponse.arrayBuffer())),
				httpDetails: {
					ok: fetchResponse.ok,
					status: fetchResponse.status,
					statusText: fetchResponse.statusText,
					headers: httpHeadersTransform(fetchResponse.headers)
				},
				requestId
			};
			else throw ProtocolError.fromCode(new HttpErrorCode(fetchResponse.status, fetchResponse.statusText, httpHeadersTransform(fetchResponse.headers), await fetchResponse.text()));
		} catch (error) {
			if (tries < this.#retryTimes) {
				this.log.warn(`Caught exception while attempting to make query:\n  ${error}\n  Retrying query.`);
				return await this.#requestAndRetryQuery({
					...args,
					tries: tries + 1
				});
			}
			if (error instanceof AgentError) throw error;
			throw TransportError.fromCode(new HttpFetchErrorCode(error));
		}
		if (!this.#verifyQuerySignatures) return response;
		const signatureTimestampNs = response.signatures?.[0]?.timestamp;
		if (!signatureTimestampNs) throw ProtocolError.fromCode(new MalformedSignatureErrorCode("Timestamp not found in query response. This suggests a malformed or malicious response."));
		const signatureTimestampMs = Number(BigInt(signatureTimestampNs) / BigInt(MSECS_TO_NANOSECONDS));
		if (Date.now() + this.#timeDiffMsecs - signatureTimestampMs > this.#maxIngressExpiryInMs) {
			if (tries < this.#retryTimes) {
				this.log.warn("Timestamp is older than the max ingress expiry. Retrying query.", {
					requestId,
					signatureTimestampMs
				});
				return await this.#requestAndRetryQuery({
					...args,
					tries: tries + 1
				});
			}
			throw TrustError.fromCode(new CertificateOutdatedErrorCode(this.#maxIngressExpiryInMinutes, requestId, tries));
		}
		return response;
	}
	/**
	* Makes a request and retries if it fails.
	* @param args - The arguments for the request.
	* @param args.requestFn - A function that returns a Promise resolving to a Response.
	* @param args.backoff - The backoff strategy to use for retries.
	* @param args.tries - The number of retry attempts made so far.
	* @returns The response from the request, if the status is 200 or 202.
	* See the https://internetcomputer.org/docs/references/ic-interface-spec#http-interface for details on the response statuses.
	* @throws {ProtocolError} if the response status is not 200 or 202, and the retry limit has been reached.
	* @throws {TransportError} if the request fails, and the retry limit has been reached.
	*/
	async #requestAndRetry(args) {
		const { requestFn, backoff, tries } = args;
		const delay = tries === 0 ? 0 : backoff.next();
		if (delay === null) throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Retry strategy exhausted after ${tries} attempts.`));
		if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
		let response;
		let responseBodyBytes = /* @__PURE__ */ new Uint8Array();
		try {
			response = await requestFn();
			if (response.status === HTTP_STATUS_OK) responseBodyBytes = uint8FromBufLike(await response.clone().arrayBuffer());
		} catch (error) {
			if (tries < this.#retryTimes) {
				this.log.warn(`Caught exception while attempting to make request:\n  ${error}\n  Retrying request.`);
				return await this.#requestAndRetry({
					requestFn,
					backoff,
					tries: tries + 1
				});
			}
			throw TransportError.fromCode(new HttpFetchErrorCode(error));
		}
		const headers = httpHeadersTransform(response.headers);
		if (response.status === HTTP_STATUS_OK || response.status === HTTP_STATUS_ACCEPTED) return {
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			responseBodyBytes,
			headers
		};
		const responseText = await response.text();
		if (response.status === HTTP_STATUS_NOT_FOUND && response.url.includes("api/v3")) throw ProtocolError.fromCode(new HttpV3ApiNotSupportedErrorCode());
		if (responseText.startsWith("Invalid request expiry: ")) throw InputError.fromCode(new IngressExpiryInvalidErrorCode(responseText, this.#maxIngressExpiryInMinutes));
		if (tries < this.#retryTimes) return await this.#requestAndRetry({
			requestFn,
			backoff,
			tries: tries + 1
		});
		throw ProtocolError.fromCode(new HttpErrorCode(response.status, response.statusText, headers, responseText));
	}
	async query(canisterId, fields, identity) {
		const backoff = this.#backoffStrategy();
		const ecid = fields.effectiveCanisterId ? Principal$1.from(fields.effectiveCanisterId) : Principal$1.from(canisterId);
		await this.#asyncGuard(ecid);
		this.log.print(`ecid ${ecid.toString()}`);
		this.log.print(`canisterId ${canisterId.toString()}`);
		let transformedRequest;
		const id = await (identity ?? this.#identity);
		if (!id) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		const canister = Principal$1.from(canisterId);
		const sender = id.getPrincipal();
		const ingressExpiry = calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs);
		const request = {
			request_type: ReadRequestType.Query,
			canister_id: canister,
			method_name: fields.methodName,
			arg: fields.arg,
			sender,
			ingress_expiry: ingressExpiry
		};
		const requestId = requestIdOf(request);
		transformedRequest = await this._transform({
			request: {
				method: "POST",
				headers: {
					"Content-Type": "application/cbor",
					...this.#credentials ? { Authorization: "Basic " + btoa(this.#credentials) } : {}
				}
			},
			endpoint: Endpoint.Query,
			body: request
		});
		transformedRequest = await id.transformRequest(transformedRequest);
		const body = encode(transformedRequest.body);
		const args = {
			canister: canister.toText(),
			ecid,
			transformedRequest,
			body,
			requestId,
			backoff,
			tries: 0
		};
		const makeQuery = async () => {
			const query = await this.#requestAndRetryQuery(args);
			return {
				requestDetails: request,
				...query
			};
		};
		const getSubnetStatus = async () => {
			const cachedSubnetStatus = this.#subnetKeys.get(ecid.toString());
			if (cachedSubnetStatus) return cachedSubnetStatus;
			await this.fetchSubnetKeys(ecid.toString());
			const subnetStatus = this.#subnetKeys.get(ecid.toString());
			if (!subnetStatus) throw TrustError.fromCode(new MissingSignatureErrorCode());
			return subnetStatus;
		};
		try {
			if (!this.#verifyQuerySignatures) return await makeQuery();
			const [queryWithDetails, subnetStatus] = await Promise.all([makeQuery(), getSubnetStatus()]);
			try {
				return this.#verifyQueryResponse(queryWithDetails, subnetStatus);
			} catch {
				this.log.warn("Query response verification failed. Retrying with fresh subnet keys.");
				this.#subnetKeys.delete(ecid.toString());
				const updatedSubnetStatus = await getSubnetStatus();
				return this.#verifyQueryResponse(queryWithDetails, updatedSubnetStatus);
			}
		} catch (error) {
			let queryError;
			if (error instanceof AgentError) {
				error.code.requestContext = {
					requestId,
					senderPubKey: transformedRequest.body.sender_pubkey,
					senderSignature: transformedRequest.body.sender_sig,
					ingressExpiry: transformedRequest.body.content.ingress_expiry
				};
				queryError = error;
			} else queryError = UnknownError.fromCode(new UnexpectedErrorCode(error));
			this.log.error(`Error while making query: ${queryError.message}`, queryError);
			throw queryError;
		}
	}
	/**
	* See https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-query for details on validation
	* @param queryResponse - The response from the query
	* @param subnetStatus - The subnet status, including all node keys
	* @returns ApiQueryResponse
	*/
	#verifyQueryResponse;
	async createReadStateRequest(fields, identity) {
		await this.#asyncGuard();
		const id = await (identity ?? this.#identity);
		if (!id) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		const sender = id.getPrincipal();
		const transformedRequest = await this._transform({
			request: {
				method: "POST",
				headers: {
					"Content-Type": "application/cbor",
					...this.#credentials ? { Authorization: "Basic " + btoa(this.#credentials) } : {}
				}
			},
			endpoint: Endpoint.ReadState,
			body: {
				request_type: ReadRequestType.ReadState,
				paths: fields.paths,
				sender,
				ingress_expiry: calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs)
			}
		});
		return id.transformRequest(transformedRequest);
	}
	async readState(canisterId, fields, _identity, request) {
		await this.#rootKeyGuard();
		const canister = Principal$1.from(canisterId);
		function getRequestId(options) {
			for (const path of options.paths) {
				const [pathName, value] = path;
				if (uint8Equals(pathName, new TextEncoder().encode("request_status"))) return value;
			}
		}
		let transformedRequest;
		let requestId;
		if (request) {
			transformedRequest = request;
			requestId = requestIdOf(transformedRequest);
		} else {
			requestId = getRequestId(fields);
			const identity = await this.#identity;
			if (!identity) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
			transformedRequest = await this.createReadStateRequest(fields, identity);
		}
		this.log.print(`fetching "/api/v2/canister/${canister}/read_state" with request:`, transformedRequest);
		const backoff = this.#backoffStrategy();
		try {
			const { responseBodyBytes } = await this.#requestAndRetry({
				requestFn: () => this.#fetch("" + new URL(`/api/v2/canister/${canister.toString()}/read_state`, this.host), {
					...this.#fetchOptions,
					...transformedRequest.request,
					body: encode(transformedRequest.body)
				}),
				backoff,
				tries: 0
			});
			const decodedResponse = decode(responseBodyBytes);
			this.log.print("Read state response:", decodedResponse);
			return decodedResponse;
		} catch (error) {
			let readStateError;
			if (error instanceof AgentError) {
				error.code.requestContext = {
					requestId,
					senderPubKey: transformedRequest.body.sender_pubkey,
					senderSignature: transformedRequest.body.sender_sig,
					ingressExpiry: transformedRequest.body.content.ingress_expiry
				};
				readStateError = error;
			} else readStateError = UnknownError.fromCode(new UnexpectedErrorCode(error));
			this.log.error(`Error while making read state: ${readStateError.message}`, readStateError);
			throw readStateError;
		}
	}
	parseTimeFromResponse(response) {
		let tree;
		if (response.certificate) {
			const decoded = decode(response.certificate);
			if (decoded && "tree" in decoded) tree = decoded.tree;
			else throw ProtocolError.fromCode(new HashTreeDecodeErrorCode("Could not decode time from response"));
			const timeLookup = lookup_path(["time"], tree);
			if (timeLookup.status !== LookupPathStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode("Time was not found in the response or was not in its expected format.", timeLookup.status));
			if (!(timeLookup.value instanceof Uint8Array) && !ArrayBuffer.isView(timeLookup)) throw ProtocolError.fromCode(new MalformedLookupFoundValueErrorCode("Time was not in its expected format."));
			const date = decodeTime(timeLookup.value);
			this.log.print("Time from response:", date);
			this.log.print("Time from response in milliseconds:", date.getTime());
			return date.getTime();
		} else this.log.warn("No certificate found in response");
		return 0;
	}
	/**
	* Allows agent to sync its time with the network. Can be called during intialization or mid-lifecycle if the device's clock has drifted away from the network time. This is necessary to set the Expiry for a request
	* @param {Principal} canisterIdOverride - Pass a canister ID if you need to sync the time with a particular subnet. Uses the ICP ledger canister by default.
	*/
	async syncTime(canisterIdOverride) {
		this.#syncTimePromise = this.#syncTimePromise ?? (async () => {
			await this.#rootKeyGuard();
			const callTime = Date.now();
			try {
				if (!canisterIdOverride) this.log.print("Syncing time with the IC. No canisterId provided, so falling back to ryjl3-tyaaa-aaaaa-aaaba-cai");
				const canisterId = canisterIdOverride ?? Principal$1.from("ryjl3-tyaaa-aaaaa-aaaba-cai");
				const anonymousAgent = HttpAgent.createSync({
					identity: new AnonymousIdentity(),
					host: this.host.toString(),
					fetch: this.#fetch,
					retryTimes: 0,
					rootKey: this.rootKey ?? void 0,
					shouldSyncTime: false
				});
				const maxReplicaTime = (await Promise.all(Array(3).fill(null).map(async () => {
					const date = (await request({
						canisterId,
						agent: anonymousAgent,
						paths: ["time"],
						disableCertificateTimeVerification: true
					})).get("time");
					if (date instanceof Date) return date.getTime();
				}, []))).reduce((max, current) => {
					return typeof current === "number" && current > max ? current : max;
				}, 0);
				if (maxReplicaTime > 0) {
					this.#timeDiffMsecs = maxReplicaTime - callTime;
					this.#hasSyncedTime = true;
					this.log.notify({
						message: `Syncing time: offset of ${this.#timeDiffMsecs}`,
						level: "info"
					});
				}
			} catch (error) {
				const syncTimeError = error instanceof AgentError ? error : UnknownError.fromCode(new UnexpectedErrorCode(error));
				this.log.error("Caught exception while attempting to sync time", syncTimeError);
				throw syncTimeError;
			}
		})();
		await this.#syncTimePromise.finally(() => {
			this.#syncTimePromise = null;
		});
	}
	async status() {
		const headers = this.#credentials ? { Authorization: "Basic " + btoa(this.#credentials) } : {};
		this.log.print(`fetching "/api/v2/status"`);
		const backoff = this.#backoffStrategy();
		const { responseBodyBytes } = await this.#requestAndRetry({
			backoff,
			requestFn: () => this.#fetch("" + new URL(`/api/v2/status`, this.host), {
				headers,
				...this.#fetchOptions
			}),
			tries: 0
		});
		return decode(responseBodyBytes);
	}
	async fetchRootKey() {
		this.#rootKeyPromise = this.#rootKeyPromise ?? (async () => {
			const value = await this.status();
			this.rootKey = value.root_key;
			return this.rootKey;
		})();
		return await this.#rootKeyPromise.finally(() => {
			this.#rootKeyPromise = null;
		});
	}
	async #asyncGuard(canisterIdOverride) {
		await Promise.all([this.#rootKeyGuard(), this.#syncTimeGuard(canisterIdOverride)]);
	}
	async #rootKeyGuard() {
		if (this.rootKey) return;
		else if (this.rootKey === null && this.host.toString() !== "https://icp-api.io" && this.#shouldFetchRootKey) await this.fetchRootKey();
		else throw ExternalError.fromCode(new MissingRootKeyErrorCode(this.#shouldFetchRootKey));
	}
	async #syncTimeGuard(canisterIdOverride) {
		if (this.#shouldSyncTime && !this.hasSyncedTime()) await this.syncTime(canisterIdOverride);
	}
	invalidateIdentity() {
		this.#identity = null;
	}
	replaceIdentity(identity) {
		this.#identity = Promise.resolve(identity);
	}
	async fetchSubnetKeys(canisterId) {
		const effectiveCanisterId = Principal$1.from(canisterId);
		await this.#asyncGuard(effectiveCanisterId);
		const subnetResponse = (await request({
			canisterId: effectiveCanisterId,
			paths: ["subnet"],
			agent: this
		})).get("subnet");
		if (subnetResponse && typeof subnetResponse === "object" && "nodeKeys" in subnetResponse) {
			this.#subnetKeys.set(effectiveCanisterId.toText(), subnetResponse);
			return subnetResponse;
		}
	}
	_transform(request) {
		let p = Promise.resolve(request);
		if (request.endpoint === Endpoint.Call) for (const fn of this.#updatePipeline) p = p.then((r) => fn(r).then((r2) => r2 || r));
		else for (const fn of this.#queryPipeline) p = p.then((r) => fn(r).then((r2) => r2 || r));
		return p;
	}
	/**
	* Returns the time difference in milliseconds between the IC network clock and the client's clock,
	* after the clock has been synced.
	*
	* If the time has not been synced, returns `0`.
	*/
	getTimeDiffMsecs() {
		return this.#timeDiffMsecs;
	}
	/**
	* Returns `true` if the time has been synced at least once with the IC network, `false` otherwise.
	*/
	hasSyncedTime() {
		return this.#hasSyncedTime;
	}
};
/**
* Calculates the ingress expiry time based on the maximum allowed expiry in minutes and the time difference in milliseconds.
* The expiry is rounded down according to the {@link Expiry.fromDeltaInMilliseconds} method.
* @param maxIngressExpiryInMinutes - The maximum ingress expiry time in minutes.
* @param timeDiffMsecs - The time difference in milliseconds to adjust the expiry.
* @returns The calculated ingress expiry as an Expiry object.
*/
function calculateIngressExpiry(maxIngressExpiryInMinutes, timeDiffMsecs) {
	const ingressExpiryMs = maxIngressExpiryInMinutes * MINUTE_TO_MSECS;
	return Expiry.fromDeltaInMilliseconds(ingressExpiryMs, timeDiffMsecs);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/polling/strategy.js
var FIVE_MINUTES_IN_MSEC = 3e5;
/**
* A best practices polling strategy: wait 2 seconds before the first poll, then 1 second
* with an exponential backoff factor of 1.2. Timeout after 5 minutes.
*
* Note that calling this function will create the strategy chain described above and already start the 5 minutes timeout.
* You should only call this function when you want to start the polling, and not before, to avoid exhausting the 5 minutes timeout in advance.
*/
function defaultStrategy() {
	return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
/**
* Predicate that returns true once.
*/
function once() {
	let first = true;
	return async () => {
		if (first) {
			first = false;
			return true;
		}
		return false;
	};
}
/**
* Delay the polling once.
* @param condition A predicate that indicates when to delay.
* @param timeInMsec The amount of time to delay.
*/
function conditionalDelay(condition, timeInMsec) {
	return async (canisterId, requestId, status) => {
		if (await condition(canisterId, requestId, status)) return new Promise((resolve) => setTimeout(resolve, timeInMsec));
	};
}
/**
* Reject a call after a certain amount of time.
* @param timeInMsec Time in milliseconds before the polling should be rejected.
*/
function timeout(timeInMsec) {
	const end = Date.now() + timeInMsec;
	return async (_canisterId, requestId, status) => {
		if (Date.now() > end) throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
	};
}
/**
* A strategy that throttle, but using an exponential backoff strategy.
* @param startingThrottleInMsec The throttle in milliseconds to start with.
* @param backoffFactor The factor to multiple the throttle time between every poll. For
*   example if using 2, the throttle will double between every run.
*/
function backoff(startingThrottleInMsec, backoffFactor) {
	let currentThrottling = startingThrottleInMsec;
	return () => new Promise((resolve) => setTimeout(() => {
		currentThrottling *= backoffFactor;
		resolve();
	}, currentThrottling));
}
/**
* Chain multiple polling strategy. This _chains_ the strategies, so if you pass in,
* say, two throttling strategy of 1 second, it will result in a throttle of 2 seconds.
* @param strategies A strategy list to chain.
*/
function chain(...strategies) {
	return async (canisterId, requestId, status) => {
		for (const a of strategies) await a(canisterId, requestId, status);
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/polling/index.js
var DEFAULT_POLLING_OPTIONS = { preSignReadStateRequest: false };
/**
* Check if an object has a property
* @param value the object that might have the property
* @param property the key of property we're looking for
*/
function hasProperty(value, property) {
	return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
	return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
	return hasProperty(value, property) && typeof value[property] === "function";
}
/**
* Check if value is a signed read state request with expiry
* @param value to check
*/
function isSignedReadStateRequestWithExpiry(value) {
	return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
/**
* Polls the IC to check the status of the given request then
* returns the response bytes once the request has been processed.
* @param agent The agent to use to poll read_state.
* @param canisterId The effective canister ID.
* @param requestId The Request ID to poll status for.
* @param options polling options to control behavior
*/
async function pollForResponse(agent, canisterId, requestId, options = {}) {
	const path = [utf8ToBytes("request_status"), requestId];
	let state;
	let currentRequest;
	if (options.preSignReadStateRequest ?? false) {
		currentRequest = await constructRequest({
			paths: [path],
			agent,
			pollingOptions: options
		});
		state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
	} else state = await agent.readState(canisterId, { paths: [path] });
	if (agent.rootKey == null) throw ExternalError.fromCode(new MissingRootKeyErrorCode());
	const cert = await Certificate.create({
		certificate: state.certificate,
		rootKey: agent.rootKey,
		canisterId,
		blsVerify: options.blsVerify,
		agent
	});
	const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
	let status;
	if (typeof maybeBuf === "undefined") status = RequestStatusResponseStatus.Unknown;
	else status = new TextDecoder().decode(maybeBuf);
	switch (status) {
		case RequestStatusResponseStatus.Replied: return {
			reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
			certificate: cert
		};
		case RequestStatusResponseStatus.Received:
		case RequestStatusResponseStatus.Unknown:
		case RequestStatusResponseStatus.Processing: {
			const strategy = options.strategy ?? defaultStrategy();
			await strategy(canisterId, requestId, status);
			return pollForResponse(agent, canisterId, requestId, {
				...options,
				strategy,
				request: currentRequest
			});
		}
		case RequestStatusResponseStatus.Rejected: {
			const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
			const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
			const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
			const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
			throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
		}
		case RequestStatusResponseStatus.Done: throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
	}
	throw UNREACHABLE_ERROR;
}
/**
* Constructs a read state request for the given paths.
* If the request is already signed and has an expiry, it will be returned as is.
* Otherwise, a new request will be created.
* @param options The options to use for creating the request.
* @param options.paths The paths to read from.
* @param options.agent The agent to use to create the request.
* @param options.pollingOptions The options to use for creating the request.
* @returns The read state request.
*/
async function constructRequest(options) {
	const { paths, agent, pollingOptions } = options;
	if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) return pollingOptions.request;
	const request = await agent.createReadStateRequest?.({ paths }, void 0);
	if (!isSignedReadStateRequestWithExpiry(request)) throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
	return request;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3.3.1__@dfinity+principal@3.3.1_@noble+hashes@1.8.0/node_modules/@dfinity/agent/lib/esm/actor.js
var metadataSymbol = Symbol.for("ic-agent-metadata");
/**
* An actor base class. An actor is an object containing only functions that will
* return a promise. These functions are derived from the IDL definition.
*/
var Actor = class {
	/**
	* Get the Agent class this Actor would call, or undefined if the Actor would use
	* the default agent (global.ic.agent).
	* @param actor The actor to get the agent of.
	*/
	static agentOf(actor) {
		return actor[metadataSymbol].config.agent;
	}
	/**
	* Get the interface of an actor, in the form of an instance of a Service.
	* @param actor The actor to get the interface of.
	*/
	static interfaceOf(actor) {
		return actor[metadataSymbol].service;
	}
	static canisterIdOf(actor) {
		return Principal$1.from(actor[metadataSymbol].config.canisterId);
	}
	static createActorClass(interfaceFactory, options) {
		const service = interfaceFactory({ IDL: idl_exports });
		class CanisterActor extends Actor {
			constructor(config) {
				if (!config.canisterId) throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
				const canisterId = typeof config.canisterId === "string" ? Principal$1.fromText(config.canisterId) : config.canisterId;
				super({
					config: {
						...DEFAULT_ACTOR_CONFIG,
						...config,
						canisterId
					},
					service
				});
				for (const [methodName, func] of service._fields) {
					if (options?.httpDetails) func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
					if (options?.certificate) func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
					this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
				}
			}
		}
		return CanisterActor;
	}
	/**
	* Creates an actor with the given interface factory and configuration.
	*
	* The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
	* @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
	* @param configuration - the configuration for the actor
	* @returns an actor with the given interface factory and configuration
	* @example
	* Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
	* ```ts
	* import { Actor, HttpAgent } from '@icp-sdk/core/agent';
	* import { Principal } from '@icp-sdk/core/principal';
	* import { idlFactory } from './api/declarations/hello-world.did';
	*
	* const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
	*
	* const agent = await HttpAgent.create({
	*   host: 'https://icp-api.io',
	* });
	*
	* const actor = Actor.createActor(idlFactory, {
	*   agent,
	*   canisterId,
	* });
	*
	* const response = await actor.greet('world');
	* console.log(response);
	* ```
	* @example
	* Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
	* ```ts
	* import { HttpAgent } from '@icp-sdk/core/agent';
	* import { Principal } from '@icp-sdk/core/principal';
	* import { createActor } from './api/hello-world';
	*
	* const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
	*
	* const agent = await HttpAgent.create({
	*   host: 'https://icp-api.io',
	* });
	*
	* const actor = createActor(canisterId, {
	*   agent,
	* });
	*
	* const response = await actor.greet('world');
	* console.log(response);
	* ```
	*/
	static createActor(interfaceFactory, configuration) {
		if (!configuration.canisterId) throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
		return new (this.createActorClass(interfaceFactory))(configuration);
	}
	/**
	* Returns an actor with methods that return the http response details along with the result
	* @param interfaceFactory - the interface factory for the actor
	* @param configuration - the configuration for the actor
	* @deprecated - use createActor with actorClassOptions instead
	*/
	static createActorWithHttpDetails(interfaceFactory, configuration) {
		return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
	}
	/**
	* Returns an actor with methods that return the http response details along with the result
	* @param interfaceFactory - the interface factory for the actor
	* @param configuration - the configuration for the actor
	* @param actorClassOptions - options for the actor class extended details to return with the result
	*/
	static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
		httpDetails: true,
		certificate: true
	}) {
		return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
	}
	constructor(metadata) {
		this[metadataSymbol] = Object.freeze(metadata);
	}
};
function decodeReturnValue(types, msg) {
	const returnValues = decode$1(types, msg);
	switch (returnValues.length) {
		case 0: return;
		case 1: return returnValues[0];
		default: return returnValues;
	}
}
var DEFAULT_ACTOR_CONFIG = { pollingOptions: DEFAULT_POLLING_OPTIONS };
var ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
var ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
	let caller;
	if (func.annotations.includes("query") || func.annotations.includes("composite_query")) caller = async (options, ...args) => {
		options = {
			...options,
			...actor[metadataSymbol].config.queryTransform?.(methodName, args, {
				...actor[metadataSymbol].config,
				...options
			})
		};
		const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
		const cid = Principal$1.from(options.canisterId || actor[metadataSymbol].config.canisterId);
		const arg = encode$1(func.argTypes, args);
		const result = await agent.query(cid, {
			methodName,
			arg,
			effectiveCanisterId: options.effectiveCanisterId
		});
		const httpDetails = {
			...result.httpDetails,
			requestDetails: result.requestDetails
		};
		switch (result.status) {
			case QueryResponseStatus.Rejected: {
				const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
				uncertifiedRejectErrorCode.callContext = {
					canisterId: cid,
					methodName,
					httpDetails
				};
				throw RejectError.fromCode(uncertifiedRejectErrorCode);
			}
			case QueryResponseStatus.Replied: return func.annotations.includes("http-details") ? {
				httpDetails,
				result: decodeReturnValue(func.retTypes, result.reply.arg)
			} : decodeReturnValue(func.retTypes, result.reply.arg);
		}
	};
	else caller = async (options, ...args) => {
		options = {
			...options,
			...actor[metadataSymbol].config.callTransform?.(methodName, args, {
				...actor[metadataSymbol].config,
				...options
			})
		};
		const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
		const { canisterId, effectiveCanisterId, pollingOptions } = {
			...DEFAULT_ACTOR_CONFIG,
			...actor[metadataSymbol].config,
			...options
		};
		const cid = Principal$1.from(canisterId);
		const ecid = effectiveCanisterId !== void 0 ? Principal$1.from(effectiveCanisterId) : cid;
		const arg = encode$1(func.argTypes, args);
		const { requestId, response, requestDetails } = await agent.call(cid, {
			methodName,
			arg,
			effectiveCanisterId: ecid,
			nonce: options.nonce
		});
		let reply;
		let certificate;
		if (isV3ResponseBody(response.body)) {
			if (agent.rootKey == null) throw ExternalError.fromCode(new MissingRootKeyErrorCode());
			const cert = response.body.certificate;
			certificate = await Certificate.create({
				certificate: cert,
				rootKey: agent.rootKey,
				canisterId: ecid,
				blsVerify,
				agent
			});
			const path = [utf8ToBytes("request_status"), requestId];
			switch (new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])))) {
				case "replied":
					reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
					break;
				case "rejected": {
					const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
					const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
					const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
					const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0);
					certifiedRejectErrorCode.callContext = {
						canisterId: cid,
						methodName,
						httpDetails: response
					};
					throw RejectError.fromCode(certifiedRejectErrorCode);
				}
			}
		} else if (isV2ResponseBody(response.body)) {
			const { reject_code, reject_message, error_code } = response.body;
			const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
			errorCode.callContext = {
				canisterId: cid,
				methodName,
				httpDetails: response
			};
			throw RejectError.fromCode(errorCode);
		}
		if (response.status === 202) {
			const response = await pollForResponse(agent, ecid, requestId, {
				...pollingOptions,
				blsVerify
			});
			certificate = response.certificate;
			reply = response.reply;
		}
		const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
		const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
		const httpDetails = {
			...response,
			requestDetails
		};
		if (reply !== void 0) {
			if (shouldIncludeHttpDetails && shouldIncludeCertificate) return {
				httpDetails,
				certificate,
				result: decodeReturnValue(func.retTypes, reply)
			};
			else if (shouldIncludeCertificate) return {
				certificate,
				result: decodeReturnValue(func.retTypes, reply)
			};
			else if (shouldIncludeHttpDetails) return {
				httpDetails,
				result: decodeReturnValue(func.retTypes, reply)
			};
			return decodeReturnValue(func.retTypes, reply);
		} else {
			const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
			errorCode.callContext = {
				canisterId: cid,
				methodName,
				httpDetails
			};
			throw UnknownError.fromCode(errorCode);
		}
	};
	const handler = (...args) => caller({}, ...args);
	handler.withOptions = (options) => (...args) => caller(options, ...args);
	return handler;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+object-storage@0.1.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+pr_9a2618bf997df87570fd7ce304351207/node_modules/@caffeineai/object-storage/dist/StorageClient.js
var MAXIMUM_CONCURRENT_UPLOADS = 10;
var MAX_RETRIES = 3;
var BASE_DELAY_MS = 1e3;
var MAX_DELAY_MS = 3e4;
var GATEWAY_VERSION = "v1";
var HASH_ALGORITHM = "SHA-256";
var SHA256_PREFIX = "sha256:";
var DOMAIN_SEPARATOR_FOR_CHUNKS = new TextEncoder().encode("icfs-chunk/");
var DOMAIN_SEPARATOR_FOR_METADATA = new TextEncoder().encode("icfs-metadata/");
var DOMAIN_SEPARATOR_FOR_NODES = new TextEncoder().encode("ynode/");
async function withRetry(operation) {
	let lastError;
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) try {
		return await operation();
	} catch (error) {
		lastError = error instanceof Error ? error : new Error(String(error));
		const shouldRetry = isRetriableError(error);
		if (attempt === MAX_RETRIES || !shouldRetry) {
			if (!shouldRetry && attempt < MAX_RETRIES) console.warn(`Non-retriable error encountered: ${lastError.message}. Not retrying.`);
			throw error;
		}
		const delay = Math.min(BASE_DELAY_MS * 2 ** attempt + Math.random() * 1e3, MAX_DELAY_MS);
		console.warn(`Request failed (attempt ${attempt + 1}/4): ${lastError.message}. Retrying in ${Math.round(delay)}ms...`);
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
	throw lastError || /* @__PURE__ */ new Error("Unknown error occurred during retry attempts");
}
function isRetriableError(error) {
	const errorMessage = error?.message?.toLowerCase() || "";
	if (error?.response?.status) {
		const status = error.response.status;
		if (status === 408 || status === 429) return true;
		if (status >= 400 && status < 500) return false;
		if (status >= 500) return true;
	}
	if (errorMessage.includes("ssl") || errorMessage.includes("tls") || errorMessage.includes("network error") || errorMessage.includes("connection") || errorMessage.includes("timeout") || errorMessage.includes("fetch")) return true;
	if (errorMessage.includes("validation") || errorMessage.includes("invalid") || errorMessage.includes("malformed") || errorMessage.includes("unauthorized") || errorMessage.includes("forbidden") || errorMessage.includes("not found")) return false;
	return true;
}
function validateHashFormat(hash, context) {
	if (!hash) throw new Error(`${context}: Hash cannot be empty`);
	if (!hash.startsWith(SHA256_PREFIX)) throw new Error(`${context}: Invalid hash format. Expected format: ${SHA256_PREFIX}<64-char-hex>, got: ${hash}`);
	const hexPart = hash.substring(7);
	if (hexPart.length !== 64) throw new Error(`${context}: Invalid hash format. Expected 64 hex characters after ${SHA256_PREFIX}, got ${hexPart.length} characters: ${hash}`);
	if (!/^[0-9a-f]{64}$/i.test(hexPart)) throw new Error(`${context}: Invalid hash format. Hash must contain only hex characters (0-9, a-f), got: ${hash}`);
}
var YHash = class YHash {
	bytes;
	constructor(bytes) {
		if (bytes.length !== 32) throw new Error(`YHash must be exactly 32 bytes, got ${bytes.length}`);
		this.bytes = new Uint8Array(bytes);
	}
	static async fromNodes(left, right) {
		const leftBytes = left instanceof YHash ? left.bytes : new TextEncoder().encode("UNBALANCED");
		const rightBytes = right instanceof YHash ? right.bytes : new TextEncoder().encode("UNBALANCED");
		const combined = new Uint8Array(DOMAIN_SEPARATOR_FOR_NODES.length + leftBytes.length + rightBytes.length);
		const arrays = [
			DOMAIN_SEPARATOR_FOR_NODES,
			leftBytes,
			rightBytes
		];
		let offset = 0;
		for (const data of arrays) {
			combined.set(data, offset);
			offset += data.length;
		}
		const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, combined);
		return new YHash(new Uint8Array(hashBuffer));
	}
	static async fromChunk(data) {
		return YHash.fromBytes(DOMAIN_SEPARATOR_FOR_CHUNKS, data);
	}
	static async fromHeaders(headers) {
		const headerLines = [];
		for (const [key, value] of Object.entries(headers)) headerLines.push(`${key.trim()}: ${value.trim()}\n`);
		headerLines.sort();
		return await YHash.fromBytes(DOMAIN_SEPARATOR_FOR_METADATA, new TextEncoder().encode(headerLines.join("")));
	}
	static async fromBytes(domainSeparator, data) {
		const combined = new Uint8Array(domainSeparator.length + data.length);
		combined.set(domainSeparator);
		combined.set(data, domainSeparator.length);
		const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, combined);
		return new YHash(new Uint8Array(hashBuffer));
	}
	static fromHex(hexString) {
		const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)));
		return new YHash(bytes);
	}
	toShaString() {
		return `${SHA256_PREFIX}${this.toHex()}`;
	}
	toString() {
		throw new Error("toString is not supported for YHash");
	}
	toHex() {
		return Array.from(this.bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
};
function nodeToJSON(node) {
	return {
		hash: node.hash.toShaString(),
		left: node.left ? nodeToJSON(node.left) : null,
		right: node.right ? nodeToJSON(node.right) : null
	};
}
var BlobHashTree = class BlobHashTree {
	tree_type;
	chunk_hashes;
	tree;
	headers;
	constructor(chunk_hashes, tree, headers = null) {
		this.tree_type = "DSBMTWH";
		this.chunk_hashes = chunk_hashes;
		this.tree = tree;
		if (headers == null) this.headers = [];
		else if (Array.isArray(headers)) this.headers = headers;
		else this.headers = Object.entries(headers).map(([key, value]) => `${key.trim()}: ${value.trim()}`);
		this.headers.sort();
	}
	static async build(chunkHashes, headers = {}) {
		if (chunkHashes.length === 0) {
			const bytes = new TextEncoder().encode("8b8e620f084e48da0be2287fd12c5aaa4dbe14b468fd2e360f48d741fe7628a0");
			chunkHashes.push(new YHash(bytes));
		}
		let level = chunkHashes.map((hash) => ({
			hash,
			left: null,
			right: null
		}));
		while (level.length > 1) {
			const nextLevel = [];
			for (let i = 0; i < level.length; i += 2) {
				const left = level[i];
				const right = level[i + 1] || null;
				const parentHash = await YHash.fromNodes(left.hash, right ? right.hash : null);
				nextLevel.push({
					hash: parentHash,
					left,
					right
				});
			}
			level = nextLevel;
		}
		const chunksRoot = level[0];
		if (headers && Object.keys(headers).length > 0) {
			const metadataRoot = {
				hash: await YHash.fromHeaders(headers),
				left: null,
				right: null
			};
			const combinedRoot = {
				hash: await YHash.fromNodes(chunksRoot.hash, metadataRoot.hash),
				left: chunksRoot,
				right: metadataRoot
			};
			return new BlobHashTree(chunkHashes, combinedRoot, headers);
		}
		return new BlobHashTree(chunkHashes, chunksRoot, headers);
	}
	toJSON() {
		return {
			tree_type: this.tree_type,
			chunk_hashes: this.chunk_hashes.map((h) => h.toShaString()),
			tree: nodeToJSON(this.tree),
			headers: this.headers
		};
	}
};
var StorageGatewayClient = class {
	storageGatewayUrl;
	constructor(storageGatewayUrl) {
		this.storageGatewayUrl = storageGatewayUrl;
	}
	getStorageGatewayUrl() {
		return this.storageGatewayUrl;
	}
	async uploadChunk(params) {
		const blobHashString = params.blobRootHash.toShaString();
		const chunkHashString = params.chunkHash.toShaString();
		validateHashFormat(blobHashString, `uploadChunk[${params.chunkIndex}] blob_hash`);
		validateHashFormat(chunkHashString, `uploadChunk[${params.chunkIndex}] chunk_hash`);
		return await withRetry(async () => {
			const queryParams = new URLSearchParams({
				owner_id: params.owner,
				blob_hash: blobHashString,
				chunk_hash: chunkHashString,
				chunk_index: params.chunkIndex.toString(),
				bucket_name: params.bucketName,
				project_id: params.projectId
			});
			const url = `${this.storageGatewayUrl}/${GATEWAY_VERSION}/chunk/?${queryParams.toString()}`;
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/octet-stream",
					"X-Caffeine-Project-ID": params.projectId
				},
				body: params.chunkData
			});
			if (!response.ok) {
				const errorText = await response.text();
				const error = /* @__PURE__ */ new Error(`Failed to upload chunk ${params.chunkIndex}: ${response.status} ${response.statusText} - ${errorText}`);
				error.response = { status: response.status };
				throw error;
			}
			return { isComplete: (await response.json()).status === "blob_complete" };
		});
	}
	async uploadBlobTree(blobHashTree, bucketName, numBlobBytes, owner, projectId, certificateBytes) {
		const treeJSON = blobHashTree.toJSON();
		validateHashFormat(treeJSON.tree.hash, "uploadBlobTree root hash");
		treeJSON.chunk_hashes.forEach((hash, index) => {
			validateHashFormat(hash, `uploadBlobTree chunk_hash[${index}]`);
		});
		return await withRetry(async () => {
			const url = `${this.storageGatewayUrl}/${GATEWAY_VERSION}/blob-tree/`;
			const requestBody = {
				blob_tree: treeJSON,
				bucket_name: bucketName,
				num_blob_bytes: numBlobBytes,
				owner,
				project_id: projectId,
				headers: blobHashTree.headers,
				auth: { OwnerEgressSignature: Array.from(certificateBytes) }
			};
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-Caffeine-Project-ID": projectId
				},
				body: JSON.stringify(requestBody)
			});
			if (!response.ok) {
				const errorText = await response.text();
				const error = /* @__PURE__ */ new Error(`Failed to upload blob tree: ${response.status} ${response.statusText} - ${errorText}`);
				error.response = { status: response.status };
				throw error;
			}
		});
	}
};
var StorageClient = class {
	bucket;
	backendCanisterId;
	projectId;
	agent;
	storageGatewayClient;
	constructor(bucket, storageGatewayUrl, backendCanisterId, projectId, agent) {
		this.bucket = bucket;
		this.backendCanisterId = backendCanisterId;
		this.projectId = projectId;
		this.agent = agent;
		this.storageGatewayClient = new StorageGatewayClient(storageGatewayUrl);
	}
	async getCertificate(hash) {
		const args = encode$1([Text], [hash]);
		const respone = (await this.agent.call(this.backendCanisterId, {
			methodName: "_immutableObjectStorageCreateCertificate",
			arg: args
		})).response.body;
		if (isV3ResponseBody(respone)) {
			console.log("Certificate:", respone.certificate);
			return respone.certificate;
		}
		throw new Error("Expected v3 response body");
	}
	async putFile(blobBytes, onProgress) {
		const httpHeaders = { "Content-Type": "application/json" };
		const file = new Blob([new Uint8Array(blobBytes)], { type: "application/octet-stream" });
		const fileHeaders = {
			"Content-Type": "application/octet-stream",
			"Content-Length": file.size.toString()
		};
		const { chunks, chunkHashes, blobHashTree } = await this.processFileForUpload(file, fileHeaders);
		const blobRootHash = blobHashTree.tree.hash;
		const hashString = blobRootHash.toShaString();
		const certificateBytes = await this.getCertificate(hashString);
		await this.storageGatewayClient.uploadBlobTree(blobHashTree, this.bucket, file.size, this.backendCanisterId, this.projectId, certificateBytes);
		await this.parallelUpload(chunks, chunkHashes, blobRootHash, httpHeaders, onProgress);
		return { hash: hashString };
	}
	async getDirectURL(hash) {
		if (!hash) throw new Error("Hash must not be empty");
		validateHashFormat(hash, `getDirectURL for path '${hash}'`);
		return `${this.storageGatewayClient.getStorageGatewayUrl()}/${GATEWAY_VERSION}/blob/?blob_hash=${encodeURIComponent(hash)}&owner_id=${encodeURIComponent(this.backendCanisterId)}&project_id=${encodeURIComponent(this.projectId)}`;
	}
	async processFileForUpload(file, headers) {
		const chunks = this.createFileChunks(file);
		const chunkHashes = [];
		for (let i = 0; i < chunks.length; i++) {
			const chunkData = new Uint8Array(await chunks[i].arrayBuffer());
			const hash = await YHash.fromChunk(chunkData);
			chunkHashes.push(hash);
		}
		return {
			chunks,
			chunkHashes,
			blobHashTree: await BlobHashTree.build(chunkHashes, headers)
		};
	}
	async parallelUpload(chunks, chunkHashes, blobRootHash, httpHeaders, onProgress) {
		let completedChunks = 0;
		const uploadSingleChunk = async (index) => {
			const chunkData = new Uint8Array(await chunks[index].arrayBuffer());
			const chunkHash = chunkHashes[index];
			await this.storageGatewayClient.uploadChunk({
				blobRootHash,
				chunkHash,
				chunkIndex: index,
				chunkData,
				bucketName: this.bucket,
				owner: this.backendCanisterId,
				projectId: this.projectId,
				httpHeaders
			});
			const currentCompleted = ++completedChunks;
			if (onProgress != null) onProgress(chunks.length === 0 ? 100 : Math.round(currentCompleted / chunks.length * 100));
		};
		await Promise.all(Array.from({ length: MAXIMUM_CONCURRENT_UPLOADS }, async (_, workerId) => {
			for (let i = workerId; i < chunks.length; i += MAXIMUM_CONCURRENT_UPLOADS) await uploadSingleChunk(i);
		}));
	}
	createFileChunks(file, chunkSize = 1048576) {
		const chunks = [];
		const totalChunks = Math.ceil(file.size / chunkSize);
		for (let index = 0; index < totalChunks; index++) {
			const start = index * chunkSize;
			const end = Math.min(start + chunkSize, file.size);
			const chunk = file.slice(start, end);
			chunks.push(chunk);
		}
		return chunks;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+core-infrastructure@0.3.0_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfini_10187b72062abae00e434424dbd4946d/node_modules/@caffeineai/core-infrastructure/dist/config.js
var DEFAULT_STORAGE_GATEWAY_URL = "https://blob.caffeine.ai";
var DEFAULT_BUCKET_NAME = "default-bucket";
var DEFAULT_PROJECT_ID = "0000000-0000-0000-0000-00000000000";
var configCache = null;
async function loadConfig() {
	if (configCache) return configCache;
	const backendCanisterId = {}.CANISTER_ID_BACKEND;
	const envBaseUrl = {}.BASE_URL || "/";
	const baseUrl = envBaseUrl.endsWith("/") ? envBaseUrl : `${envBaseUrl}/`;
	try {
		const config = await (await fetch(`${baseUrl}env.json`)).json();
		if (!backendCanisterId && config.backend_canister_id === "undefined") {
			console.error("CANISTER_ID_BACKEND is not set");
			throw new Error("CANISTER_ID_BACKEND is not set");
		}
		const runtimeStorageGatewayUrl = config.storage_gateway_url && config.storage_gateway_url !== "undefined" ? config.storage_gateway_url : void 0;
		const fullConfig = {
			backend_host: config.backend_host === "undefined" ? void 0 : config.backend_host,
			backend_canister_id: config.backend_canister_id === "undefined" ? backendCanisterId : config.backend_canister_id,
			storage_gateway_url: runtimeStorageGatewayUrl ?? "https://blob.caffeine.ai" ?? "nogateway",
			bucket_name: DEFAULT_BUCKET_NAME,
			project_id: config.project_id !== "undefined" ? config.project_id : DEFAULT_PROJECT_ID,
			ii_derivation_origin: config.ii_derivation_origin === "undefined" ? void 0 : config.ii_derivation_origin
		};
		configCache = fullConfig;
		return fullConfig;
	} catch {
		if (!backendCanisterId) {
			console.error("CANISTER_ID_BACKEND is not set");
			throw new Error("CANISTER_ID_BACKEND is not set");
		}
		return {
			backend_host: void 0,
			backend_canister_id: backendCanisterId,
			storage_gateway_url: DEFAULT_STORAGE_GATEWAY_URL,
			bucket_name: DEFAULT_BUCKET_NAME,
			project_id: DEFAULT_PROJECT_ID,
			ii_derivation_origin: void 0
		};
	}
}
function extractAgentErrorMessage(error) {
	const errorString = String(error);
	const match = errorString.match(/with message:\s*'([^']+)'/s);
	return match ? match[1] : errorString;
}
function processError(e) {
	if (e && typeof e === "object" && "message" in e) throw new Error(extractAgentErrorMessage(`${e.message}`));
	throw e;
}
async function maybeLoadMockBackend() {
	return null;
}
async function createActorWithConfig(createActor, options) {
	const mock = await maybeLoadMockBackend();
	if (mock) return mock;
	const config = await loadConfig();
	const resolvedOptions = options ?? {};
	const agent = new HttpAgent({
		...resolvedOptions.agentOptions,
		host: config.backend_host
	});
	if (config.backend_host?.includes("localhost")) await agent.fetchRootKey().catch((err) => {
		console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
		console.error(err);
	});
	const actorOptions = {
		...resolvedOptions,
		agent,
		processError
	};
	const storageClient = new StorageClient(config.bucket_name, config.storage_gateway_url, config.backend_canister_id, config.project_id, agent);
	const MOTOKO_DEDUPLICATION_SENTINEL = "!caf!";
	const uploadFile = async (file) => {
		const { hash } = await storageClient.putFile(await file.getBytes(), file.onProgress);
		return new TextEncoder().encode(MOTOKO_DEDUPLICATION_SENTINEL + hash);
	};
	const downloadFile = async (bytes) => {
		const hash = new TextDecoder().decode(new Uint8Array(bytes)).substring(5);
		const url = await storageClient.getDirectURL(hash);
		return ExternalBlob.fromURL(url);
	};
	return createActor(config.backend_canister_id, uploadFile, downloadFile, actorOptions);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/subscribable.js
var Subscribable = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
		this.subscribe = this.subscribe.bind(this);
	}
	subscribe(listener) {
		this.listeners.add(listener);
		this.onSubscribe();
		return () => {
			this.listeners.delete(listener);
			this.onUnsubscribe();
		};
	}
	hasListeners() {
		return this.listeners.size > 0;
	}
	onSubscribe() {}
	onUnsubscribe() {}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/focusManager.js
var FocusManager = class extends Subscribable {
	#focused;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onFocus) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const listener = () => onFocus();
				window.addEventListener("visibilitychange", listener, false);
				return () => {
					window.removeEventListener("visibilitychange", listener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup((focused) => {
			if (typeof focused === "boolean") this.setFocused(focused);
			else this.onFocus();
		});
	}
	setFocused(focused) {
		if (this.#focused !== focused) {
			this.#focused = focused;
			this.onFocus();
		}
	}
	onFocus() {
		const isFocused = this.isFocused();
		this.listeners.forEach((listener) => {
			listener(isFocused);
		});
	}
	isFocused() {
		if (typeof this.#focused === "boolean") return this.#focused;
		return globalThis.document?.visibilityState !== "hidden";
	}
};
var focusManager = new FocusManager();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/timeoutManager.js
var defaultTimeoutProvider = {
	setTimeout: (callback, delay) => setTimeout(callback, delay),
	clearTimeout: (timeoutId) => clearTimeout(timeoutId),
	setInterval: (callback, delay) => setInterval(callback, delay),
	clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
	#provider = defaultTimeoutProvider;
	#providerCalled = false;
	setTimeoutProvider(provider) {
		this.#provider = provider;
	}
	setTimeout(callback, delay) {
		return this.#provider.setTimeout(callback, delay);
	}
	clearTimeout(timeoutId) {
		this.#provider.clearTimeout(timeoutId);
	}
	setInterval(callback, delay) {
		return this.#provider.setInterval(callback, delay);
	}
	clearInterval(intervalId) {
		this.#provider.clearInterval(intervalId);
	}
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
	setTimeout(callback, 0);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/utils.js
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {}
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
	return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
	return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
	return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
	return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
	const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
	if (queryKey) {
		if (exact) {
			if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
		} else if (!partialMatchKey(query.queryKey, queryKey)) return false;
	}
	if (type !== "all") {
		const isActive = query.isActive();
		if (type === "active" && !isActive) return false;
		if (type === "inactive" && isActive) return false;
	}
	if (typeof stale === "boolean" && query.isStale() !== stale) return false;
	if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
	if (predicate && !predicate(query)) return false;
	return true;
}
function matchMutation(filters, mutation) {
	const { exact, status, predicate, mutationKey } = filters;
	if (mutationKey) {
		if (!mutation.options.mutationKey) return false;
		if (exact) {
			if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
		} else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
	}
	if (status && mutation.state.status !== status) return false;
	if (predicate && !predicate(mutation)) return false;
	return true;
}
function hashQueryKeyByOptions(queryKey, options) {
	return (options?.queryKeyHashFn || hashKey)(queryKey);
}
function hashKey(queryKey) {
	return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
		result[key] = val[key];
		return result;
	}, {}) : val);
}
function partialMatchKey(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a && b && typeof a === "object" && typeof b === "object") return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
	return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
	if (a === b) return a;
	if (depth > 500) return b;
	const array = isPlainArray(a) && isPlainArray(b);
	if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
	const aSize = (array ? a : Object.keys(a)).length;
	const bItems = array ? b : Object.keys(b);
	const bSize = bItems.length;
	const copy = array ? new Array(bSize) : {};
	let equalItems = 0;
	for (let i = 0; i < bSize; i++) {
		const key = array ? i : bItems[i];
		const aItem = a[key];
		const bItem = b[key];
		if (aItem === bItem) {
			copy[key] = aItem;
			if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
			continue;
		}
		if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
			copy[key] = bItem;
			continue;
		}
		const v = replaceEqualDeep(aItem, bItem, depth + 1);
		copy[key] = v;
		if (v === aItem) equalItems++;
	}
	return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
	if (!b || Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) if (a[key] !== b[key]) return false;
	return true;
}
function isPlainArray(value) {
	return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	if (Object.getPrototypeOf(o) !== Object.prototype) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
	return new Promise((resolve) => {
		timeoutManager.setTimeout(resolve, timeout);
	});
}
function replaceData(prevData, data, options) {
	if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
	else if (options.structuralSharing !== false) return replaceEqualDeep(prevData, data);
	return data;
}
function addToEnd(items, item, max = 0) {
	const newItems = [...items, item];
	return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
	const newItems = [item, ...items];
	return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
	if (!options.queryFn && fetchOptions?.initialPromise) return () => fetchOptions.initialPromise;
	if (!options.queryFn || options.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
	return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
	if (typeof throwOnError === "function") return throwOnError(...params);
	return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
	let consumed = false;
	let signal;
	Object.defineProperty(object, "signal", {
		enumerable: true,
		get: () => {
			signal ??= getSignal();
			if (consumed) return signal;
			consumed = true;
			if (signal.aborted) onCancelled();
			else signal.addEventListener("abort", onCancelled, { once: true });
			return signal;
		}
	});
	return object;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/environmentManager.js
var environmentManager = /* @__PURE__ */ (() => {
	let isServerFn = () => isServer;
	return {
		/**
		* Returns whether the current runtime should be treated as a server environment.
		*/
		isServer() {
			return isServerFn();
		},
		/**
		* Overrides the server check globally.
		*/
		setIsServer(isServerValue) {
			isServerFn = isServerValue;
		}
	};
})();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/thenable.js
function pendingThenable() {
	let resolve;
	let reject;
	const thenable = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	thenable.status = "pending";
	thenable.catch(() => {});
	function finalize(data) {
		Object.assign(thenable, data);
		delete thenable.resolve;
		delete thenable.reject;
	}
	thenable.resolve = (value) => {
		finalize({
			status: "fulfilled",
			value
		});
		resolve(value);
	};
	thenable.reject = (reason) => {
		finalize({
			status: "rejected",
			reason
		});
		reject(reason);
	};
	return thenable;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
	let queue = [];
	let transactions = 0;
	let notifyFn = (callback) => {
		callback();
	};
	let batchNotifyFn = (callback) => {
		callback();
	};
	let scheduleFn = defaultScheduler;
	const schedule = (callback) => {
		if (transactions) queue.push(callback);
		else scheduleFn(() => {
			notifyFn(callback);
		});
	};
	const flush = () => {
		const originalQueue = queue;
		queue = [];
		if (originalQueue.length) scheduleFn(() => {
			batchNotifyFn(() => {
				originalQueue.forEach((callback) => {
					notifyFn(callback);
				});
			});
		});
	};
	return {
		batch: (callback) => {
			let result;
			transactions++;
			try {
				result = callback();
			} finally {
				transactions--;
				if (!transactions) flush();
			}
			return result;
		},
		/**
		* All calls to the wrapped function will be batched.
		*/
		batchCalls: (callback) => {
			return (...args) => {
				schedule(() => {
					callback(...args);
				});
			};
		},
		schedule,
		/**
		* Use this method to set a custom notify function.
		* This can be used to for example wrap notifications with `React.act` while running tests.
		*/
		setNotifyFunction: (fn) => {
			notifyFn = fn;
		},
		/**
		* Use this method to set a custom function to batch notifications together into a single tick.
		* By default React Query will use the batch function provided by ReactDOM or React Native.
		*/
		setBatchNotifyFunction: (fn) => {
			batchNotifyFn = fn;
		},
		setScheduler: (fn) => {
			scheduleFn = fn;
		}
	};
}
var notifyManager = createNotifyManager();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/onlineManager.js
var OnlineManager = class extends Subscribable {
	#online = true;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onOnline) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const onlineListener = () => onOnline(true);
				const offlineListener = () => onOnline(false);
				window.addEventListener("online", onlineListener, false);
				window.addEventListener("offline", offlineListener, false);
				return () => {
					window.removeEventListener("online", onlineListener);
					window.removeEventListener("offline", offlineListener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup(this.setOnline.bind(this));
	}
	setOnline(online) {
		if (this.#online !== online) {
			this.#online = online;
			this.listeners.forEach((listener) => {
				listener(online);
			});
		}
	}
	isOnline() {
		return this.#online;
	}
};
var onlineManager = new OnlineManager();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/retryer.js
function defaultRetryDelay(failureCount) {
	return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
	return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
	constructor(options) {
		super("CancelledError");
		this.revert = options?.revert;
		this.silent = options?.silent;
	}
};
function createRetryer(config) {
	let isRetryCancelled = false;
	let failureCount = 0;
	let continueFn;
	const thenable = pendingThenable();
	const isResolved = () => thenable.status !== "pending";
	const cancel = (cancelOptions) => {
		if (!isResolved()) {
			const error = new CancelledError(cancelOptions);
			reject(error);
			config.onCancel?.(error);
		}
	};
	const cancelRetry = () => {
		isRetryCancelled = true;
	};
	const continueRetry = () => {
		isRetryCancelled = false;
	};
	const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
	const canStart = () => canFetch(config.networkMode) && config.canRun();
	const resolve = (value) => {
		if (!isResolved()) {
			continueFn?.();
			thenable.resolve(value);
		}
	};
	const reject = (value) => {
		if (!isResolved()) {
			continueFn?.();
			thenable.reject(value);
		}
	};
	const pause = () => {
		return new Promise((continueResolve) => {
			continueFn = (value) => {
				if (isResolved() || canContinue()) continueResolve(value);
			};
			config.onPause?.();
		}).then(() => {
			continueFn = void 0;
			if (!isResolved()) config.onContinue?.();
		});
	};
	const run = () => {
		if (isResolved()) return;
		let promiseOrValue;
		const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
		try {
			promiseOrValue = initialPromise ?? config.fn();
		} catch (error) {
			promiseOrValue = Promise.reject(error);
		}
		Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
			if (isResolved()) return;
			const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
			const retryDelay = config.retryDelay ?? defaultRetryDelay;
			const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
			const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
			if (isRetryCancelled || !shouldRetry) {
				reject(error);
				return;
			}
			failureCount++;
			config.onFail?.(failureCount, error);
			sleep(delay).then(() => {
				return canContinue() ? void 0 : pause();
			}).then(() => {
				if (isRetryCancelled) reject(error);
				else run();
			});
		});
	};
	return {
		promise: thenable,
		status: () => thenable.status,
		cancel,
		continue: () => {
			continueFn?.();
			return thenable;
		},
		cancelRetry,
		continueRetry,
		canStart,
		start: () => {
			if (canStart()) run();
			else pause().then(run);
			return thenable;
		}
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/removable.js
var Removable = class {
	#gcTimeout;
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout();
		if (isValidTimeout(this.gcTime)) this.#gcTimeout = timeoutManager.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime);
	}
	updateGcTime(newGcTime) {
		this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (environmentManager.isServer() ? Infinity : 3e5));
	}
	clearGcTimeout() {
		if (this.#gcTimeout) {
			timeoutManager.clearTimeout(this.#gcTimeout);
			this.#gcTimeout = void 0;
		}
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/query.js
var Query = class extends Removable {
	#initialState;
	#revertState;
	#cache;
	#client;
	#retryer;
	#defaultOptions;
	#abortSignalConsumed;
	constructor(config) {
		super();
		this.#abortSignalConsumed = false;
		this.#defaultOptions = config.defaultOptions;
		this.setOptions(config.options);
		this.observers = [];
		this.#client = config.client;
		this.#cache = this.#client.getQueryCache();
		this.queryKey = config.queryKey;
		this.queryHash = config.queryHash;
		this.#initialState = getDefaultState$1(this.options);
		this.state = config.state ?? this.#initialState;
		this.scheduleGc();
	}
	get meta() {
		return this.options.meta;
	}
	get promise() {
		return this.#retryer?.promise;
	}
	setOptions(options) {
		this.options = {
			...this.#defaultOptions,
			...options
		};
		this.updateGcTime(this.options.gcTime);
		if (this.state && this.state.data === void 0) {
			const defaultState = getDefaultState$1(this.options);
			if (defaultState.data !== void 0) {
				this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
				this.#initialState = defaultState;
			}
		}
	}
	optionalRemove() {
		if (!this.observers.length && this.state.fetchStatus === "idle") this.#cache.remove(this);
	}
	setData(newData, options) {
		const data = replaceData(this.state.data, newData, this.options);
		this.#dispatch({
			data,
			type: "success",
			dataUpdatedAt: options?.updatedAt,
			manual: options?.manual
		});
		return data;
	}
	setState(state, setStateOptions) {
		this.#dispatch({
			type: "setState",
			state,
			setStateOptions
		});
	}
	cancel(options) {
		const promise = this.#retryer?.promise;
		this.#retryer?.cancel(options);
		return promise ? promise.then(noop).catch(noop) : Promise.resolve();
	}
	destroy() {
		super.destroy();
		this.cancel({ silent: true });
	}
	get resetState() {
		return this.#initialState;
	}
	reset() {
		this.destroy();
		this.setState(this.resetState);
	}
	isActive() {
		return this.observers.some((observer) => resolveEnabled(observer.options.enabled, this) !== false);
	}
	isDisabled() {
		if (this.getObserversCount() > 0) return !this.isActive();
		return this.options.queryFn === skipToken || !this.isFetched();
	}
	isFetched() {
		return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
	}
	isStatic() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => resolveStaleTime(observer.options.staleTime, this) === "static");
		return false;
	}
	isStale() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
		return this.state.data === void 0 || this.state.isInvalidated;
	}
	isStaleByTime(staleTime = 0) {
		if (this.state.data === void 0) return true;
		if (staleTime === "static") return false;
		if (this.state.isInvalidated) return true;
		return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
	}
	onFocus() {
		this.observers.find((x) => x.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	onOnline() {
		this.observers.find((x) => x.shouldFetchOnReconnect())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	addObserver(observer) {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
			this.clearGcTimeout();
			this.#cache.notify({
				type: "observerAdded",
				query: this,
				observer
			});
		}
	}
	removeObserver(observer) {
		if (this.observers.includes(observer)) {
			this.observers = this.observers.filter((x) => x !== observer);
			if (!this.observers.length) {
				if (this.#retryer) {
					if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) this.#retryer.cancel({ revert: true });
					else this.#retryer.cancelRetry();
				}
				this.scheduleGc();
			}
			this.#cache.notify({
				type: "observerRemoved",
				query: this,
				observer
			});
		}
	}
	getObserversCount() {
		return this.observers.length;
	}
	#isInitialPausedFetch() {
		return this.state.fetchStatus === "paused" && this.state.status === "pending";
	}
	invalidate() {
		if (!this.state.isInvalidated) this.#dispatch({ type: "invalidate" });
	}
	async fetch(options, fetchOptions) {
		if (this.state.fetchStatus !== "idle" && this.#retryer?.status() !== "rejected") {
			if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) this.cancel({ silent: true });
			else if (this.#retryer) {
				this.#retryer.continueRetry();
				return this.#retryer.promise;
			}
		}
		if (options) this.setOptions(options);
		if (!this.options.queryFn) {
			const observer = this.observers.find((x) => x.options.queryFn);
			if (observer) this.setOptions(observer.options);
		}
		const abortController = new AbortController();
		const addSignalProperty = (object) => {
			Object.defineProperty(object, "signal", {
				enumerable: true,
				get: () => {
					this.#abortSignalConsumed = true;
					return abortController.signal;
				}
			});
		};
		const fetchFn = () => {
			const queryFn = ensureQueryFn(this.options, fetchOptions);
			const createQueryFnContext = () => {
				const queryFnContext2 = {
					client: this.#client,
					queryKey: this.queryKey,
					meta: this.meta
				};
				addSignalProperty(queryFnContext2);
				return queryFnContext2;
			};
			const queryFnContext = createQueryFnContext();
			this.#abortSignalConsumed = false;
			if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
			return queryFn(queryFnContext);
		};
		const createFetchContext = () => {
			const context2 = {
				fetchOptions,
				options: this.options,
				queryKey: this.queryKey,
				client: this.#client,
				state: this.state,
				fetchFn
			};
			addSignalProperty(context2);
			return context2;
		};
		const context = createFetchContext();
		this.options.behavior?.onFetch(context, this);
		this.#revertState = this.state;
		if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) this.#dispatch({
			type: "fetch",
			meta: context.fetchOptions?.meta
		});
		this.#retryer = createRetryer({
			initialPromise: fetchOptions?.initialPromise,
			fn: context.fetchFn,
			onCancel: (error) => {
				if (error instanceof CancelledError && error.revert) this.setState({
					...this.#revertState,
					fetchStatus: "idle"
				});
				abortController.abort();
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue: () => {
				this.#dispatch({ type: "continue" });
			},
			retry: context.options.retry,
			retryDelay: context.options.retryDelay,
			networkMode: context.options.networkMode,
			canRun: () => true
		});
		try {
			const data = await this.#retryer.start();
			if (data === void 0) throw new Error(`${this.queryHash} data is undefined`);
			this.setData(data);
			this.#cache.config.onSuccess?.(data, this);
			this.#cache.config.onSettled?.(data, this.state.error, this);
			return data;
		} catch (error) {
			if (error instanceof CancelledError) {
				if (error.silent) return this.#retryer.promise;
				else if (error.revert) {
					if (this.state.data === void 0) throw error;
					return this.state.data;
				}
			}
			this.#dispatch({
				type: "error",
				error
			});
			this.#cache.config.onError?.(error, this);
			this.#cache.config.onSettled?.(this.state.data, error, this);
			throw error;
		} finally {
			this.scheduleGc();
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					fetchFailureCount: action.failureCount,
					fetchFailureReason: action.error
				};
				case "pause": return {
					...state,
					fetchStatus: "paused"
				};
				case "continue": return {
					...state,
					fetchStatus: "fetching"
				};
				case "fetch": return {
					...state,
					...fetchState(state.data, this.options),
					fetchMeta: action.meta ?? null
				};
				case "success":
					const newState = {
						...state,
						...successState(action.data, action.dataUpdatedAt),
						dataUpdateCount: state.dataUpdateCount + 1,
						...!action.manual && {
							fetchStatus: "idle",
							fetchFailureCount: 0,
							fetchFailureReason: null
						}
					};
					this.#revertState = action.manual ? newState : void 0;
					return newState;
				case "error":
					const error = action.error;
					return {
						...state,
						error,
						errorUpdateCount: state.errorUpdateCount + 1,
						errorUpdatedAt: Date.now(),
						fetchFailureCount: state.fetchFailureCount + 1,
						fetchFailureReason: error,
						fetchStatus: "idle",
						status: "error",
						isInvalidated: true
					};
				case "invalidate": return {
					...state,
					isInvalidated: true
				};
				case "setState": return {
					...state,
					...action.state
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.observers.forEach((observer) => {
				observer.onQueryUpdate();
			});
			this.#cache.notify({
				query: this,
				type: "updated",
				action
			});
		});
	}
};
function fetchState(data, options) {
	return {
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
		...data === void 0 && {
			error: null,
			status: "pending"
		}
	};
}
function successState(data, dataUpdatedAt) {
	return {
		data,
		dataUpdatedAt: dataUpdatedAt ?? Date.now(),
		error: null,
		isInvalidated: false,
		status: "success"
	};
}
function getDefaultState$1(options) {
	const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
	const hasData = data !== void 0;
	const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
	return {
		data,
		dataUpdateCount: 0,
		dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: false,
		status: hasData ? "success" : "pending",
		fetchStatus: "idle"
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/queryObserver.js
var QueryObserver = class extends Subscribable {
	constructor(client, options) {
		super();
		this.options = options;
		this.#client = client;
		this.#selectError = null;
		this.#currentThenable = pendingThenable();
		this.bindMethods();
		this.setOptions(options);
	}
	#client;
	#currentQuery = void 0;
	#currentQueryInitialState = void 0;
	#currentResult = void 0;
	#currentResultState;
	#currentResultOptions;
	#currentThenable;
	#selectError;
	#selectFn;
	#selectResult;
	#lastQueryWithDefinedData;
	#staleTimeoutId;
	#refetchIntervalId;
	#currentRefetchInterval;
	#trackedProps = /* @__PURE__ */ new Set();
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		if (this.listeners.size === 1) {
			this.#currentQuery.addObserver(this);
			if (shouldFetchOnMount(this.#currentQuery, this.options)) this.#executeFetch();
			else this.updateResult();
			this.#updateTimers();
		}
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.destroy();
	}
	shouldFetchOnReconnect() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnReconnect);
	}
	shouldFetchOnWindowFocus() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnWindowFocus);
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		this.#clearStaleTimeout();
		this.#clearRefetchInterval();
		this.#currentQuery.removeObserver(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		const prevQuery = this.#currentQuery;
		this.options = this.#client.defaultQueryOptions(options);
		if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, this.#currentQuery) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#updateQuery();
		this.#currentQuery.setOptions(this.options);
		if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) this.#client.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#currentQuery,
			observer: this
		});
		const mounted = this.hasListeners();
		if (mounted && shouldFetchOptionally(this.#currentQuery, prevQuery, this.options, prevOptions)) this.#executeFetch();
		this.updateResult();
		if (mounted && (this.#currentQuery !== prevQuery || resolveEnabled(this.options.enabled, this.#currentQuery) !== resolveEnabled(prevOptions.enabled, this.#currentQuery) || resolveStaleTime(this.options.staleTime, this.#currentQuery) !== resolveStaleTime(prevOptions.staleTime, this.#currentQuery))) this.#updateStaleTimeout();
		const nextRefetchInterval = this.#computeRefetchInterval();
		if (mounted && (this.#currentQuery !== prevQuery || resolveEnabled(this.options.enabled, this.#currentQuery) !== resolveEnabled(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) this.#updateRefetchInterval(nextRefetchInterval);
	}
	getOptimisticResult(options) {
		const query = this.#client.getQueryCache().build(this.#client, options);
		const result = this.createResult(query, options);
		if (shouldAssignObserverCurrentProperties(this, result)) {
			this.#currentResult = result;
			this.#currentResultOptions = this.options;
			this.#currentResultState = this.#currentQuery.state;
		}
		return result;
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	trackResult(result, onPropTracked) {
		return new Proxy(result, { get: (target, key) => {
			this.trackProp(key);
			onPropTracked?.(key);
			if (key === "promise") {
				this.trackProp("data");
				if (!this.options.experimental_prefetchInRender && this.#currentThenable.status === "pending") this.#currentThenable.reject(/* @__PURE__ */ new Error("experimental_prefetchInRender feature flag is not enabled"));
			}
			return Reflect.get(target, key);
		} });
	}
	trackProp(key) {
		this.#trackedProps.add(key);
	}
	getCurrentQuery() {
		return this.#currentQuery;
	}
	refetch({ ...options } = {}) {
		return this.fetch({ ...options });
	}
	fetchOptimistic(options) {
		const defaultedOptions = this.#client.defaultQueryOptions(options);
		const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
		return query.fetch().then(() => this.createResult(query, defaultedOptions));
	}
	fetch(fetchOptions) {
		return this.#executeFetch({
			...fetchOptions,
			cancelRefetch: fetchOptions.cancelRefetch ?? true
		}).then(() => {
			this.updateResult();
			return this.#currentResult;
		});
	}
	#executeFetch(fetchOptions) {
		this.#updateQuery();
		let promise = this.#currentQuery.fetch(this.options, fetchOptions);
		if (!fetchOptions?.throwOnError) promise = promise.catch(noop);
		return promise;
	}
	#updateStaleTimeout() {
		this.#clearStaleTimeout();
		const staleTime = resolveStaleTime(this.options.staleTime, this.#currentQuery);
		if (environmentManager.isServer() || this.#currentResult.isStale || !isValidTimeout(staleTime)) return;
		const timeout = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime) + 1;
		this.#staleTimeoutId = timeoutManager.setTimeout(() => {
			if (!this.#currentResult.isStale) this.updateResult();
		}, timeout);
	}
	#computeRefetchInterval() {
		return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
	}
	#updateRefetchInterval(nextInterval) {
		this.#clearRefetchInterval();
		this.#currentRefetchInterval = nextInterval;
		if (environmentManager.isServer() || resolveEnabled(this.options.enabled, this.#currentQuery) === false || !isValidTimeout(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) return;
		this.#refetchIntervalId = timeoutManager.setInterval(() => {
			if (this.options.refetchIntervalInBackground || focusManager.isFocused()) this.#executeFetch();
		}, this.#currentRefetchInterval);
	}
	#updateTimers() {
		this.#updateStaleTimeout();
		this.#updateRefetchInterval(this.#computeRefetchInterval());
	}
	#clearStaleTimeout() {
		if (this.#staleTimeoutId) {
			timeoutManager.clearTimeout(this.#staleTimeoutId);
			this.#staleTimeoutId = void 0;
		}
	}
	#clearRefetchInterval() {
		if (this.#refetchIntervalId) {
			timeoutManager.clearInterval(this.#refetchIntervalId);
			this.#refetchIntervalId = void 0;
		}
	}
	createResult(query, options) {
		const prevQuery = this.#currentQuery;
		const prevOptions = this.options;
		const prevResult = this.#currentResult;
		const prevResultState = this.#currentResultState;
		const prevResultOptions = this.#currentResultOptions;
		const queryInitialState = query !== prevQuery ? query.state : this.#currentQueryInitialState;
		const { state } = query;
		let newState = { ...state };
		let isPlaceholderData = false;
		let data;
		if (options._optimisticResults) {
			const mounted = this.hasListeners();
			const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
			const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
			if (fetchOnMount || fetchOptionally) newState = {
				...newState,
				...fetchState(state.data, query.options)
			};
			if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
		}
		let { error, errorUpdatedAt, status } = newState;
		data = newState.data;
		let skipSelect = false;
		if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
			let placeholderData;
			if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
				placeholderData = prevResult.data;
				skipSelect = true;
			} else placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(this.#lastQueryWithDefinedData?.state.data, this.#lastQueryWithDefinedData) : options.placeholderData;
			if (placeholderData !== void 0) {
				status = "success";
				data = replaceData(prevResult?.data, placeholderData, options);
				isPlaceholderData = true;
			}
		}
		if (options.select && data !== void 0 && !skipSelect) {
			if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) data = this.#selectResult;
			else try {
				this.#selectFn = options.select;
				data = options.select(data);
				data = replaceData(prevResult?.data, data, options);
				this.#selectResult = data;
				this.#selectError = null;
			} catch (selectError) {
				this.#selectError = selectError;
			}
		}
		if (this.#selectError) {
			error = this.#selectError;
			data = this.#selectResult;
			errorUpdatedAt = Date.now();
			status = "error";
		}
		const isFetching = newState.fetchStatus === "fetching";
		const isPending = status === "pending";
		const isError = status === "error";
		const isLoading = isPending && isFetching;
		const hasData = data !== void 0;
		const nextResult = {
			status,
			fetchStatus: newState.fetchStatus,
			isPending,
			isSuccess: status === "success",
			isError,
			isInitialLoading: isLoading,
			isLoading,
			data,
			dataUpdatedAt: newState.dataUpdatedAt,
			error,
			errorUpdatedAt,
			failureCount: newState.fetchFailureCount,
			failureReason: newState.fetchFailureReason,
			errorUpdateCount: newState.errorUpdateCount,
			isFetched: query.isFetched(),
			isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
			isFetching,
			isRefetching: isFetching && !isPending,
			isLoadingError: isError && !hasData,
			isPaused: newState.fetchStatus === "paused",
			isPlaceholderData,
			isRefetchError: isError && hasData,
			isStale: isStale(query, options),
			refetch: this.refetch,
			promise: this.#currentThenable,
			isEnabled: resolveEnabled(options.enabled, query) !== false
		};
		if (this.options.experimental_prefetchInRender) {
			const hasResultData = nextResult.data !== void 0;
			const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
			const finalizeThenableIfPossible = (thenable) => {
				if (isErrorWithoutData) thenable.reject(nextResult.error);
				else if (hasResultData) thenable.resolve(nextResult.data);
			};
			const recreateThenable = () => {
				const pending = this.#currentThenable = nextResult.promise = pendingThenable();
				finalizeThenableIfPossible(pending);
			};
			const prevThenable = this.#currentThenable;
			switch (prevThenable.status) {
				case "pending":
					if (query.queryHash === prevQuery.queryHash) finalizeThenableIfPossible(prevThenable);
					break;
				case "fulfilled":
					if (isErrorWithoutData || nextResult.data !== prevThenable.value) recreateThenable();
					break;
				case "rejected": if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) recreateThenable();
			}
		}
		return nextResult;
	}
	updateResult() {
		const prevResult = this.#currentResult;
		const nextResult = this.createResult(this.#currentQuery, this.options);
		this.#currentResultState = this.#currentQuery.state;
		this.#currentResultOptions = this.options;
		if (this.#currentResultState.data !== void 0) this.#lastQueryWithDefinedData = this.#currentQuery;
		if (shallowEqualObjects(nextResult, prevResult)) return;
		this.#currentResult = nextResult;
		const shouldNotifyListeners = () => {
			if (!prevResult) return true;
			const { notifyOnChangeProps } = this.options;
			const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
			if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) return true;
			const includedProps = new Set(notifyOnChangePropsValue ?? this.#trackedProps);
			if (this.options.throwOnError) includedProps.add("error");
			return Object.keys(this.#currentResult).some((key) => {
				const typedKey = key;
				return this.#currentResult[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
			});
		};
		this.#notify({ listeners: shouldNotifyListeners() });
	}
	#updateQuery() {
		const query = this.#client.getQueryCache().build(this.#client, this.options);
		if (query === this.#currentQuery) return;
		const prevQuery = this.#currentQuery;
		this.#currentQuery = query;
		this.#currentQueryInitialState = query.state;
		if (this.hasListeners()) {
			prevQuery?.removeObserver(this);
			query.addObserver(this);
		}
	}
	onQueryUpdate() {
		this.updateResult();
		if (this.hasListeners()) this.#updateTimers();
	}
	#notify(notifyOptions) {
		notifyManager.batch(() => {
			if (notifyOptions.listeners) this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
			this.#client.getQueryCache().notify({
				query: this.#currentQuery,
				type: "observerResultsUpdated"
			});
		});
	}
};
function shouldLoadOnMount(query, options) {
	return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
		const value = typeof field === "function" ? field(query) : field;
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
	if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) return true;
	return false;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/mutation.js
var Mutation = class extends Removable {
	#client;
	#observers;
	#mutationCache;
	#retryer;
	constructor(config) {
		super();
		this.#client = config.client;
		this.mutationId = config.mutationId;
		this.#mutationCache = config.mutationCache;
		this.#observers = [];
		this.state = config.state || getDefaultState();
		this.setOptions(config.options);
		this.scheduleGc();
	}
	setOptions(options) {
		this.options = options;
		this.updateGcTime(this.options.gcTime);
	}
	get meta() {
		return this.options.meta;
	}
	addObserver(observer) {
		if (!this.#observers.includes(observer)) {
			this.#observers.push(observer);
			this.clearGcTimeout();
			this.#mutationCache.notify({
				type: "observerAdded",
				mutation: this,
				observer
			});
		}
	}
	removeObserver(observer) {
		this.#observers = this.#observers.filter((x) => x !== observer);
		this.scheduleGc();
		this.#mutationCache.notify({
			type: "observerRemoved",
			mutation: this,
			observer
		});
	}
	optionalRemove() {
		if (!this.#observers.length) {
			if (this.state.status === "pending") this.scheduleGc();
			else this.#mutationCache.remove(this);
		}
	}
	continue() {
		return this.#retryer?.continue() ?? this.execute(this.state.variables);
	}
	async execute(variables) {
		const onContinue = () => {
			this.#dispatch({ type: "continue" });
		};
		const mutationFnContext = {
			client: this.#client,
			meta: this.options.meta,
			mutationKey: this.options.mutationKey
		};
		this.#retryer = createRetryer({
			fn: () => {
				if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
				return this.options.mutationFn(variables, mutationFnContext);
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue,
			retry: this.options.retry ?? 0,
			retryDelay: this.options.retryDelay,
			networkMode: this.options.networkMode,
			canRun: () => this.#mutationCache.canRun(this)
		});
		const restored = this.state.status === "pending";
		const isPaused = !this.#retryer.canStart();
		try {
			if (restored) onContinue();
			else {
				this.#dispatch({
					type: "pending",
					variables,
					isPaused
				});
				if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
				const context = await this.options.onMutate?.(variables, mutationFnContext);
				if (context !== this.state.context) this.#dispatch({
					type: "pending",
					context,
					variables,
					isPaused
				});
			}
			const data = await this.#retryer.start();
			await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
			await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
			await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
			await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
			this.#dispatch({
				type: "success",
				data
			});
			return data;
		} catch (error) {
			try {
				await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			this.#dispatch({
				type: "error",
				error
			});
			throw error;
		} finally {
			this.#mutationCache.runNext(this);
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					failureCount: action.failureCount,
					failureReason: action.error
				};
				case "pause": return {
					...state,
					isPaused: true
				};
				case "continue": return {
					...state,
					isPaused: false
				};
				case "pending": return {
					...state,
					context: action.context,
					data: void 0,
					failureCount: 0,
					failureReason: null,
					error: null,
					isPaused: action.isPaused,
					status: "pending",
					variables: action.variables,
					submittedAt: Date.now()
				};
				case "success": return {
					...state,
					data: action.data,
					failureCount: 0,
					failureReason: null,
					error: null,
					status: "success",
					isPaused: false
				};
				case "error": return {
					...state,
					data: void 0,
					error: action.error,
					failureCount: state.failureCount + 1,
					failureReason: action.error,
					isPaused: false,
					status: "error"
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.#observers.forEach((observer) => {
				observer.onMutationUpdate(action);
			});
			this.#mutationCache.notify({
				mutation: this,
				type: "updated",
				action
			});
		});
	}
};
function getDefaultState() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: false,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null,
		V: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, self, source, owner, props) {
		self = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== self ? self : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, void 0, void 0, void 0, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function noop$1() {}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	function noop() {}
	exports.Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key, owner = void 0;
		if (null != config) for (propName in void 0 !== config.ref && (owner = void 0), void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, void 0, void 0, owner, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, void 0, void 0, null, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, createDeps, update) {
		var dispatcher = ReactSharedInternals.H;
		if ("function" === typeof update) throw Error("useEffect CRUD overload is not enabled in this build of React.");
		return dispatcher.useEffect(create, createDeps);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.1.5";
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
		var key = null;
		void 0 !== maybeKey && (key = "" + maybeKey);
		void 0 !== config.key && (key = "" + config.key);
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
		} else maybeKey = config;
		config = maybeKey.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== config ? config : null,
			props: maybeKey
		};
	}
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.jsx = jsxProd;
	exports.jsxs = jsxProd;
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production();
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var QueryClientContext = import_react.createContext(void 0);
var useQueryClient = (queryClient) => {
	const client = import_react.useContext(QueryClientContext);
	if (queryClient) return queryClient;
	if (!client) throw new Error("No QueryClient set, use QueryClientProvider to set one");
	return client;
};
var QueryClientProvider = ({ client, children }) => {
	import_react.useEffect(() => {
		client.mount();
		return () => {
			client.unmount();
		};
	}, [client]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientContext.Provider, {
		value: client,
		children
	});
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js
var IsRestoringContext = import_react.createContext(false);
var useIsRestoring = () => import_react.useContext(IsRestoringContext);
IsRestoringContext.Provider;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
function createValue() {
	let isReset = false;
	return {
		clearReset: () => {
			isReset = false;
		},
		reset: () => {
			isReset = true;
		},
		isReset: () => {
			return isReset;
		}
	};
}
var QueryErrorResetBoundaryContext = import_react.createContext(createValue());
var useQueryErrorResetBoundary = () => import_react.useContext(QueryErrorResetBoundaryContext);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
	import_react.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
var getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/suspense.js
var ensureSuspenseTimers = (defaultedOptions) => {
	if (defaultedOptions.suspense) {
		const MIN_SUSPENSE_TIME_MS = 1e3;
		const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
		const originalStaleTime = defaultedOptions.staleTime;
		defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
		if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
	}
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
	errorResetBoundary.clearReset();
});
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function useBaseQuery(options, Observer, queryClient) {
	const isRestoring = useIsRestoring();
	const errorResetBoundary = useQueryErrorResetBoundary();
	const client = useQueryClient(queryClient);
	const defaultedOptions = client.defaultQueryOptions(options);
	client.getDefaultOptions().queries?._experimental_beforeQuery?.(defaultedOptions);
	const query = client.getQueryCache().get(defaultedOptions.queryHash);
	defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
	ensureSuspenseTimers(defaultedOptions);
	ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
	useClearResetErrorBoundary(errorResetBoundary);
	const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
	const [observer] = import_react.useState(() => new Observer(client, defaultedOptions));
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = !isRestoring && options.subscribed !== false;
	import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	import_react.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (shouldSuspend(defaultedOptions, result)) throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
	if (getHasError({
		result,
		errorResetBoundary,
		throwOnError: defaultedOptions.throwOnError,
		query,
		suspense: defaultedOptions.suspense
	})) throw result.error;
	client.getDefaultOptions().queries?._experimental_afterQuery?.(defaultedOptions, result);
	if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) (isNewCacheEntry ? fetchOptimistic(defaultedOptions, observer, errorResetBoundary) : query?.promise)?.catch(noop).finally(() => {
		observer.updateResult();
	});
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
	return useBaseQuery(options, QueryObserver, queryClient);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+identity@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3_0d68b604c6b09c988b388ea6f9931fb5/node_modules/@dfinity/identity/lib/esm/identity/ed25519.js
function isObject(value) {
	return value !== null && typeof value === "object";
}
var Ed25519PublicKey = class Ed25519PublicKey {
	/**
	* Construct Ed25519PublicKey from an existing PublicKey
	* @param {unknown} maybeKey - existing PublicKey, ArrayBuffer, DerEncodedPublicKey, or hex string
	* @returns {Ed25519PublicKey} Instance of Ed25519PublicKey
	*/
	static from(maybeKey) {
		if (typeof maybeKey === "string") {
			const key = hexToBytes(maybeKey);
			return this.fromRaw(key);
		} else if (isObject(maybeKey)) {
			const key = maybeKey;
			if (isObject(key) && Object.hasOwnProperty.call(key, "__derEncodedPublicKey__")) return this.fromDer(key);
			else if (ArrayBuffer.isView(key)) {
				const view = key;
				return this.fromRaw(uint8FromBufLike$1(view.buffer));
			} else if (key instanceof ArrayBuffer) return this.fromRaw(uint8FromBufLike$1(key));
			else if ("rawKey" in key && key.rawKey instanceof Uint8Array) return this.fromRaw(key.rawKey);
			else if ("derKey" in key) return this.fromDer(key.derKey);
			else if ("toDer" in key) return this.fromDer(key.toDer());
		}
		throw new Error("Cannot construct Ed25519PublicKey from the provided key.");
	}
	static fromRaw(rawKey) {
		return new Ed25519PublicKey(rawKey);
	}
	static fromDer(derKey) {
		return new Ed25519PublicKey(this.derDecode(derKey));
	}
	static {
		this.RAW_KEY_LENGTH = 32;
	}
	static derEncode(publicKey) {
		const key = wrapDER(publicKey, ED25519_OID);
		key.__derEncodedPublicKey__ = void 0;
		return key;
	}
	static derDecode(key) {
		const unwrapped = unwrapDER(key, ED25519_OID);
		if (unwrapped.length !== this.RAW_KEY_LENGTH) throw new Error("An Ed25519 public key must be exactly 32bytes long");
		return unwrapped;
	}
	#rawKey;
	get rawKey() {
		return this.#rawKey;
	}
	#derKey;
	get derKey() {
		return this.#derKey;
	}
	constructor(key) {
		if (key.byteLength !== Ed25519PublicKey.RAW_KEY_LENGTH) throw new Error("An Ed25519 public key must be exactly 32bytes long");
		this.#rawKey = key;
		this.#derKey = Ed25519PublicKey.derEncode(key);
	}
	toDer() {
		return this.derKey;
	}
	toRaw() {
		return this.rawKey;
	}
};
/**
* Ed25519KeyIdentity is an implementation of SignIdentity that uses Ed25519 keys. This class is used to sign and verify messages for an agent.
*/
var Ed25519KeyIdentity = class Ed25519KeyIdentity extends SignIdentity {
	/**
	* Generate a new Ed25519KeyIdentity.
	* @param seed a 32-byte seed for the private key. If not provided, a random seed will be generated.
	* @returns Ed25519KeyIdentity
	*/
	static generate(seed) {
		if (seed && seed.length !== 32) throw new Error("Ed25519 Seed needs to be 32 bytes long.");
		if (!seed) seed = ed25519.utils.randomPrivateKey();
		if (uint8Equals$1(seed, new Uint8Array(new Array(32).fill(0)))) console.warn("Seed is all zeros. This is not a secure seed. Please provide a seed with sufficient entropy if this is a production environment.");
		const sk = /* @__PURE__ */ new Uint8Array(32);
		for (let i = 0; i < 32; i++) sk[i] = seed[i];
		const pk = ed25519.getPublicKey(sk);
		return Ed25519KeyIdentity.fromKeyPair(pk, sk);
	}
	static fromParsedJson(obj) {
		const [publicKeyDer, privateKeyRaw] = obj;
		return new Ed25519KeyIdentity(Ed25519PublicKey.fromDer(hexToBytes(publicKeyDer)), hexToBytes(privateKeyRaw));
	}
	static fromJSON(json) {
		const parsed = JSON.parse(json);
		if (Array.isArray(parsed)) {
			if (typeof parsed[0] === "string" && typeof parsed[1] === "string") return this.fromParsedJson([parsed[0], parsed[1]]);
			else throw new Error("Deserialization error: JSON must have at least 2 items.");
		}
		throw new Error(`Deserialization error: Invalid JSON type for string: ${JSON.stringify(json)}`);
	}
	static fromKeyPair(publicKey, privateKey) {
		return new Ed25519KeyIdentity(Ed25519PublicKey.fromRaw(publicKey), privateKey);
	}
	static fromSecretKey(secretKey) {
		const publicKey = ed25519.getPublicKey(secretKey);
		return Ed25519KeyIdentity.fromKeyPair(publicKey, secretKey);
	}
	#publicKey;
	#privateKey;
	constructor(publicKey, privateKey) {
		super();
		this.#publicKey = Ed25519PublicKey.from(publicKey);
		this.#privateKey = privateKey;
	}
	/**
	* Serialize this key to JSON.
	*/
	toJSON() {
		return [bytesToHex(this.#publicKey.toDer()), bytesToHex(this.#privateKey)];
	}
	/**
	* Return a copy of the key pair.
	*/
	getKeyPair() {
		return {
			secretKey: this.#privateKey,
			publicKey: this.#publicKey
		};
	}
	/**
	* Return the public key.
	*/
	getPublicKey() {
		return this.#publicKey;
	}
	/**
	* Signs a blob of data, with this identity's private key.
	* @param challenge - challenge to sign with this identity's secretKey, producing a signature
	*/
	async sign(challenge) {
		const signature = ed25519.sign(challenge, this.#privateKey.slice(0, 32));
		Object.defineProperty(signature, "__signature__", {
			enumerable: false,
			value: void 0
		});
		return signature;
	}
	/**
	* Verify
	* @param sig - signature to verify
	* @param msg - message to verify
	* @param pk - public key
	* @returns - true if the signature is valid, false otherwise
	*/
	static verify(sig, msg, pk) {
		const [signature, message, publicKey] = [
			sig,
			msg,
			pk
		].map((x) => {
			if (typeof x === "string") x = hexToBytes(x);
			return uint8FromBufLike$1(x);
		});
		return ed25519.verify(signature, message, publicKey);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+identity@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3_0d68b604c6b09c988b388ea6f9931fb5/node_modules/@dfinity/identity/lib/esm/identity/ecdsa.js
var CryptoError = class CryptoError extends Error {
	constructor(message) {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, CryptoError.prototype);
	}
};
/**
* Utility method to ensure that a subtleCrypto implementation is provided or is available in the global context
* @param subtleCrypto SubtleCrypto implementation
* @returns subleCrypto
*/
function _getEffectiveCrypto(subtleCrypto) {
	if (typeof globalThis !== "undefined" && globalThis["crypto"] && globalThis["crypto"]["subtle"]) return globalThis["crypto"]["subtle"];
	if (subtleCrypto) return subtleCrypto;
	else if (typeof crypto !== "undefined" && crypto["subtle"]) return crypto.subtle;
	else throw new CryptoError("Global crypto was not available and none was provided. Please inlcude a SubtleCrypto implementation. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto");
}
/**
* An identity interface that wraps an ECDSA keypair using the P-256 named curve. Supports DER-encoding and decoding for agent calls
*/
var ECDSAKeyIdentity = class ECDSAKeyIdentity extends SignIdentity {
	/**
	* Generates a randomly generated identity for use in calls to the Internet Computer.
	* @param {CryptoKeyOptions} options optional settings
	* @param {CryptoKeyOptions['extractable']} options.extractable - whether the key should allow itself to be used. Set to false for maximum security.
	* @param {CryptoKeyOptions['keyUsages']} options.keyUsages - a list of key usages that the key can be used for
	* @param {CryptoKeyOptions['subtleCrypto']} options.subtleCrypto interface
	* @returns a {@link ECDSAKeyIdentity}
	*/
	static async generate(options) {
		const { extractable = false, keyUsages = ["sign", "verify"], subtleCrypto } = options ?? {};
		const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
		const keyPair = await effectiveCrypto.generateKey({
			name: "ECDSA",
			namedCurve: "P-256"
		}, extractable, keyUsages);
		const derKey = uint8FromBufLike$1(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
		Object.assign(derKey, { __derEncodedPublicKey__: void 0 });
		return new this(keyPair, derKey, effectiveCrypto);
	}
	/**
	* generates an identity from a public and private key. Please ensure that you are generating these keys securely and protect the user's private key
	* @param keyPair a CryptoKeyPair
	* @param subtleCrypto - a SubtleCrypto interface in case one is not available globally
	* @returns an {@link ECDSAKeyIdentity}
	*/
	static async fromKeyPair(keyPair, subtleCrypto) {
		const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
		const derKey = uint8FromBufLike$1(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
		Object.assign(derKey, { __derEncodedPublicKey__: void 0 });
		return new ECDSAKeyIdentity(keyPair, derKey, effectiveCrypto);
	}
	constructor(keyPair, derKey, subtleCrypto) {
		super();
		this._keyPair = keyPair;
		this._derKey = derKey;
		this._subtleCrypto = subtleCrypto;
	}
	/**
	* Return the internally-used key pair.
	* @returns a CryptoKeyPair
	*/
	getKeyPair() {
		return this._keyPair;
	}
	/**
	* Return the public key.
	* @returns an {@link PublicKey & DerCryptoKey}
	*/
	getPublicKey() {
		const derKey = this._derKey;
		const key = Object.create(this._keyPair.publicKey);
		key.toDer = function() {
			return derKey;
		};
		return key;
	}
	/**
	* Signs a blob of data, with this identity's private key.
	* @param {Uint8Array} challenge - challenge to sign with this identity's secretKey, producing a signature
	* @returns {Promise<Signature>} signature
	*/
	async sign(challenge) {
		const signature = uint8FromBufLike$1(await this._subtleCrypto.sign({
			name: "ECDSA",
			hash: { name: "SHA-256" }
		}, this._keyPair.privateKey, challenge));
		Object.assign(signature, { __signature__: void 0 });
		return signature;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+identity@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3_0d68b604c6b09c988b388ea6f9931fb5/node_modules/@dfinity/identity/lib/esm/identity/partial.js
/**
* A partial delegated identity, representing a delegation chain and the public key that it targets
*/
var PartialIdentity = class {
	#inner;
	/**
	* The raw public key of this identity.
	*/
	get rawKey() {
		return this.#inner.rawKey;
	}
	/**
	* The DER-encoded public key of this identity.
	*/
	get derKey() {
		return this.#inner.derKey;
	}
	/**
	* The DER-encoded public key of this identity.
	*/
	toDer() {
		return this.#inner.toDer();
	}
	/**
	* The inner {@link PublicKey} used by this identity.
	*/
	getPublicKey() {
		return this.#inner;
	}
	/**
	* The {@link Principal} of this identity.
	*/
	getPrincipal() {
		if (!this.#inner.rawKey) throw new Error("Cannot get principal from a public key without a raw key.");
		return Principal$1.fromUint8Array(new Uint8Array(this.#inner.rawKey));
	}
	/**
	* Required for the Identity interface, but cannot implemented for just a public key.
	*/
	transformRequest() {
		return Promise.reject("Not implemented. You are attempting to use a partial identity to sign calls, but this identity only has access to the public key.To sign calls, use a DelegationIdentity instead.");
	}
	constructor(inner) {
		this.#inner = inner;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+identity@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3_0d68b604c6b09c988b388ea6f9931fb5/node_modules/@dfinity/identity/lib/esm/identity/delegation.js
/**
* Safe wrapper around bytesToHex that handles ArrayBuffer/Uint8Array type conversion.
* Required because @noble/hashes v1.8+ strictly expects Uint8Array inputs.
* @param data The binary data to convert to hexadecimal string (ArrayBuffer, Uint8Array, or ArrayLike<number>)
*/
function safeBytesToHex(data) {
	if (data instanceof Uint8Array) return bytesToHex(data);
	return bytesToHex(new Uint8Array(data));
}
function _parseBlob(value) {
	if (typeof value !== "string" || value.length < 64) throw new Error("Invalid public key.");
	return hexToBytes(value);
}
/**
* A single delegation object that is signed by a private key. This is constructed by
* `DelegationChain.create()`.
*
* {@see DelegationChain}
*/
var Delegation = class {
	constructor(pubkey, expiration, targets) {
		this.pubkey = pubkey;
		this.expiration = expiration;
		this.targets = targets;
	}
	toCborValue() {
		return {
			pubkey: this.pubkey,
			expiration: this.expiration,
			...this.targets && { targets: this.targets }
		};
	}
	toJSON() {
		return {
			expiration: this.expiration.toString(16),
			pubkey: safeBytesToHex(this.pubkey),
			...this.targets && { targets: this.targets.map((p) => p.toHex()) }
		};
	}
};
/**
* Sign a single delegation object for a period of time.
* @param from The identity that lends its delegation.
* @param to The identity that receives the delegation.
* @param expiration An expiration date for this delegation.
* @param targets Limit this delegation to the target principals.
*/
async function _createSingleDelegation(from, to, expiration, targets) {
	const delegation = new Delegation(to.toDer(), BigInt(+expiration) * BigInt(1e6), targets);
	const challenge = new Uint8Array([...IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR, ...new Uint8Array(requestIdOf({ ...delegation }))]);
	return {
		delegation,
		signature: await from.sign(challenge)
	};
}
/**
* A chain of delegations. This is JSON Serializable.
* This is the object to serialize and pass to a DelegationIdentity. It does not keep any
* private keys.
*/
var DelegationChain = class DelegationChain {
	/**
	* Create a delegation chain between two (or more) keys. By default, the expiration time
	* will be very short (15 minutes).
	*
	* To build a chain of more than 2 identities, this function needs to be called multiple times,
	* passing the previous delegation chain into the options argument. For example:
	* @example
	* const rootKey = createKey();
	* const middleKey = createKey();
	* const bottomeKey = createKey();
	*
	* const rootToMiddle = await DelegationChain.create(
	*   root, middle.getPublicKey(), Date.parse('2100-01-01'),
	* );
	* const middleToBottom = await DelegationChain.create(
	*   middle, bottom.getPublicKey(), Date.parse('2100-01-01'), { previous: rootToMiddle },
	* );
	*
	* // We can now use a delegation identity that uses the delegation above:
	* const identity = DelegationIdentity.fromDelegation(bottomKey, middleToBottom);
	* @param from The identity that will delegate.
	* @param to The identity that gets delegated. It can now sign messages as if it was the
	*           identity above.
	* @param expiration The length the delegation is valid. By default, 15 minutes from calling
	*                   this function.
	* @param options A set of options for this delegation. expiration and previous
	* @param options.previous - Another DelegationChain that this chain should start with.
	* @param options.targets - targets that scope the delegation (e.g. Canister Principals)
	*/
	static async create(from, to, expiration = new Date(Date.now() + 9e5), options = {}) {
		const delegation = await _createSingleDelegation(from, to, expiration, options.targets);
		return new DelegationChain([...options.previous?.delegations || [], delegation], options.previous?.publicKey || from.getPublicKey().toDer());
	}
	/**
	* Creates a DelegationChain object from a JSON string.
	* @param json The JSON string to parse.
	*/
	static fromJSON(json) {
		const { publicKey, delegations } = typeof json === "string" ? JSON.parse(json) : json;
		if (!Array.isArray(delegations)) throw new Error("Invalid delegations.");
		const parsedDelegations = delegations.map((signedDelegation) => {
			const { delegation, signature } = signedDelegation;
			const { pubkey, expiration, targets } = delegation;
			if (targets !== void 0 && !Array.isArray(targets)) throw new Error("Invalid targets.");
			return {
				delegation: new Delegation(_parseBlob(pubkey), BigInt("0x" + expiration), targets && targets.map((t) => {
					if (typeof t !== "string") throw new Error("Invalid target.");
					return Principal$1.fromHex(t);
				})),
				signature: _parseBlob(signature)
			};
		});
		return new this(parsedDelegations, _parseBlob(publicKey));
	}
	/**
	* Creates a DelegationChain object from a list of delegations and a DER-encoded public key.
	* @param delegations The list of delegations.
	* @param publicKey The DER-encoded public key of the key-pair signing the first delegation.
	*/
	static fromDelegations(delegations, publicKey) {
		return new this(delegations, publicKey);
	}
	constructor(delegations, publicKey) {
		this.delegations = delegations;
		this.publicKey = publicKey;
	}
	toJSON() {
		return {
			delegations: this.delegations.map((signedDelegation) => {
				const { delegation, signature } = signedDelegation;
				const { targets } = delegation;
				return {
					delegation: {
						expiration: delegation.expiration.toString(16),
						pubkey: safeBytesToHex(delegation.pubkey),
						...targets && { targets: targets.map((t) => t.toHex()) }
					},
					signature: safeBytesToHex(signature)
				};
			}),
			publicKey: safeBytesToHex(this.publicKey)
		};
	}
};
/**
* An Identity that adds delegation to a request. Everywhere in this class, the name
* innerKey refers to the SignIdentity that is being used to sign the requests, while
* originalKey is the identity that is being borrowed. More identities can be used
* in the middle to delegate.
*/
var DelegationIdentity = class extends SignIdentity {
	/**
	* Create a delegation without having access to delegateKey.
	* @param key The key used to sign the requests.
	* @param delegation A delegation object created using `createDelegation`.
	*/
	static fromDelegation(key, delegation) {
		return new this(key, delegation);
	}
	constructor(_inner, _delegation) {
		super();
		this._inner = _inner;
		this._delegation = _delegation;
	}
	getDelegation() {
		return this._delegation;
	}
	getPublicKey() {
		return {
			derKey: this._delegation.publicKey,
			toDer: () => this._delegation.publicKey
		};
	}
	sign(blob) {
		return this._inner.sign(blob);
	}
	async transformRequest(request) {
		const { body, ...fields } = request;
		const requestId = await requestIdOf(body);
		return {
			...fields,
			body: {
				content: body,
				sender_sig: await this.sign(new Uint8Array([...IC_REQUEST_DOMAIN_SEPARATOR, ...new Uint8Array(requestId)])),
				sender_delegation: this._delegation.delegations,
				sender_pubkey: this._delegation.publicKey
			}
		};
	}
};
/**
* A partial delegated identity, representing a delegation chain and the public key that it targets
*/
var PartialDelegationIdentity = class PartialDelegationIdentity extends PartialIdentity {
	#delegation;
	/**
	* The Delegation Chain of this identity.
	*/
	get delegation() {
		return this.#delegation;
	}
	constructor(inner, delegation) {
		super(inner);
		this.#delegation = delegation;
	}
	/**
	* Create a {@link PartialDelegationIdentity} from a {@link PublicKey} and a {@link DelegationChain}.
	* @param key The {@link PublicKey} to delegate to.
	* @param delegation a {@link DelegationChain} targeting the inner key.
	*/
	static fromDelegation(key, delegation) {
		return new PartialDelegationIdentity(key, delegation);
	}
};
/**
* Analyze a DelegationChain and validate that it's valid, ie. not expired and apply to the
* scope.
* @param chain The chain to validate.
* @param checks Various checks to validate on the chain.
*/
function isDelegationValid(chain, checks) {
	for (const { delegation } of chain.delegations) if (+new Date(Number(delegation.expiration / BigInt(1e6))) <= +Date.now()) return false;
	const scopes = [];
	const maybeScope = checks?.scope;
	if (maybeScope) {
		if (Array.isArray(maybeScope)) scopes.push(...maybeScope.map((s) => typeof s === "string" ? Principal$1.fromText(s) : s));
		else scopes.push(typeof maybeScope === "string" ? Principal$1.fromText(maybeScope) : maybeScope);
	}
	for (const s of scopes) {
		const scope = s.toText();
		for (const { delegation } of chain.delegations) {
			if (delegation.targets === void 0) continue;
			let none = true;
			for (const target of delegation.targets) if (target.toText() === scope) {
				none = false;
				break;
			}
			if (none) return false;
		}
	}
	return true;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+identity@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principal@3_0d68b604c6b09c988b388ea6f9931fb5/node_modules/@dfinity/identity/lib/esm/identity/webauthn.js
var PubKeyCoseAlgo;
(function(PubKeyCoseAlgo) {
	PubKeyCoseAlgo[PubKeyCoseAlgo["ECDSA_WITH_SHA256"] = -7] = "ECDSA_WITH_SHA256";
})(PubKeyCoseAlgo || (PubKeyCoseAlgo = {}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+auth-client@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principa_7f988ceb787e84a5409603ad8dca815f/node_modules/@dfinity/auth-client/lib/esm/idleManager.js
var events = [
	"mousedown",
	"mousemove",
	"keydown",
	"touchstart",
	"wheel"
];
/**
* Detects if the user has been idle for a duration of `idleTimeout` ms, and calls `onIdle` and registered callbacks.
* By default, the IdleManager will log a user out after 10 minutes of inactivity.
* To override these defaults, you can pass an `onIdle` callback, or configure a custom `idleTimeout` in milliseconds
*/
var IdleManager = class {
	callbacks = [];
	idleTimeout = 6e5;
	timeoutID = void 0;
	/**
	* Creates an {@link IdleManager}
	* @param {IdleManagerOptions} options Optional configuration
	* @see {@link IdleManagerOptions}
	* @param options.onIdle Callback once user has been idle. Use to prompt for fresh login, and use `Actor.agentOf(your_actor).invalidateIdentity()` to protect the user
	* @param options.idleTimeout timeout in ms
	* @param options.captureScroll capture scroll events
	* @param options.scrollDebounce scroll debounce time in ms
	*/
	static create(options = {}) {
		return new this(options);
	}
	/**
	* @protected
	* @param options {@link IdleManagerOptions}
	*/
	constructor(options = {}) {
		const { onIdle, idleTimeout = 6e5 } = options || {};
		this.callbacks = onIdle ? [onIdle] : [];
		this.idleTimeout = idleTimeout;
		const _resetTimer = this._resetTimer.bind(this);
		window.addEventListener("load", _resetTimer, true);
		events.forEach(function(name) {
			document.addEventListener(name, _resetTimer, true);
		});
		const debounce = (func, wait) => {
			let timeout;
			return (...args) => {
				const context = this;
				const later = function() {
					timeout = void 0;
					func.apply(context, args);
				};
				clearTimeout(timeout);
				timeout = window.setTimeout(later, wait);
			};
		};
		if (options?.captureScroll) {
			const scroll = debounce(_resetTimer, options?.scrollDebounce ?? 100);
			window.addEventListener("scroll", scroll, true);
		}
		_resetTimer();
	}
	/**
	* @param {IdleCB} callback function to be called when user goes idle
	*/
	registerCallback(callback) {
		this.callbacks.push(callback);
	}
	/**
	* Cleans up the idle manager and its listeners
	*/
	exit() {
		clearTimeout(this.timeoutID);
		window.removeEventListener("load", this._resetTimer, true);
		const _resetTimer = this._resetTimer.bind(this);
		events.forEach(function(name) {
			document.removeEventListener(name, _resetTimer, true);
		});
		this.callbacks.forEach((cb) => cb());
	}
	/**
	* Resets the timeouts during cleanup
	*/
	_resetTimer() {
		const exit = this.exit.bind(this);
		window.clearTimeout(this.timeoutID);
		this.timeoutID = window.setTimeout(exit, this.idleTimeout);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/idb@7.1.1/node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
	return idbProxyableTypes || (idbProxyableTypes = [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	]);
}
function getCursorAdvanceMethods() {
	return cursorAdvanceMethods || (cursorAdvanceMethods = [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
	const promise = new Promise((resolve, reject) => {
		const unlisten = () => {
			request.removeEventListener("success", success);
			request.removeEventListener("error", error);
		};
		const success = () => {
			resolve(wrap(request.result));
			unlisten();
		};
		const error = () => {
			reject(request.error);
			unlisten();
		};
		request.addEventListener("success", success);
		request.addEventListener("error", error);
	});
	promise.then((value) => {
		if (value instanceof IDBCursor) cursorRequestMap.set(value, request);
	}).catch(() => {});
	reverseTransformCache.set(promise, request);
	return promise;
}
function cacheDonePromiseForTransaction(tx) {
	if (transactionDoneMap.has(tx)) return;
	const done = new Promise((resolve, reject) => {
		const unlisten = () => {
			tx.removeEventListener("complete", complete);
			tx.removeEventListener("error", error);
			tx.removeEventListener("abort", error);
		};
		const complete = () => {
			resolve();
			unlisten();
		};
		const error = () => {
			reject(tx.error || new DOMException("AbortError", "AbortError"));
			unlisten();
		};
		tx.addEventListener("complete", complete);
		tx.addEventListener("error", error);
		tx.addEventListener("abort", error);
	});
	transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
	get(target, prop, receiver) {
		if (target instanceof IDBTransaction) {
			if (prop === "done") return transactionDoneMap.get(target);
			if (prop === "objectStoreNames") return target.objectStoreNames || transactionStoreNamesMap.get(target);
			if (prop === "store") return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
		}
		return wrap(target[prop]);
	},
	set(target, prop, value) {
		target[prop] = value;
		return true;
	},
	has(target, prop) {
		if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) return true;
		return prop in target;
	}
};
function replaceTraps(callback) {
	idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
	if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) return function(storeNames, ...args) {
		const tx = func.call(unwrap(this), storeNames, ...args);
		transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
		return wrap(tx);
	};
	if (getCursorAdvanceMethods().includes(func)) return function(...args) {
		func.apply(unwrap(this), args);
		return wrap(cursorRequestMap.get(this));
	};
	return function(...args) {
		return wrap(func.apply(unwrap(this), args));
	};
}
function transformCachableValue(value) {
	if (typeof value === "function") return wrapFunction(value);
	if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
	if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
	return value;
}
function wrap(value) {
	if (value instanceof IDBRequest) return promisifyRequest(value);
	if (transformCache.has(value)) return transformCache.get(value);
	const newValue = transformCachableValue(value);
	if (newValue !== value) {
		transformCache.set(value, newValue);
		reverseTransformCache.set(newValue, value);
	}
	return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/idb@7.1.1/node_modules/idb/build/index.js
/**
* Open a database.
*
* @param name Name of the database.
* @param version Schema version.
* @param callbacks Additional callbacks.
*/
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
	const request = indexedDB.open(name, version);
	const openPromise = wrap(request);
	if (upgrade) request.addEventListener("upgradeneeded", (event) => {
		upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
	});
	if (blocked) request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
	openPromise.then((db) => {
		if (terminated) db.addEventListener("close", () => terminated());
		if (blocking) db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
	}).catch(() => {});
	return openPromise;
}
var readMethods = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
];
var writeMethods = [
	"put",
	"add",
	"delete",
	"clear"
];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
	if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) return;
	if (cachedMethods.get(prop)) return cachedMethods.get(prop);
	const targetFuncName = prop.replace(/FromIndex$/, "");
	const useIndex = prop !== targetFuncName;
	const isWrite = writeMethods.includes(targetFuncName);
	if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
	const method = async function(storeName, ...args) {
		const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
		let target = tx.store;
		if (useIndex) target = target.index(args.shift());
		return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
	};
	cachedMethods.set(prop, method);
	return method;
}
replaceTraps((oldTraps) => ({
	...oldTraps,
	get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
	has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+auth-client@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principa_7f988ceb787e84a5409603ad8dca815f/node_modules/@dfinity/auth-client/lib/esm/db.js
var AUTH_DB_NAME = "auth-client-db";
var OBJECT_STORE_NAME = "ic-keyval";
var _openDbStore = async (dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version) => {
	if (isBrowser && localStorage?.getItem("delegation")) {
		localStorage.removeItem(KEY_STORAGE_DELEGATION);
		localStorage.removeItem(KEY_STORAGE_KEY);
	}
	return await openDB(dbName, version, { upgrade: (database) => {
		if (database.objectStoreNames.contains(storeName)) database.clear(storeName);
		database.createObjectStore(storeName);
	} });
};
async function _getValue(db, storeName, key) {
	return await db.get(storeName, key);
}
async function _setValue(db, storeName, key, value) {
	return await db.put(storeName, value, key);
}
async function _removeValue(db, storeName, key) {
	return await db.delete(storeName, key);
}
/**
* Simple Key Value store
* Defaults to `'auth-client-db'` with an object store of `'ic-keyval'`
*/
var IdbKeyVal = class IdbKeyVal {
	_db;
	_storeName;
	/**
	* @param {DBCreateOptions} options - DBCreateOptions
	* @param {DBCreateOptions['dbName']} options.dbName name for the indexeddb database
	* @default
	* @param {DBCreateOptions['storeName']} options.storeName name for the indexeddb Data Store
	* @default
	* @param {DBCreateOptions['version']} options.version version of the database. Increment to safely upgrade
	*/
	static async create(options) {
		const { dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version = 1 } = options ?? {};
		const db = await _openDbStore(dbName, storeName, version);
		return new IdbKeyVal(db, storeName);
	}
	constructor(_db, _storeName) {
		this._db = _db;
		this._storeName = _storeName;
	}
	/**
	* Basic setter
	* @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
	* @param value value to set
	* @returns void
	*/
	async set(key, value) {
		return await _setValue(this._db, this._storeName, key, value);
	}
	/**
	* Basic getter
	* Pass in a type T for type safety if you know the type the value will have if it is found
	* @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
	* @returns `Promise<T | null>`
	* @example
	* await get<string>('exampleKey') -> 'exampleValue'
	*/
	async get(key) {
		return await _getValue(this._db, this._storeName, key) ?? null;
	}
	/**
	* Remove a key
	* @param key {@link IDBValidKey}
	* @returns void
	*/
	async remove(key) {
		return await _removeValue(this._db, this._storeName, key);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+auth-client@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principa_7f988ceb787e84a5409603ad8dca815f/node_modules/@dfinity/auth-client/lib/esm/storage.js
var KEY_STORAGE_KEY = "identity";
var KEY_STORAGE_DELEGATION = "delegation";
var isBrowser = typeof window !== "undefined";
/**
* Legacy implementation of AuthClientStorage, for use where IndexedDb is not available
*/
var LocalStorage = class {
	prefix;
	_localStorage;
	constructor(prefix = "ic-", _localStorage) {
		this.prefix = prefix;
		this._localStorage = _localStorage;
	}
	get(key) {
		return Promise.resolve(this._getLocalStorage().getItem(this.prefix + key));
	}
	set(key, value) {
		this._getLocalStorage().setItem(this.prefix + key, value);
		return Promise.resolve();
	}
	remove(key) {
		this._getLocalStorage().removeItem(this.prefix + key);
		return Promise.resolve();
	}
	_getLocalStorage() {
		if (this._localStorage) return this._localStorage;
		const ls = typeof window === "undefined" ? typeof globalThis === "undefined" ? typeof self === "undefined" ? void 0 : self.localStorage : globalThis.localStorage : window.localStorage;
		if (!ls) throw new Error("Could not find local storage.");
		return ls;
	}
};
/**
* IdbStorage is an interface for simple storage of string key-value pairs built on {@link IdbKeyVal}
*
* It replaces {@link LocalStorage}
* @see implements {@link AuthClientStorage}
*/
var IdbStorage = class {
	#options;
	/**
	* @param options - DBCreateOptions
	* @param options.dbName - name for the indexeddb database
	* @param options.storeName - name for the indexeddb Data Store
	* @param options.version - version of the database. Increment to safely upgrade
	* @example
	* ```ts
	* const storage = new IdbStorage({ dbName: 'my-db', storeName: 'my-store', version: 2 });
	* ```
	*/
	constructor(options) {
		this.#options = options ?? {};
	}
	initializedDb;
	get _db() {
		return new Promise((resolve, reject) => {
			if (this.initializedDb) {
				resolve(this.initializedDb);
				return;
			}
			IdbKeyVal.create(this.#options).then((db) => {
				this.initializedDb = db;
				resolve(db);
			}).catch(reject);
		});
	}
	async get(key) {
		return await (await this._db).get(key);
	}
	async set(key, value) {
		await (await this._db).set(key, value);
	}
	async remove(key) {
		await (await this._db).remove(key);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+auth-client@3.3.1_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfinity+principa_7f988ceb787e84a5409603ad8dca815f/node_modules/@dfinity/auth-client/lib/esm/index.js
var NANOSECONDS_PER_HOUR = BigInt(1e9) * BigInt(3600);
var IDENTITY_PROVIDER_DEFAULT = "https://identity.internetcomputer.org";
var IDENTITY_PROVIDER_ENDPOINT = "#authorize";
var DEFAULT_MAX_TIME_TO_LIVE = BigInt(8) * NANOSECONDS_PER_HOUR;
var ECDSA_KEY_LABEL = "ECDSA";
var ED25519_KEY_LABEL = "Ed25519";
var INTERRUPT_CHECK_INTERVAL = 500;
var ERROR_USER_INTERRUPT = "UserInterrupt";
/**
* Tool to manage authentication and identity
* @see {@link AuthClient}
*/
var AuthClient = class {
	_identity;
	_key;
	_chain;
	_storage;
	idleManager;
	_createOptions;
	_idpWindow;
	_eventHandler;
	/**
	* Create an AuthClient to manage authentication and identity
	* @param {AuthClientCreateOptions} options - Options for creating an {@link AuthClient}
	* @see {@link AuthClientCreateOptions}
	* @param options.identity Optional Identity to use as the base
	* @see {@link SignIdentity}
	* @param options.storage Storage mechanism for delegation credentials
	* @see {@link AuthClientStorage}
	* @param options.keyType Type of key to use for the base key
	* @param {IdleOptions} options.idleOptions Configures an {@link IdleManager}
	* @see {@link IdleOptions}
	* Default behavior is to clear stored identity and reload the page when a user goes idle, unless you set the disableDefaultIdleCallback flag or pass in a custom idle callback.
	* @example
	* const authClient = await AuthClient.create({
	*   idleOptions: {
	*     disableIdle: true
	*   }
	* })
	*/
	static async create(options = {}) {
		const storage = options.storage ?? new IdbStorage();
		const keyType = options.keyType ?? ECDSA_KEY_LABEL;
		let key = null;
		if (options.identity) key = options.identity;
		else {
			let maybeIdentityStorage = await storage.get(KEY_STORAGE_KEY);
			if (!maybeIdentityStorage && isBrowser) try {
				const fallbackLocalStorage = new LocalStorage();
				const localChain = await fallbackLocalStorage.get(KEY_STORAGE_DELEGATION);
				const localKey = await fallbackLocalStorage.get(KEY_STORAGE_KEY);
				if (localChain && localKey && keyType === ECDSA_KEY_LABEL) {
					console.log("Discovered an identity stored in localstorage. Migrating to IndexedDB");
					await storage.set(KEY_STORAGE_DELEGATION, localChain);
					await storage.set(KEY_STORAGE_KEY, localKey);
					maybeIdentityStorage = localChain;
					await fallbackLocalStorage.remove(KEY_STORAGE_DELEGATION);
					await fallbackLocalStorage.remove(KEY_STORAGE_KEY);
				}
			} catch (error) {
				console.error("error while attempting to recover localstorage: " + error);
			}
			if (maybeIdentityStorage) try {
				if (typeof maybeIdentityStorage === "object") {
					if (keyType === ED25519_KEY_LABEL && typeof maybeIdentityStorage === "string") key = Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
					else key = await ECDSAKeyIdentity.fromKeyPair(maybeIdentityStorage);
				} else if (typeof maybeIdentityStorage === "string") key = Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
			} catch {}
		}
		let identity = new AnonymousIdentity();
		let chain = null;
		if (key) try {
			const chainStorage = await storage.get(KEY_STORAGE_DELEGATION);
			if (typeof chainStorage === "object" && chainStorage !== null) throw new Error("Delegation chain is incorrectly stored. A delegation chain should be stored as a string.");
			if (options.identity) identity = options.identity;
			else if (chainStorage) {
				chain = DelegationChain.fromJSON(chainStorage);
				if (!isDelegationValid(chain)) {
					await _deleteStorage(storage);
					key = null;
				} else if ("toDer" in key) identity = PartialDelegationIdentity.fromDelegation(key, chain);
				else identity = DelegationIdentity.fromDelegation(key, chain);
			}
		} catch (e) {
			console.error(e);
			await _deleteStorage(storage);
			key = null;
		}
		let idleManager;
		if (options.idleOptions?.disableIdle) idleManager = void 0;
		else if (chain || options.identity) idleManager = IdleManager.create(options.idleOptions);
		if (!key) {
			if (keyType === ED25519_KEY_LABEL) {
				key = Ed25519KeyIdentity.generate();
				await storage.set(KEY_STORAGE_KEY, JSON.stringify(key.toJSON()));
			} else {
				if (options.storage && keyType === ECDSA_KEY_LABEL) console.warn(`You are using a custom storage provider that may not support CryptoKey storage. If you are using a custom storage provider that does not support CryptoKey storage, you should use '${ED25519_KEY_LABEL}' as the key type, as it can serialize to a string`);
				key = await ECDSAKeyIdentity.generate();
				await storage.set(KEY_STORAGE_KEY, key.getKeyPair());
			}
		}
		return new this(identity, key, chain, storage, idleManager, options);
	}
	constructor(_identity, _key, _chain, _storage, idleManager, _createOptions, _idpWindow, _eventHandler) {
		this._identity = _identity;
		this._key = _key;
		this._chain = _chain;
		this._storage = _storage;
		this.idleManager = idleManager;
		this._createOptions = _createOptions;
		this._idpWindow = _idpWindow;
		this._eventHandler = _eventHandler;
		this._registerDefaultIdleCallback();
	}
	_registerDefaultIdleCallback() {
		const idleOptions = this._createOptions?.idleOptions;
		/**
		* Default behavior is to clear stored identity and reload the page.
		* By either setting the disableDefaultIdleCallback flag or passing in a custom idle callback, we will ignore this config
		*/
		if (!idleOptions?.onIdle && !idleOptions?.disableDefaultIdleCallback) this.idleManager?.registerCallback(() => {
			this.logout();
			location.reload();
		});
	}
	async _handleSuccess(message, onSuccess) {
		const delegations = message.delegations.map((signedDelegation) => {
			return {
				delegation: new Delegation(signedDelegation.delegation.pubkey, signedDelegation.delegation.expiration, signedDelegation.delegation.targets),
				signature: signedDelegation.signature
			};
		});
		const delegationChain = DelegationChain.fromDelegations(delegations, message.userPublicKey);
		const key = this._key;
		if (!key) return;
		this._chain = delegationChain;
		if ("toDer" in key) this._identity = PartialDelegationIdentity.fromDelegation(key, this._chain);
		else this._identity = DelegationIdentity.fromDelegation(key, this._chain);
		this._idpWindow?.close();
		const idleOptions = this._createOptions?.idleOptions;
		if (!this.idleManager && !idleOptions?.disableIdle) {
			this.idleManager = IdleManager.create(idleOptions);
			this._registerDefaultIdleCallback();
		}
		this._removeEventListener();
		delete this._idpWindow;
		if (this._chain) await this._storage.set(KEY_STORAGE_DELEGATION, JSON.stringify(this._chain.toJSON()));
		onSuccess?.(message);
	}
	getIdentity() {
		return this._identity;
	}
	async isAuthenticated() {
		return !this.getIdentity().getPrincipal().isAnonymous() && this._chain !== null && isDelegationValid(this._chain);
	}
	/**
	* AuthClient Login - Opens up a new window to authenticate with Internet Identity
	* @param {AuthClientLoginOptions} options - Options for logging in, merged with the options set during creation if any. Note: we only perform a shallow merge for the `customValues` property.
	* @param options.identityProvider Identity provider
	* @param options.maxTimeToLive Expiration of the authentication in nanoseconds
	* @param options.allowPinAuthentication If present, indicates whether or not the Identity Provider should allow the user to authenticate and/or register using a temporary key/PIN identity. Authenticating dapps may want to prevent users from using Temporary keys/PIN identities because Temporary keys/PIN identities are less secure than Passkeys (webauthn credentials) and because Temporary keys/PIN identities generally only live in a browser database (which may get cleared by the browser/OS).
	* @param options.derivationOrigin Origin for Identity Provider to use while generating the delegated identity
	* @param options.windowOpenerFeatures Configures the opened authentication window
	* @param options.onSuccess Callback once login has completed
	* @param options.onError Callback in case authentication fails
	* @param options.customValues Extra values to be passed in the login request during the authorize-ready phase. Note: we only perform a shallow merge for the `customValues` property.
	* @example
	* const authClient = await AuthClient.create();
	* authClient.login({
	*  identityProvider: 'http://<canisterID>.127.0.0.1:8000',
	*  maxTimeToLive: BigInt (7) * BigInt(24) * BigInt(3_600_000_000_000), // 1 week
	*  windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
	*  onSuccess: () => {
	*    console.log('Login Successful!');
	*  },
	*  onError: (error) => {
	*    console.error('Login Failed: ', error);
	*  }
	* });
	*/
	async login(options) {
		const loginOptions = mergeLoginOptions(this._createOptions?.loginOptions, options);
		const maxTimeToLive = loginOptions?.maxTimeToLive ?? DEFAULT_MAX_TIME_TO_LIVE;
		const identityProviderUrl = new URL(loginOptions?.identityProvider?.toString() || IDENTITY_PROVIDER_DEFAULT);
		identityProviderUrl.hash = IDENTITY_PROVIDER_ENDPOINT;
		this._idpWindow?.close();
		this._removeEventListener();
		this._eventHandler = this._getEventHandler(identityProviderUrl, {
			maxTimeToLive,
			...loginOptions
		});
		window.addEventListener("message", this._eventHandler);
		this._idpWindow = window.open(identityProviderUrl.toString(), "idpWindow", loginOptions?.windowOpenerFeatures) ?? void 0;
		const checkInterruption = () => {
			if (this._idpWindow) {
				if (this._idpWindow.closed) this._handleFailure(ERROR_USER_INTERRUPT, loginOptions?.onError);
				else setTimeout(checkInterruption, INTERRUPT_CHECK_INTERVAL);
			}
		};
		checkInterruption();
	}
	_getEventHandler(identityProviderUrl, options) {
		return async (event) => {
			if (event.origin !== identityProviderUrl.origin) return;
			const message = event.data;
			switch (message.kind) {
				case "authorize-ready": {
					const request = {
						kind: "authorize-client",
						sessionPublicKey: new Uint8Array(this._key?.getPublicKey().toDer()),
						maxTimeToLive: options?.maxTimeToLive,
						allowPinAuthentication: options?.allowPinAuthentication,
						derivationOrigin: options?.derivationOrigin?.toString(),
						...options?.customValues
					};
					this._idpWindow?.postMessage(request, identityProviderUrl.origin);
					break;
				}
				case "authorize-client-success":
					try {
						await this._handleSuccess(message, options?.onSuccess);
					} catch (err) {
						this._handleFailure(err.message, options?.onError);
					}
					break;
				case "authorize-client-failure": this._handleFailure(message.text, options?.onError);
			}
		};
	}
	_handleFailure(errorMessage, onError) {
		this._idpWindow?.close();
		onError?.(errorMessage);
		this._removeEventListener();
		delete this._idpWindow;
	}
	_removeEventListener() {
		if (this._eventHandler) window.removeEventListener("message", this._eventHandler);
		this._eventHandler = void 0;
	}
	async logout(options = {}) {
		await _deleteStorage(this._storage);
		this._identity = new AnonymousIdentity();
		this._chain = null;
		if (options.returnTo) try {
			window.history.pushState({}, "", options.returnTo);
		} catch {
			window.location.href = options.returnTo;
		}
	}
};
async function _deleteStorage(storage) {
	await storage.remove(KEY_STORAGE_KEY);
	await storage.remove(KEY_STORAGE_DELEGATION);
	await storage.remove("iv");
}
function mergeLoginOptions(loginOptions, otherLoginOptions) {
	if (!loginOptions && !otherLoginOptions) return;
	const customValues = loginOptions?.customValues || otherLoginOptions?.customValues ? {
		...loginOptions?.customValues,
		...otherLoginOptions?.customValues
	} : void 0;
	return {
		...loginOptions,
		...otherLoginOptions,
		customValues
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+core-infrastructure@0.3.0_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfini_10187b72062abae00e434424dbd4946d/node_modules/@caffeineai/core-infrastructure/dist/hooks/useInternetIdentity.js
var ONE_HOUR_IN_NANOSECONDS = BigInt(36e11);
var DEFAULT_IDENTITY_PROVIDER = "https://id.ai/authorize";
var InternetIdentityReactContext = (0, import_react.createContext)(void 0);
/**
* Create the auth client with default options or options provided by the user.
*/
async function createAuthClient(createOptions) {
	const config = await loadConfig();
	const options = {
		idleOptions: {
			disableDefaultIdleCallback: true,
			disableIdle: true,
			...createOptions?.idleOptions
		},
		loginOptions: { derivationOrigin: config.ii_derivation_origin },
		...createOptions
	};
	return await AuthClient.create(options);
}
/**
* Helper function to set loginError state.
*/
function assertProviderPresent(context) {
	if (!context) throw new Error("InternetIdentityProvider is not present. Wrap your component tree with it.");
}
/**
* Hook to access the internet identity as well as loginStatus along with
* login and clear functions.
*/
var useInternetIdentity = () => {
	const context = (0, import_react.useContext)(InternetIdentityReactContext);
	assertProviderPresent(context);
	return context;
};
/**
* The InternetIdentityProvider component makes the saved identity available
* after page reloads. It also allows you to configure default options
* for AuthClient and login.
*
*
* @example
* ```tsx
* <InternetIdentityProvider>
*   <App />
* </InternetIdentityProvider>
* ```
*/
function InternetIdentityProvider({ children, createOptions }) {
	const [authClient, setAuthClient] = (0, import_react.useState)(void 0);
	const [identity, setIdentity] = (0, import_react.useState)(void 0);
	const [loginStatus, setStatus] = (0, import_react.useState)("initializing");
	const [loginError, setError] = (0, import_react.useState)(void 0);
	const setErrorMessage = (0, import_react.useCallback)((message) => {
		setStatus("loginError");
		setError(new Error(message));
	}, []);
	const handleLoginSuccess = (0, import_react.useCallback)(() => {
		const latestIdentity = authClient?.getIdentity();
		if (!latestIdentity) {
			setErrorMessage("Identity not found after successful login");
			return;
		}
		setIdentity(latestIdentity);
		setStatus("success");
	}, [authClient, setErrorMessage]);
	const handleLoginError = (0, import_react.useCallback)((maybeError) => {
		setErrorMessage(maybeError ?? "Login failed");
	}, [setErrorMessage]);
	const login = (0, import_react.useCallback)(() => {
		if (!authClient) {
			setErrorMessage("AuthClient is not initialized yet, make sure to call `login` on user interaction e.g. click.");
			return;
		}
		const currentIdentity = authClient.getIdentity();
		if (!currentIdentity.getPrincipal().isAnonymous() && currentIdentity instanceof DelegationIdentity && isDelegationValid(currentIdentity.getDelegation())) {
			setErrorMessage("User is already authenticated");
			return;
		}
		const options = {
			identityProvider: DEFAULT_IDENTITY_PROVIDER,
			onSuccess: handleLoginSuccess,
			onError: handleLoginError,
			maxTimeToLive: ONE_HOUR_IN_NANOSECONDS * BigInt(720)
		};
		setStatus("logging-in");
		authClient.login(options);
	}, [
		authClient,
		handleLoginError,
		handleLoginSuccess,
		setErrorMessage
	]);
	const clear = (0, import_react.useCallback)(() => {
		if (!authClient) {
			setErrorMessage("Auth client not initialized");
			return;
		}
		authClient.logout().then(() => {
			setIdentity(void 0);
			setAuthClient(void 0);
			setStatus("idle");
			setError(void 0);
		}).catch((unknownError) => {
			setStatus("loginError");
			setError(unknownError instanceof Error ? unknownError : /* @__PURE__ */ new Error("Logout failed"));
		});
	}, [authClient, setErrorMessage]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				setStatus("initializing");
				let existingClient = authClient;
				if (!existingClient) {
					existingClient = await createAuthClient(createOptions);
					if (cancelled) return;
					setAuthClient(existingClient);
				}
				const isAuthenticated = await existingClient.isAuthenticated();
				if (cancelled) return;
				if (isAuthenticated) {
					const loadedIdentity = existingClient.getIdentity();
					setIdentity(loadedIdentity);
					setStatus("success");
				} else {
					setIdentity(void 0);
					setStatus("idle");
				}
			} catch (unknownError) {
				if (cancelled) return;
				setIdentity(void 0);
				setStatus("loginError");
				setError(unknownError instanceof Error ? unknownError : /* @__PURE__ */ new Error("Initialization failed"));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [createOptions, authClient]);
	const value = (0, import_react.useMemo)(() => ({
		identity,
		login,
		clear,
		loginStatus,
		isInitializing: loginStatus === "initializing",
		isLoginIdle: loginStatus === "idle",
		isLoggingIn: loginStatus === "logging-in",
		isLoginSuccess: loginStatus === "success",
		isLoginError: loginStatus === "loginError",
		isAuthenticated: !!identity && !identity.getPrincipal().isAnonymous(),
		loginError
	}), [
		identity,
		login,
		clear,
		loginStatus,
		loginError
	]);
	return (0, import_react.createElement)(InternetIdentityReactContext.Provider, {
		value,
		children
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+core-infrastructure@0.3.0_@dfinity+agent@3.3.1_@dfinity+candid@3.3.1_@dfini_10187b72062abae00e434424dbd4946d/node_modules/@caffeineai/core-infrastructure/dist/hooks/useActor.js
function hasAccessControl(actor) {
	return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
var ACTOR_QUERY_KEY = "actor";
function useActor(createActor) {
	const { identity, isAuthenticated } = useInternetIdentity();
	const queryClient = useQueryClient();
	const actorQuery = useQuery({
		queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
		queryFn: async () => {
			if (!isAuthenticated) return await createActorWithConfig(createActor);
			const actor = await createActorWithConfig(createActor, { agentOptions: { identity } });
			if (hasAccessControl(actor)) await actor._initializeAccessControl();
			return actor;
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: true
	});
	(0, import_react.useEffect)(() => {
		if (actorQuery.data) {
			queryClient.invalidateQueries({ predicate: (query) => {
				return !query.queryKey.includes(ACTOR_QUERY_KEY);
			} });
			queryClient.refetchQueries({ predicate: (query) => {
				return !query.queryKey.includes(ACTOR_QUERY_KEY);
			} });
		}
	}, [actorQuery.data, queryClient]);
	return {
		actor: actorQuery.data || null,
		isFetching: actorQuery.isFetching
	};
}
export { __commonJSMin as $, Subscribable as A, Null as B, noop as C, shouldThrowError as D, shallowEqualObjects as E, Func as F, Text as G, Principal as H, Int as I, Vec as J, Tuple as K, Nat as L, HttpAgent as M, Bool as N, skipToken as O, Float64 as P, hexToBytes as Q, Nat16 as R, matchQuery as S, resolveStaleTime as T, Record as U, Opt as V, Service as W, sha224 as X, Principal$1 as Y, bytesToHex as Z, ensureQueryFn as _, QueryClientProvider as a, hashQueryKeyByOptions as b, require_react as c, Query as d, __toESM as et, onlineManager as f, addToStart as g, addToEnd as h, useQuery as i, Actor as j, focusManager as k, Mutation as l, addConsumeAwareSignal as m, InternetIdentityProvider as n, useQueryClient as o, notifyManager as p, Variant as q, useInternetIdentity as r, require_jsx_runtime as s, useActor as t, getDefaultState as u, functionalUpdate as v, partialMatchKey as w, matchMutation as x, hashKey as y, Nat8 as z };
