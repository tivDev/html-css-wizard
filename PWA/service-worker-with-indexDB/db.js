const DB_NAME = 'UsersDB';
const DB_STORE = 'users';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveUsers(users) {
  const db = await openDB();
  const tx = db.transaction(DB_STORE, 'readwrite');
  const store = tx.objectStore(DB_STORE);
  users.forEach(user => store.put(user));
  return tx.complete;
}

async function getUsersFromDB() {
  const db = await openDB();
  const tx = db.transaction(DB_STORE, 'readonly');
  const store = tx.objectStore(DB_STORE);
  return store.getAll();
}
