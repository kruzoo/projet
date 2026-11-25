const input = document.getElementById('input_crypt');
const output = document.getElementById('output_crypt');
const btnEncrypt = document.getElementById('btnEncrypt');
const btnDecrypt = document.getElementById('btnDecrypt');
const capsLock = document.getElementById('capsLock');
const capsLockDiv = document.getElementById('capsLook_div');
const shiftInput = document.getElementById('caesar-shift');
const shiftValue = document.getElementById('shift-value');
const select = document.getElementById('cipher-select');
const keyVigenere = document.getElementById('keyVigenere');

let shift = Number(shiftInput.value);

select.addEventListener('change', () => {
  const isCaesar = select.value === 'caesar';
  const isVigenere = select.value === 'vigenere';
  const isBinary = select.value === 'binary';

  shiftInput.classList.toggle('nonee', !isCaesar);
  shiftValue.classList.toggle('nonee', !isCaesar);
  keyVigenere.classList.toggle('nonee', !isVigenere);
  capsLockDiv.classList.toggle('nonee', isBinary);
});

shiftInput.addEventListener('input', () => {
  shiftValue.textContent = shiftInput.value;
  shift = Number(shiftInput.value);
});

capsLock.addEventListener('change', () => {
  output.style.textTransform = capsLock.checked ? 'uppercase' : 'none';
});

btnEncrypt.addEventListener('click', () => {
  const text = input.value;
  const cipher = getCipher(select.value);
  let key;
  if (select.value === 'caesar') key = shiftInput.value;
  else if (select.value === 'vigenere') key = keyVigenere.value;

  output.textContent = cipher.encrypt(text, key);

  if (typeof window.updateAnimationText === 'function') {
    window.updateAnimationText(output.textContent);
  }
});

btnDecrypt.addEventListener('click', () => {
  const text = input.value;
  const cipher = getCipher(select.value);
  let key;
  if (select.value === 'caesar') key = shiftInput.value;
  else if (select.value === 'vigenere') key = keyVigenere.value;

  output.textContent = cipher.decrypt(text, key);

  if (typeof window.updateAnimationText === 'function') {
    window.updateAnimationText(output.textContent);
  }
});