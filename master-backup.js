/**
 * master.js - JANTUNG EKOSISTEM dieHantar
 * Node.js Express Server v6.0 - Financial & Wallet Engine
 */

// ... (Konfigurasi PORT dan getData tetap sama, tambahkan endpoint ini) ...

// ENDPOINT TRANSAKSI DOMPET SULTAN
appUser.post("/api/wallet/transaction", (req, res) => {
  let db = getData();
  const { type, amount, method, target } = req.body;

  if (type === "TOPUP") {
    db.user.balance += amount;
  } else if (type === "TRANSFER") {
    if (db.user.balance < amount)
      return res
        .status(400)
        .json({ success: false, msg: "Saldo Sultan Tidak Cukup!" });
    db.user.balance -= amount;
  }

  // Catat ke riwayat transaksi keuangan
  const finRecord = {
    id: Date.now(),
    item: `${type}: ${method}`,
    price: amount,
    paymentMethod: method,
    destination: target,
    status: "COMPLETED",
    time: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  db.orders.push(finRecord); // Masukkan ke riwayat utama agar muncul di list Sultan
  saveData(db);
  res.json({ success: true });
});

// ... (Sisa kode master.js sebelumnya biarkan tetap sama) ...
