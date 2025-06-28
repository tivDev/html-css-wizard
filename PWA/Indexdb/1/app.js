class PersonDB {
  constructor() {
    // Database name and object store name
    this.dbName = 'MyDB';
    this.storeName = 'people';
    this.db = null;
    this.output = document.getElementById('output');

    // Start database setup
    this.init();
  }

  // Initialize and open IndexedDB
  init() {
    // Open database
    const request = indexedDB.open(this.dbName, 1);

    // Runs only once when database is created or upgraded
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;

      // Create object store if it doesn't exist
      if (!this.db.objectStoreNames.contains(this.storeName)) {
        this.db.createObjectStore(this.storeName, { keyPath: 'id' });
      }
    };

    // Runs every time database opens successfully
    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.log('Database opened successfully!');
      this.bindUI(); // Attach button events
      this.renderPeopleTable(); // Show data on first load
    };

    // If database fails to open
    request.onerror = (event) => {
      this.log('Error opening database: ' + event.target.error);
    };
  }

  // Bind buttons to class methods
  bindUI() {
    document.getElementById('addBtn').onclick = () => this.addPerson();
    document.getElementById('getBtn').onclick = () => this.getPerson();
    document.getElementById('clearBtn').onclick = () => this.clearAll();
  }

  // Utility to show messages or content in output div
  log(message) {
    this.output.textContent = message;
  }

  // Add a person (called when "Add Person" button is clicked)
  addPerson() {
    const id = Number(document.getElementById('idInput').value);
    const name = document.getElementById('nameInput').value.trim();
    const age = Number(document.getElementById('ageInput').value);

    // Basic validation
    if (!id || !name || !age) {
      this.log('Please fill in all fields correctly.');
      return;
    }

    // Start a read-write transaction and store
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    // Add person object to store
    const request = store.add({ id, name, age });

    // If added successfully
    request.onsuccess = () => {
      this.log(`Person added: ID=${id}, Name=${name}, Age=${age}`);
      document.getElementById('idInput').value = '';
      document.getElementById('nameInput').value = '';
      document.getElementById('ageInput').value = '';
      this.renderPeopleTable(); // Refresh data table
    };

    // If person already exists
    request.onerror = () => {
      this.log(`Error adding person (maybe ID ${id} already exists).`);
    };
  }

  // Get a person by ID (called when "Get Person" button is clicked)
  getPerson() {
    const id = Number(document.getElementById('getIdInput').value);

    // Validate input
    if (!id) {
      this.log('Please enter a valid ID to get.');
      return;
    }

    // Start a read-only transaction
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.get(id);

    // If record found
    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        this.log(`Person found:\nID: ${result.id}\nName: ${result.name}\nAge: ${result.age}`);
      } else {
        this.log(`No person found with ID: ${id}`);
      }
    };

    // On error
    request.onerror = () => {
      this.log('Error retrieving person.');
    };
  }

  // Clear all records in the database (called when "Clear All" is clicked)
  clearAll() {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const request = store.clear();

    request.onsuccess = () => {
      this.log('All data has been cleared.');
      this.renderPeopleTable(); // Refresh table after clearing
    };

    request.onerror = () => {
      this.log('Failed to clear data.');
    };
  }

  // Render all people in a table (auto-called on load and on updates)
  renderPeopleTable() {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.openCursor();

    // Start building the table
    let tableHTML = `<table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Age</th>
        </tr>
      </thead>
      <tbody>`;



    // Loop through records using a cursor
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const { id, name, age } = cursor.value;
        tableHTML += `<tr><td>${id}</td><td>${name}</td><td>${age}</td></tr>`;
        cursor.continue(); // move to next
      } else {
        tableHTML += '</tbody></table>';
        this.output.innerHTML = tableHTML;
      }
    };

    request.onerror = () => {
      this.output.innerHTML = '<p>Error loading table.</p>';
    };
  }

  // (Optional) Log all people to the browser console
  listAllPeople() {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.openCursor();

    console.log('All people in the database:');
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        console.log(cursor.value);
        cursor.continue();
      } else {
        console.log('No more entries.');
      }
    };

    request.onerror = () => {
      console.error('Error listing people.');
    };
  }
}

// Create a global app instance after page loads
window.onload = () => {
  window.app = new PersonDB();
};
