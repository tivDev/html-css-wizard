// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// IndexedDB Setup
let db;
const request = indexedDB.open('userDB', 1);

request.onupgradeneeded = function(e) {
  db = e.target.result;
  db.createObjectStore('users', { keyPath: 'id' });
};

request.onsuccess = function(e) {
  db = e.target.result;
  displayUsersFromDB();
};

document.getElementById('load-users').addEventListener('click', () => {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(users => {
      const tx = db.transaction('users', 'readwrite');
      const store = tx.objectStore('users');
      users.forEach(user => store.put(user));
      tx.oncomplete = displayUsersFromDB;
    })
    .catch(() => {
      console.log('Failed to fetch; using cached data');
      displayUsersFromDB();
    });
});

function displayUsersFromDB() {
  const list = document.getElementById('user-list');
  list.innerHTML = '';
  
  const tx = db.transaction('users', 'readonly');
  const store = tx.objectStore('users');
  const req = store.openCursor();
  
  req.onsuccess = function(e) {
    const cursor = e.target.result;
    if (cursor) {
      const li = document.createElement('li');
      li.textContent = `${cursor.value.name} (${cursor.value.email})`;
      list.appendChild(li);
      cursor.continue();
    }
  };
}
