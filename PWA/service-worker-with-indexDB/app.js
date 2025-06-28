if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('SW registered ✅'))
    .catch(err => console.error('SW error ❌', err));
}

const userList = document.getElementById('user-list');

function showUsers(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name} (${user.email})`;
    userList.appendChild(li);
  });
}

async function fetchAndSaveUsers() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();
    await saveUsers(data);
    showUsers(data);
  } catch (err) {
    console.log('Offline. Getting users from IndexedDB...');
    const offlineUsers = await getUsersFromDB();
    showUsers(offlineUsers);
  }
}

// Load users
fetchAndSaveUsers();
