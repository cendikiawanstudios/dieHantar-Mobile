/**
 * master.js - JANTUNG EKOSISTEM dieHantar
 * Node.js Express Server v5.5 - Sultan Super App Edition
 * Fitur: Auto-Persistence, Triple Port Hub, Live Tracking Sync, & Sultan Auto Top-Up
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

// 1. KONFIGURASI PORT & PATH
const PORT_USER = 3000;
const PORT_MITRA = 4000;
const PORT_DEV = 5000;

const appUser = express();    // Portal Sultan Rosdalianti
const appMitra = express();   // Portal Bang Jago
const appDev = express();     // Studio Indragiri Dev Tools

const DB_PATH = path.join(__dirname, 'data.json');
const MASTER_EMAIL = 'cendikiawanstudioindragiri@gmail.com';
const MASTER_PASS = '12345678';

// ==========================================
// 2. DATABASE ENGINE (SULTAN PERSISTENCE)
// ==========================================
const getData = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const initialData = {
                user: { 
                    name: 'Sultan Rosdalianti', 
                    balance: 2500000, 
                    points: 4850,
                    auto_topup: { active: true, threshold: 100000, amount: 1000000 }
                },
                driver: { id: '772', name: 'Bang Jago', balance: 850000, status: 'ONLINE' },
                orders: [
                    { id: 101, item: "dieMOTOR [Sultan Class]", price: 25000, status: "COMPLETED", time: "10:20" }
                ],
                chats: [],
                reviews: [],
                system: { maintenance: 'OFF', version: '5.5', total_transactions: 1 }
            };
            fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const rawData = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(rawData);
    } catch (e) {
        console.error("Database Error, resetting to default...");
        return { 
            user: { name: 'Sultan Rosdalianti', balance: 2500000, points: 4850, auto_topup: { active: true, threshold: 100000, amount: 1000000 } }, 
            driver: { id: '772', name: 'Bang Jago', balance: 850000 }, 
            orders: [], chats: [], reviews: [], system: { maintenance: 'OFF' } 
        };
    }
};

const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ==========================================
// 3. MIDDLEWARE CONFIGURATION
// ==========================================
[appUser, appMitra, appDev].forEach(app => {
    app.use(express.json());
    app.use(express.static(__dirname)); // Melayani index.html, driver.html, dll.
});

// ==========================================
// 4. AUTHENTICATION & SECURITY
// ==========================================
const handleLogin = (req, res) => {
    const { username, password } = req.body;
    if (username === MASTER_EMAIL && password === MASTER_PASS) {
        return res.json({ success: true, name: 'Master Developer', role: 'developer' });
    }
    if (username === 'Rosda' && password === '123') return res.json({ success: true, name: 'Sultan Rosdalianti', role: 'user' });
    if (username === 'driver01' && password === 'jago123') return res.json({ success: true, name: 'Bang Jago', role: 'driver' });
    res.status(401).json({ success: false, msg: 'Kredensial Sultan Salah!' });
};

appUser.post('/api/login', handleLogin);
appMitra.post('/api/login', handleLogin);

// ==========================================
// 5. CORE BUSINESS LOGIC (USER ACTIONS)
// ==========================================

// Shared Data API
const sharedDataHandler = (req, res) => res.json(getData());
appUser.get('/api/data', sharedDataHandler);
appMitra.get('/api/data', sharedDataHandler);
appDev.get('/api/data', sharedDataHandler);

// Order Logic
appUser.post('/api/order', (req, res) => {
    let db = getData();
    const { item, price } = req.body;
    if (db.user.balance < price) return res.status(400).json({ success: false, msg: 'Saldo Kurang!' });

    const newOrder = {
        id: Date.now(),
        item: item,
        price: price,
        status: 'PENDING',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    db.user.balance -= price;
    db.orders.push(newOrder);
    saveData(db);
    res.json({ success: true, order: newOrder });
});

// Auto-Complete Order (By System/Tracker)
appUser.post('/api/complete-order', (req, res) => {
    let db = getData();
    const order = db.orders.find(o => o.id === req.body.id);
    if (order && order.status === 'PENDING') {
        order.status = 'COMPLETED';
        db.user.points += 50; 
        saveData(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ msg: 'Order tidak valid' });
    }
});

// Feedback System
appUser.post('/api/review', (req, res) => {
    let db = getData();
    const { rating, comment } = req.body;
    db.reviews.push({ rating, comment, time: new Date().toISOString() });
    db.chats.push({ sender: 'System', text: `⭐ Sultan memberi ${rating} bintang!`, time: 'Now' });
    saveData(db);
    res.json({ success: true });
});

// Topup & Configuration
appUser.post('/api/topup', (req, res) => {
    let db = getData();
    db.user.balance += parseInt(req.body.amount);
    saveData(db);
    res.json({ success: true });
});

appUser.post('/api/user/config', (req, res) => {
    let db = getData();
    db.user.auto_topup = { ...db.user.auto_topup, ...req.body };
    saveData(db);
    res.json({ success: true, config: db.user.auto_topup });
});

// ==========================================
// 6. MITRA ACTIONS (BANG JAGO)
// ==========================================
appMitra.post('/api/withdraw', (req, res) => {
    let db = getData();
    const amount = parseInt(req.body.amount);
    if (db.driver.balance >= amount) {
        db.driver.balance -= amount;
        saveData(db);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Saldo tidak cukup!" });
    }
});

appMitra.post('/api/toggle-status', (req, res) => {
    let db = getData();
    db.driver.status = db.driver.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    saveData(db);
    res.json({ success: true, status: db.driver.status });
});

// ==========================================
// 7. DEVELOPER TOOLS (PORT 5000)
// ==========================================
appDev.post('/api/admin/inject', (req, res) => {
    let db = getData();
    const { target, amount } = req.body;
    if(target === 'user') db.user.balance += parseInt(amount);
    if(target === 'driver') db.driver.balance += parseInt(amount);
    saveData(db);
    res.json({ success: true, msg: `Injeksi Rp ${amount} Berhasil!` });
});

appDev.post('/api/admin/system', (req, res) => {
    let db = getData();
    db.system.maintenance = req.body.status;
    saveData(db);
    res.json({ success: true });
});

// ==========================================
// 8. LAUNCH ALL SYSTEMS
// ==========================================
appUser.listen(PORT_USER, () => console.log(`🚀 Portal USER: http://localhost:${PORT_USER}`));
appMitra.listen(PORT_MITRA, () => console.log(`📡 Portal MITRA: http://localhost:${PORT_MITRA}`));
appDev.listen(PORT_DEV, () => console.log(`🛠️  Portal DEV: http://localhost:${PORT_DEV}`));

console.log('--- dieHantar Quantum Ecosystem v5.5 Synchronized ---');