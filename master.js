/**
 * master.js - JANTUNG EKOSISTEM dieHantar v7.2 (Unified Stable)
 * Peta Penempatan Kode - Versi Sultan Tahan Banting
 * Developer: Studio Indragiri
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(__dirname));

// ==========================================
// SECTION 1: DATABASE ENGINE (Gudang Data)
// ==========================================
// --- Tempat Mengatur Penyimpanan & Load Data ---
const getData = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = {
        users: [
          {
            username: "Rosda",
            password: "123",
            name: "Sultan Rosdalianti",
            role: "user",
            balance: 100000,
            points: 50,
          },
        ],
        drivers: [
          {
            username: "driver01",
            password: "123",
            name: "Bang Jago",
            role: "driver",
            balance: 500000,
            status: "ONLINE",
            income: 0,
          },
        ],
        admins: [
          {
            username: "dev",
            password: "123",
            name: "Admin Pusat",
            role: "developer",
          },
        ],
        orders: [],
        chats: [],
        vouchers: [],
        reports: [],
        system: { downloads: 1540, total_revenue: 0 },
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (e) {
    return { users: [], drivers: [], admins: [] };
  }
};
const saveData = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ==========================================
// SECTION 2: LOGIN SYSTEM (Pintu Gerbang)
// ==========================================
// --- Tempat Menambah Logika Akun Baru (RBAC) ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  let db = getData();

  let account = db.users.find(
    (u) => u.username === username && u.password === password,
  );
  if (account) return res.json({ success: true, role: "user", data: account });

  account = db.drivers.find(
    (u) => u.username === username && u.password === password,
  );
  if (account)
    return res.json({ success: true, role: "driver", data: account });

  account = db.admins.find(
    (u) => u.username === username && u.password === password,
  );
  if (account)
    return res.json({ success: true, role: "developer", data: account });

  res.status(401).json({ success: false, msg: "Akun tidak ditemukan!" });
});

// ==========================================
// SECTION 3: DATA ACCESS (Jaringan Shared)
// ==========================================
// --- Tempat Mengambil Data untuk Semua Role ---
app.get("/api/data", (req, res) => res.json(getData()));

// ==========================================
// SECTION 4: FINANCIAL HUB (dieHantar Pay)
// ==========================================
// --- Tempat Logika Saldo, Topup, & Transfer ---
app.post("/api/wallet/transaction", (req, res) => {
  let db = getData();
  const { type, amount, method, target } = req.body;

  if (type === "TOPUP") {
    db.users[0].balance += parseInt(amount);
  } else if (type === "TRANSFER") {
    if (db.users[0].balance < amount)
      return res
        .status(400)
        .json({ success: false, msg: "Saldo Sultan Tidak Cukup!" });
    db.users[0].balance -= parseInt(amount);
  }

  const finRecord = {
    id: Date.now(),
    item: `${type}: ${method}`,
    price: amount,
    paymentMethod: method,
    destination: target || "Sultan Hub",
    status: "COMPLETED",
    time: new Date().toLocaleTimeString("id-ID"),
    date: new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  db.orders.push(finRecord);
  saveData(db);
  res.json({ success: true });
});

// ==========================================
// SECTION 5: CORE BUSINESS LOGIC (Transaksi)
// ==========================================
// --- Tempat Logika Orderan & Pesan Chat ---
app.post("/api/order", (req, res) => {
  let db = getData();
  const newOrder = {
    id: Date.now(),
    ...req.body,
    status: "PENDING",
    time: new Date().toLocaleTimeString("id-ID"),
    date: new Date().toLocaleDateString("id-ID"),
  };
  db.orders.push(newOrder);
  saveData(db);
  res.json({ success: true, order: newOrder });
});

app.post("/api/chat", (req, res) => {
  let db = getData();
  db.chats.push({
    ...req.body,
    time: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  saveData(db);
  res.json({ success: true });
});

// ==========================================
// SECTION 6: DEVELOPER CONSOLE (Admin Only)
// ==========================================
// --- Tempat Menambah Fitur Monitoring Dev ---
app.get("/api/admin/stats", (req, res) => {
  let db = getData();
  res.json({
    downloads: db.system.downloads,
    active_drivers: db.drivers.filter((d) => d.status === "ONLINE").length,
    total_drivers: db.drivers.length,
    revenue: db.system.total_revenue,
    users_count: db.users.length,
  });
});

// ==========================================
// SECTION 7: RUN ENGINE (Aktivasi)
// ==========================================
// --- Jangan Merubah Bagian Ini Kecuali Port ---
app.listen(PORT, () => {
  console.log(`🚀 Server dieHantar v7.2 OK!`);
  console.log(`👉 Buka: http://localhost:${PORT}`);
});
// --- TAMBAHKAN DI SECTION 5 master.js ---
app.get("/api/driver/simulation-order", (req, res) => {
  let db = getData();
  const sultanNames = ["Rosda", "Rama", "Kirana", "Sultan Riau", "Beb Sultan"];
  const items = [
    "dieMOTOR [Standard]",
    "dieMOBIL [Sultan Class]",
    "dieMAKAN: Nasi Goreng",
    "dieKIRIM: Paket Dokumen",
  ];

  const newSimOrder = {
    id: Date.now(),
    item: items[Math.floor(Math.random() * items.length)],
    price: Math.floor(Math.random() * 20000) + 15000,
    origin: "Pusat Sultan",
    destination: "Alamat Beb",
    customer: sultanNames[Math.floor(Math.random() * sultanNames.length)],
    status: "PENDING",
    time: new Date().toLocaleTimeString("id-ID"),
    date: new Date().toLocaleDateString("id-ID"),
  };

  db.orders.push(newSimOrder);
  saveData(db);
  res.json({ success: true, order: newSimOrder });
});
// --- TAMBAHKAN DI master.js ---

// 1. Database Voucher Awal (Bisa ditambah manual di data.json)
const initialVouchers = [
  { code: "SULTAN313", discount: 10000, minOrder: 20000 },
  { code: "MAKANGRATIS", discount: 5000, minOrder: 15000 },
];

// 2. Endpoint Cek Voucher
app.post("/api/voucher/claim", (req, res) => {
  const { code, amount } = req.body;
  const v = initialVouchers.find((x) => x.code === code);
  if (!v) return res.status(404).json({ success: false, msg: "Kode Salah!" });
  if (amount < v.minOrder)
    return res
      .status(400)
      .json({ success: false, msg: "Minimal Order Belum Cukup!" });
  res.json({ success: true, discount: v.discount });
});

// 3. Modifikasi Logika Order (Tambah Poin Sultan)
app.post("/api/order", (req, res) => {
  let db = getData();
  const { price } = req.body;

  // Setiap Rp 10.000 dapat 1 Poin
  const earnedPoints = Math.floor(price / 10000);
  db.users[0].points += earnedPoints;

  const newOrder = {
    id: Date.now(),
    ...req.body,
    status: "PENDING",
    pointsEarned: earnedPoints,
    time: new Date().toLocaleTimeString("id-ID"),
    date: new Date().toLocaleDateString("id-ID"),
  };
  db.orders.push(newOrder);
  saveData(db);
  res.json({ success: true, order: newOrder, totalPoints: db.users[0].points });
});

db.orders.push(newOrder);
saveData(db);
res.json({ success: true, order: newOrder, totalPoints: db.users[0].points });

// --- TAMBAHKAN DI master.js SECTION 5 ---
app.post("/api/merchant/process", (req, res) => {
  let db = getData();
  const { orderId, action } = req.body;

  const orderIndex = db.orders.findIndex((o) => o.id == orderId);
  if (orderIndex === -1)
    return res
      .status(404)
      .json({ success: false, msg: "Order tidak ditemukan!" });

  // Update status pesanan: PENDING -> COOKING -> READY
  db.orders[orderIndex].status = action;
  saveData(db);
  res.json({ success: true, msg: `Pesanan ${action}!` });
});

app.get("/api/chat/:room", (req, res) => {
  let db = getData();
  const roomChat = db.chats.filter((c) => c.room === req.params.room);
  res.json(roomChat);
});

// --- TAMBAHKAN DI master.js SECTION 1 (Gudang Data) ---
// Update objek drivers di initial data
drivers: ([
  {
    username: "driver01",
    name: "Bang Jago",
    role: "driver",
    balance: 500000,
    status: "ONLINE",
    coords: { x: 20, y: 80 }, // Posisi awal dalam persen (%)
  },
],
  // --- TAMBAHKAN DI SECTION 5 (Core Logic) ---
  app.get("/api/driver/location", (req, res) => {
    let db = getData();
    // Simulasi pergerakan driver setiap dipanggil
    db.drivers[0].coords.x += Math.random() * 2 - 1;
    db.drivers[0].coords.y -= Math.random() * 2;
    saveData(db);
    res.json(db.drivers[0].coords);
  }));

app.post("/api/wallet/verify", (req, res) => {
  const { username, localBalance } = req.body;
  let db = getData();
  const user = db.users.find((u) => u.username === username);

  // Validasi: Jika saldo lokal lebih besar dari database, itu indikasi cheat
  if (user && localBalance > user.balance) {
    return res.json({
      valid: false,
      correctBalance: user.balance,
      msg: "Sultan Terdeteksi Curang!",
    });
  }
  res.json({ valid: true });
});

// --- TAMBAHKAN DI master.js SECTION 5 ---
app.post("/api/order/rate", (req, res) => {
  let db = getData();
  const { orderId, rating, feedback, driverName } = req.body;

  // 1. Update Rating di Riwayat Order
  const orderIndex = db.orders.findIndex((o) => o.id == orderId);
  if (orderIndex !== -1) {
    db.orders[orderIndex].rating = rating;
    db.orders[orderIndex].feedback = feedback;
    db.orders[orderIndex].status = "RATED";
  }

  // 2. Update Rating Driver (Simulasi pencarian driver)
  const driverIndex = db.drivers.findIndex((d) => d.name === driverName);
  if (driverIndex !== -1) {
    // Logika rata-rata sederhana: (Rating Baru + Rating Lama) / 2
    const oldRating = db.drivers[driverIndex].rating || 5.0;
    db.drivers[driverIndex].rating = ((oldRating + rating) / 2).toFixed(1);
  }

  saveData(db);
  res.json({ success: true, msg: "Rating Sultan Terkirim!" });
});
