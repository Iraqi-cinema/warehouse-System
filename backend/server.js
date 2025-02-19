const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://username:password@cluster.mongodb.net/warehouse";

// إعدادات السيرفر
app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("تم الاتصال بقاعدة البيانات"))
    .catch(err => console.error("خطأ في الاتصال بقاعدة البيانات:", err));

// تعريف النموذج (Schema) للمنتجات
const productSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    warehouseId: Number
});
const Product = mongoose.model("Product", productSchema);

// ✅ جلب المنتجات حسب `warehouseId`
app.get("/api/products", async (req, res) => {
    try {
        console.log("🔍 الطلب الوارد:", req.query); // سيساعد في تصحيح الأخطاء
        const warehouseId = req.query.warehouseId;
        
        if (!warehouseId) {
            return res.status(400).json({ error: "❌ يجب تحديد warehouseId في الطلب. مثال: /api/products?warehouseId=4" });
        }

        const products = await Product.find({ warehouseId });
        res.json(products);
    } catch (error) {
        console.error("🚨 خطأ أثناء جلب المنتجات:", error);
        res.status(500).json({ error: "❌ حدث خطأ أثناء جلب المنتجات" });
    }
});

// ✅ إضافة منتج جديد
app.post("/api/products", async (req, res) => {
    try {
        const { name, quantity, warehouseId } = req.body;
        if (!name || !quantity || !warehouseId) {
            return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }

        const newProduct = new Product({ name, quantity, warehouseId });
        await newProduct.save();
        res.json({ message: "تمت إضافة المنتج بنجاح", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء إضافة المنتج" });
    }
});

// ✅ تحديث كمية منتج
app.put("/api/products/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const { quantity } = req.body;
        
        const product = await Product.findOneAndUpdate({ name }, { quantity }, { new: true });
        if (!product) {
            return res.status(404).json({ error: "المنتج غير موجود" });
        }

        res.json({ message: "تم تحديث الكمية بنجاح", product });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء التحديث" });
    }
});

// ✅ حذف منتج
app.delete("/api/products/:name", async (req, res) => {
    try {
        const { name } = req.params;
        
        const product = await Product.findOneAndDelete({ name });
        if (!product) {
            return res.status(404).json({ error: "المنتج غير موجود" });
        }

        res.json({ message: "تم حذف المنتج بنجاح" });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء الحذف" });
    }
});

// ✅ تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});
