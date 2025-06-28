// Get DOM elements
const input = document.getElementById('nameInput');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');
const output = document.getElementById('output');

// Save button click — store input in localStorage
saveBtn.addEventListener('click', () => {
  const name = input.value.trim();
  if (name) {
    localStorage.setItem('username', name);
    output.textContent = `Saved "${name}" to localStorage!`;
    input.value = '';
  } else {
    output.textContent = 'Please enter a name before saving.';
  }
});

// Load button click — get data from localStorage
loadBtn.addEventListener('click', () => {
  const savedName = localStorage.getItem('username');
  if (savedName) {
    output.textContent = `Loaded name from storage: "${savedName}"`;
  } else {
    output.textContent = 'No name found in localStorage.';
  }
});

// Clear button click — clear localStorage key
clearBtn.addEventListener('click', () => {
  localStorage.removeItem('username');
  output.textContent = 'Cleared saved name from localStorage.';
});
