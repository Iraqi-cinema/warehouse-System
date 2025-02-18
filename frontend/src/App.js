import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [warehouses, setWarehouses] = useState([]);
    
    useEffect(() => {
        axios.get('https://warehouse-system-vqyo.onrender.com')
            .then(response => setWarehouses(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>إدارة المخازن</h1>
            {warehouses.map(warehouse => (
                <a key={warehouse.id} href={`/warehouse/${warehouse.id}`}>
                    <button>{warehouse.name}</button>
                </a>
            ))}
        </div>
    );
}

export default App;
