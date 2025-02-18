const express = require('express');
const db = require('./database');
const router = express.Router();

router.get('/warehouses', (req, res) => {
    db.all("SELECT * FROM warehouses", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/products', (req, res) => {
    const { warehouse_id, name, quantity } = req.body;
    db.run(`INSERT INTO products (warehouse_id, name, quantity) VALUES (?, ?, ?)`,
        [warehouse_id, name, quantity], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

router.put('/products/:id', (req, res) => {
    const { quantity } = req.body;
    db.run(`UPDATE products SET quantity = ? WHERE id = ?`, [quantity, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

router.delete('/products/:id', (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

module.exports = router;
