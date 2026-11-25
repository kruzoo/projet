const CIPHERS = {};
function registerCipher(cipher) { CIPHERS[cipher.id] = cipher; }
function getCipher(id) { return CIPHERS[id] || null; }

function charToPos(elm) {
  const code = elm.codePointAt(0);
  if (code >= 48 && code <= 57) return code - 48;
  if (code >= 65 && code <= 90) return code - 65 + 10;
  if (code >= 97 && code <= 122) return code - 97 + 36;
  if (code >= 1040 && code <= 1071) return code - 1040 + 62;
  if (code >= 1072 && code <= 1103) return code - 1072 + 94;
  return -1;
}

function posToChar(pos) {
  if (pos <= 9) return String.fromCodePoint(pos + 48);
  if (pos <= 35) return String.fromCodePoint(pos - 10 + 65);
  if (pos <= 61) return String.fromCodePoint(pos - 36 + 97);
  if (pos <= 93) return String.fromCodePoint(pos - 62 + 1040);
  return String.fromCodePoint(pos - 94 + 1072);
}

function shiftCharUnified(elm, shift) {
  const pos = charToPos(elm);
  if (pos === -1) return elm;
  const newPos = ((pos + shift) % 126 + 126) % 126;
  return posToChar(newPos);
}

function caesarText(text, shift) {
  let result = '';
  for (const ch of Array.from(text)) {
    result += shiftCharUnified(ch, shift);
  }
  return result;
}

registerCipher({
  id: 'caesar',
  encrypt(text, key) { return caesarText(text, Number(key)); },
  decrypt(text, key) { return caesarText(text, -Number(key)); },
});

function keyToShift(key) {
  const codeKey = [];
  for (const ch of Array.from(key)) {
    const code = ch.codePointAt(0);
    if (code >= 65 && code <= 90) codeKey.push(code - 65);
    else if (code >= 97 && code <= 122) codeKey.push(code - 97);
    else if (code >= 1040 && code <= 1071) codeKey.push(code - 1040);
    else if (code >= 1072 && code <= 1103) codeKey.push(code - 1072);
  }
  return codeKey;
}

function vigenereText(text, key, direction) {
  const shifts = keyToShift(key);
  if (shifts.length === 0) return text;
  let result = '';
  let j = 0;
  for (const ch of Array.from(text)) {
    if (charToPos(ch) !== -1) {
      const shift = shifts[j % shifts.length] * direction;
      result += shiftCharUnified(ch, shift);
      j++;
    } else {
      result += ch;
    }
  }
  return result;
}

registerCipher({
  id: 'vigenere',
  encrypt(text, key) { return vigenereText(text, key, 1); },
  decrypt(text, key) { return vigenereText(text, key, -1); },
});

function textToBinary(text) {
  return Array.from(text)
    .map((ch) => ch.codePointAt(0).toString(2))
    .join(' ');
}

function binaryToText(binary) {
  return binary.trim().split(/\s+/).map((bits) => {
    const code = parseInt(bits, 2);
    return isNaN(code) ? '' : String.fromCodePoint(code);
  }).join('');
}

registerCipher({
  id: 'binary',
  encrypt(text) { return textToBinary(text); },
  decrypt(text) { return binaryToText(text); },
});
