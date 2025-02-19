import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://warehouse-system-vqyo.onrender.com/api";

function App() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // جلب قائمة المخازن من السيرفر عند تحميل الصفحة
        axios.get(`${API_BASE_URL}/warehouses`)
            .then(response => {
                setWarehouses(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("حدث خطأ أثناء جلب المخازن:", error);
                setError("فشل تحميل المخازن.");
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
            <h1>إدارة المخازن</h1>

            {loading && <p>جاري تحميل البيانات...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
                {warehouses.map((warehouse, index) => (
                    <div key={warehouse.id} style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        borderRadius: "10px",
                        backgroundColor: "#f9f9f9"
                    }}>
                        <h2>المخزن {index + 4}</h2>
                        <p><strong>الموقع:</strong> {warehouse.location}</p>
                        <p><strong>عدد المنتجات:</strong> {warehouse.productCount}</p>
                        <button onClick={() => window.location.href = `/warehouse/${warehouse.id}`} style={{
                            padding: "10px 15px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}>
                            إدارة المخزن
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
