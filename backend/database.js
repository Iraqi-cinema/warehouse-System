const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS warehouses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        warehouse_id INTEGER,
        name TEXT,
        quantity INTEGER,
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
    )`);
});

module.exports = db;
