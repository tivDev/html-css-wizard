// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('SW registered ✅'))
    .catch(err => console.error('SW failed ❌', err));
}

// Fetch and display users
fetch('https://jsonplaceholder.typicode.com/users')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('user-list');
    data.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.name} (${user.email})`;
      list.appendChild(li);
    });
  })
  .catch(err => {
    const list = document.getElementById('user-list');
    list.innerHTML = `<li>Failed to load users 😢</li>`;
    console.error(err);
  });
