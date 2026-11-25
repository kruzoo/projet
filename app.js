const input = document.getElementById('input_crypt');
const output = document.getElementById('output_crypt');
const btnEncrypt = document.getElementById('btnEncrypt');
const btnDecrypt = document.getElementById('btnDecrypt');
const capsLock = document.getElementById('capsLock');
const capsLockDiv = document.getElementById('capsLook_div');
const shiftInput = document.getElementById('caesar-shift');
const shiftValue = document.getElementById('shift-value');
const shiftControl = document.querySelector('.shift-control');
const select = document.getElementById('cipher-select');
const keyVigenere = document.getElementById('keyVigenere');

function getCipherKey() {
  if (select.value === 'caesar') return shiftInput.value;
  if (select.value === 'vigenere') return keyVigenere.value;
  return undefined;
}

function applyCipher(mode) {
  const cipher = getCipher(select.value);
  if (!cipher) return;

  const result = cipher[mode](input.value, getCipherKey());
  output.textContent = result;

  if (typeof window.updateAnimationText === 'function') {
    window.updateAnimationText(result);
  }
}

select.addEventListener('change', () => {
  const isCaesar = select.value === 'caesar';
  const isVigenere = select.value === 'vigenere';
  const isBinary = select.value === 'binary';

  shiftControl.classList.toggle('nonee', !isCaesar);
  keyVigenere.classList.toggle('nonee', !isVigenere);
  capsLockDiv.classList.toggle('nonee', isBinary);
});

shiftInput.addEventListener('input', () => {
  shiftValue.textContent = shiftInput.value;
});

capsLock.addEventListener('change', () => {
  output.style.textTransform = capsLock.checked ? 'uppercase' : 'none';
});

btnEncrypt.addEventListener('click', () => applyCipher('encrypt'));
btnDecrypt.addEventListener('click', () => applyCipher('decrypt'));
