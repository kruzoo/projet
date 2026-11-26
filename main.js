import { startMatrix } from 'https://cdn.jsdelivr.net/gh/kruzoo/ascii-pack@9992e631e5e00561379e4bb2a0275eea01d6216e/matrix.js';
import { startAsciiEarth } from 'https://cdn.jsdelivr.net/gh/kruzoo/ascii-pack@main/ascii-earth.js';
import { startTornado } from 'https://cdn.jsdelivr.net/gh/kruzoo/ascii-pack@42115cb603071a2d83e8d59969a49b9b3eb4d76d/tornado.js';

const canvas = document.getElementById('ascii-canvas');
const textInput = document.getElementById('input_crypt');
const shiftInput = document.getElementById('caesar-shift');
const previewEl = document.getElementById('output_crypt');
const animGroup = document.getElementById('anim-group');
const cipherSelect = document.getElementById('cipher-select');
const keyVigenereInput = document.getElementById('keyVigenere');
const ANIMS = {
  matrix: startMatrix,
  tornado: startTornado,
  earth: startAsciiEarth,
};

const HTML_ESCAPE = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

let intervalId = null;
let current = 'matrix';
let cachedEncoded = '';

function updateInputCache() {
  const raw = textInput ? textInput.value : '';
  const cipherId = cipherSelect ? cipherSelect.value : 'caesar';
  const cipher = getCipher(cipherId);

  let key;
  if (cipherId === 'caesar') key = shiftInput?.value;
  else if (cipherId === 'vigenere') key = keyVigenereInput?.value;

  cachedEncoded = cipher ? cipher.encrypt(raw, key) : raw;

  if (previewEl) {
    previewEl.textContent = cachedEncoded.trim() ? cachedEncoded : '(по умолчанию)';
  }
}

const state = {
  getSpeed: () => 30,
  getAnimation: () => current,
  setIntervalId: (id) => { intervalId = id; },
  getAsciiCanvas: () => canvas,
  getChars: (fallback, stripSpaces = false) => {
    const cleaned = Array.from(cachedEncoded).filter(
      (ch) => ch !== '\n' && ch !== '\r' && (!stripSpaces || ch !== ' ')
    );
    const source = cleaned.join('').trim().length > 0 ? cleaned : Array.from(fallback);
    return source.map((ch) => HTML_ESCAPE[ch] || ch);
  },
};

function clearAnimation() {
  clearInterval(intervalId);
  intervalId = null;
  canvas.innerHTML = '';
}

function run(name = current) {
  current = name;
  canvas.style.color = name === 'matrix' ? '#0f0' : '';
  canvas.style.textShadow = name === 'matrix' ? '0 0 5px #0f0' : 'none';

  animGroup?.querySelectorAll('[data-anim]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.anim === name);
  });

  ANIMS[name]?.(state, clearAnimation);
}

window.updateAnimationText = function (newText) {
  cachedEncoded = newText;
  if (previewEl) {
    previewEl.textContent = cachedEncoded.trim() ? cachedEncoded : '(по умолчанию)';
  }
  run(current);
};

animGroup?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-anim]');
  if (btn) run(btn.dataset.anim);
});

textInput?.addEventListener('input', updateInputCache);
shiftInput?.addEventListener('input', updateInputCache);
cipherSelect?.addEventListener('change', updateInputCache);
keyVigenereInput?.addEventListener('input', updateInputCache);

updateInputCache();
run('matrix');
