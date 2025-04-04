const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // تحميل متغيرات البيئة من ملف .env

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ الاتصال بقاعدة البيانات MongoDB Atlas
const MONGO_URI =  "mongodb+srv://almohsen:Iiraq2020@cluster0.abkeh.mongodb.net/Cluster0?retryWrites=true&w=majority";

//const MONGO_URI = "mongodb://almohsen:Iiraq2020@cluster0-shard-00-00.abkeh.mongodb.net:27017,cluster0-shard-00-01.abkeh.mongodb.net:27017,cluster0-shard-00-02.abkeh.mongodb.net:27017/myDatabase?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority";



// التأكد من الاتصال بقاعدة البيانات
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ تم الاتصال بقاعدة البيانات بنجاح!"))
    .catch(err => {
        console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err);
        process.exit(1); // إيقاف التطبيق إذا لم يتم الاتصال
    });

// ✅ إعدادات الـ Middleware
app.use(cors());
app.use(express.json());

// ✅ نموذج بيانات المنتج في المخزن
const productSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    warehouseId: Number // لربط المنتج بمخزن معين
});

const Product = mongoose.model('Product', productSchema);

// ✅ نقطة نهاية لجلب المنتجات لمخزن معين
app.get('/api/products/:warehouseId', async (req, res) => {
    try {
        const { warehouseId } = req.params;
        const products = await Product.find({ warehouseId });
        res.json(products);
    } catch (err) {
        console.error("❌ خطأ أثناء جلب المنتجات:", err);
        res.status(500).json({ error: "حدث خطأ أثناء تحميل المنتجات." });
    }
});

// ✅ نقطة نهاية لإضافة منتج إلى المخزن
app.post('/api/products', async (req, res) => {
    try {
        const { name, quantity, warehouseId } = req.body;
        const newProduct = new Product({ name, quantity, warehouseId });
        await newProduct.save();
        res.status(201).json({ message: "✅ المنتج تمت إضافته بنجاح!", product: newProduct });
    } catch (err) {
        console.error("❌ خطأ أثناء إضافة المنتج:", err);
        res.status(500).json({ error: "حدث خطأ أثناء إضافة المنتج." });
    }
});

// ✅ نقطة نهاية لحذف منتج معين من المخزن
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: "✅ المنتج تم حذفه بنجاح!" });
    } catch (err) {
        console.error("❌ خطأ أثناء حذف المنتج:", err);
        res.status(500).json({ error: "حدث خطأ أثناء حذف المنتج." });
    }
});

// ✅ نقطة نهاية لتحديث كمية المنتج
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, { quantity }, { new: true });
        res.json({ message: "✅ تم تحديث كمية المنتج!", product: updatedProduct });
    } catch (err) {
        console.error("❌ خطأ أثناء تحديث المنتج:", err);
        res.status(500).json({ error: "حدث خطأ أثناء تحديث المنتج." });
    }
});

// ✅ تشغيل الخادم
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});

// ✅ رسالة اختبارية عند فتح الصفحة الرئيسية
app.get("/", (req, res) => {
    res.send("🚀 الخادم يعمل بنجاح!");
});
