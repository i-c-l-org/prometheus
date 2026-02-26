const ASCII_MAX = 0x7f;
const BMP_MAX = 0xffff;
const SUPPLEMENTARY_PLANO_DESLOCAMENTO = 0x10000;
const HIGH_SURROGATE_BASE = 0xd800;
const LOW_SURROGATE_BASE = 0xdc00;
const SURROGATE_DESLOCAMENTO = 10;
const SURROGATE_MASCARA = 0x3ff;
const HEX_PAD_LENGTH = 4;
const JSON_INDENTACAO_PADRAO = 2;
export function escapeNonAscii(s) {
    let out = '';
    for (const ch of s) {
        const cp = ch.codePointAt(0);
        if (cp === undefined || cp === null || cp <= ASCII_MAX) {
            out += ch;
        }
        else if (cp <= BMP_MAX) {
            out += `\\u${cp.toString(16).padStart(HEX_PAD_LENGTH, '0')}`;
        }
        else {
            const codePointOffset = cp - SUPPLEMENTARY_PLANO_DESLOCAMENTO;
            const highSurrogate = HIGH_SURROGATE_BASE + (codePointOffset >> SURROGATE_DESLOCAMENTO);
            const lowSurrogate = LOW_SURROGATE_BASE + (codePointOffset & SURROGATE_MASCARA);
            out += `\\u${highSurrogate.toString(16).padStart(HEX_PAD_LENGTH, '0')}`;
            out += `\\u${lowSurrogate.toString(16).padStart(HEX_PAD_LENGTH, '0')}`;
        }
    }
    return out;
}
export function stringifyJsonEscaped(value, space = JSON_INDENTACAO_PADRAO) {
    const replacer = (_key, v) => typeof v === 'string' ? escapeNonAscii(v) : v;
    const raw = JSON.stringify(value, replacer, space);
    return raw.replace(/\\\\u/g, '\\u');
}
//# sourceMappingURL=json.js.map