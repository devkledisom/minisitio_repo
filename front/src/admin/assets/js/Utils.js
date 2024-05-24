// utils.js
import iconv from 'iconv-lite';

export function corrigirCaracteres(cadeiaCodificada) {
    const buffer = Buffer.from(cadeiaCodificada, 'binary');
    const cadeiaCorrigida = iconv.decode(buffer, 'utf-8');

    return cadeiaCorrigida;
}
