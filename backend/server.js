const express = require('express');
const cors = require('cors');
const db = require('./database');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// إضافة مسار رئيسي لاختبار عمل الخادم
app.get("/", (req, res) => {
    res.send("الخادم يعمل بنجاح!");
});

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
