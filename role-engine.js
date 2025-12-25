/**
 * role-engine.js - THE SULTAN HYBRID CONTROLLER (v8.5 Stable)
 * Menangani transisi tema dan render beranda untuk 4 Role secara dinamis.
 * Developer: Studio Indragiri
 */

const RoleEngine = {
  // --- UPDATE renderUserDashboard di role-engine.js ---
renderUserDashboard() {
    const container = document.getElementById("page-home");
    if (!container) return;

    // Hitung Tier Sultan (Simulasi 50 Poin awal)
    const tier = "Sultan Bronze"; 

    container.innerHTML = `
        <div class="p-6 space-y-8 fade-in pb-24 text-left">
            <div class="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-2xl flex justify-between items-center text-white shadow-lg">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                        <i class="fas fa-medal"></i>
                    </div>
                    <div>
                        <p class="text-[7px] font-black uppercase opacity-70 leading-none mb-1">Membership Level</p>
                        <h4 class="text-xs font-black italic uppercase">${tier}</h4>
                    </div>
                </div>
                <i class="fas fa-chevron-right text-[10px] opacity-50"></i>
            </div>

            <section class="space-y-4">
                <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-1 border-l-4 border-orange-500 ml-1">Layanan Utama</h3>
                <div class="grid grid-cols-4 gap-y-8">
                    ${SULTAN_SERVICES.top.map(s => dieHantarUI.renderServiceButton(s)).join("")}
                </div>
            </section>

            <div class="bg-zinc-900 p-6 rounded-[2.5rem] relative overflow-hidden border border-orange-500/20">
                <div class="relative z-10">
                    <p class="text-[8px] font-black text-orange-500 uppercase mb-1">Ajak Sultan Lainnya</p>
                    <h3 class="text-white text-xs font-black leading-tight uppercase">Dapatkan Saldo Rp 25k<br>Untuk Setiap Teman!</h3>
                    <button onclick="claimReferral()" class="mt-4 bg-orange-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase">Klaim Kode</button>
                </div>
                <i class="fas fa-users absolute -right-6 -bottom-6 text-8xl opacity-10 text-orange-500 rotate-12"></i>
            </div>
        </div>`;
},
  // 1. Logika Berpindah Role (Cycle: User -> Driver -> Developer -> Merchant)
  async switchRole() {
    const roles = ["user", "driver", "developer", "merchant"];
    let idx = roles.indexOf(currentRole);
    currentRole = roles[(idx + 1) % roles.length];
    isDriverRole = currentRole === "driver";

    localStorage.setItem("active_role", currentRole);

    // Suara Transisi Sultan
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    )
      .play()
      .catch((e) => {});

    this.updateUI();
  },

  // 2. Sinkronisasi Data & UI
  async updateUI() {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();

      this.applyTheme();

      // Render dashboard berdasarkan role aktif
      if (currentRole === "driver") {
        this.renderDriverDashboard(data);
      } else if (currentRole === "developer") {
        this.renderAdminDashboard(data);
      } else if (currentRole === "merchant") {
        this.renderMerchantDashboard(data);
      } else {
        this.renderUserDashboard();
      }

      document.getElementById("role-label").innerText =
        currentRole.toUpperCase();
      switchPage("home");
    } catch (e) {
      console.error("Gagal update UI Sultan:", e);
    }
  },

  // 3. Logika Warna Tema (Dynamic Branding)
  applyTheme() {
    const header = document.getElementById("app-header");
    if (!header) return;

    // Reset semua class warna lama
    header.classList.remove(
      "from-orange-500",
      "to-orange-700",
      "from-blue-600",
      "to-blue-800",
      "from-zinc-800",
      "to-zinc-950",
      "from-emerald-600",
      "to-teal-800",
    );

    if (currentRole === "driver") {
      header.classList.add("from-blue-600", "to-blue-800");
      document.documentElement.style.setProperty("--active-color", "#2563eb");
    } else if (currentRole === "developer") {
      header.classList.add("from-zinc-800", "to-zinc-950");
      document.documentElement.style.setProperty("--active-color", "#71717a");
    } else if (currentRole === "merchant") {
      header.classList.add("from-emerald-600", "to-teal-800");
      document.documentElement.style.setProperty("--active-color", "#059669");
    } else {
      header.classList.add("from-orange-500", "to-orange-700");
      document.documentElement.style.setProperty("--active-color", "#ea580c");
    }
  },

  // 4. Dashboard USER
  renderUserDashboard() {
    const container = document.getElementById("page-home");
    if (!container) return;

    let gridHtml = SULTAN_SERVICES.top
      .map((s) => dieHantarUI.renderServiceButton(s))
      .join("");
    gridHtml += `
            <button onclick="switchPage('all-services')" class="flex flex-col items-center gap-2 active:scale-90">
                <div class="w-14 h-14 bg-zinc-800 text-orange-400 rounded-[1.8rem] flex items-center justify-center text-xl shadow-lg border border-zinc-700"><i class="fas fa-ellipsis"></i></div>
                <p class="text-[7px] font-black uppercase text-zinc-600 mt-1">Lainnya</p>
            </button>`;

    container.innerHTML = `
            <section class="space-y-6 fade-in">
                <h3 class="text-[9px] font-black text-zinc-400 uppercase px-2 leading-none tracking-widest italic border-l-4 border-orange-500 ml-1">Layanan Utama</h3>
                <div class="grid grid-cols-4 gap-y-8">${gridHtml}</div>
            </section>`;
  },

  // 5. Dashboard DRIVER
  renderDriverDashboard(data) {
    const container = document.getElementById("page-home");
    if (!container) return;

    const pendingOrders = data.orders.filter((o) => o.status === "PENDING");

    container.innerHTML = `
            <div class="p-4 space-y-6 fade-in pb-24 text-left">
                <div class="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-8 rounded-[3rem] shadow-xl border border-white/10">
                    <p class="text-[8px] font-black text-blue-300 uppercase tracking-widest mb-1">Pendapatan Hari Ini</p>
                    <h2 class="text-3xl font-black italic tracking-tighter">Rp ${data.driver.balance.toLocaleString("id-ID")}</h2>
                    <div class="mt-6 flex gap-2">
                        <button class="flex-1 bg-white/20 py-2 rounded-xl text-[9px] font-black uppercase">Withdraw</button>
                        <button class="flex-1 bg-white/20 py-2 rounded-xl text-[9px] font-black uppercase">Mutasi Kerja</button>
                    </div>
                </div>
                <div class="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 text-center shadow-sm relative overflow-hidden">
                    <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ${pendingOrders.length === 0 ? "animate-pulse" : ""}">
                        <i class="fas ${pendingOrders.length === 0 ? "fa-satellite-dish" : "fa-bell text-red-500"} text-3xl"></i>
                    </div>
                    <h4 class="text-sm font-black uppercase">${pendingOrders.length === 0 ? "Mencari Sultan..." : "Order Masuk Beb!"}</h4>
                    <p class="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-widest">Status: ONLINE</p>
                </div>
                <div id="driver-order-list" class="space-y-4">
                    ${
                      pendingOrders.length > 0
                        ? pendingOrders
                            .map(
                              (o) => `
                        <div class="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-lg">
                            <h4 class="font-black text-xs uppercase">${o.item}</h4>
                            <p class="text-[9px] text-gray-500 italic">📍 ${o.origin} ➔ ${o.destination}</p>
                            <button onclick="acceptSultanOrder(${o.id})" class="w-full bg-blue-600 text-white py-4 mt-4 rounded-2xl font-black uppercase text-[10px]">Terima Order</button>
                        </div>
                    `,
                            )
                            .join("")
                        : '<div class="text-center py-10 text-gray-300 text-[10px] font-black uppercase">Belum Ada Orderan</div>'
                    }
                </div>
            </div>`;
  },

  // 6. Dashboard DEVELOPER (God Mode)
  renderAdminDashboard(data) {
    const container = document.getElementById("page-home");
    if (!container) return;

    container.innerHTML = `
            <div class="p-6 space-y-6 fade-in pb-24 text-left">
                <div class="bg-zinc-900 p-8 rounded-[3rem] text-white border border-red-500/30 shadow-2xl">
                    <p class="text-[8px] font-black text-red-500 uppercase tracking-[0.4em] mb-2">System God Mode</p>
                    <h2 class="text-xl font-black italic uppercase">Dev Console</h2>
                    <div class="grid grid-cols-2 gap-4 mt-6">
                        <div class="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p class="text-[7px] font-bold text-gray-400 uppercase">Revenue</p>
                            <p class="text-sm font-black text-green-400">Rp ${data.system.total_revenue.toLocaleString()}</p>
                        </div>
                        <div class="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p class="text-[7px] font-bold text-gray-400 uppercase">Users</p>
                            <p class="text-sm font-black text-blue-400">${data.system.downloads}</p>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="alert('User Banned!')" class="p-6 bg-white rounded-[2.5rem] border border-red-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
                        <i class="fas fa-user-slash text-red-500"></i>
                        <span class="text-[7px] font-black uppercase">Ban User</span>
                    </button>
                    <button onclick="alert('Voucher Created!')" class="p-6 bg-white rounded-[2.5rem] border border-green-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
                        <i class="fas fa-ticket text-green-500"></i>
                        <span class="text-[7px] font-black uppercase">Voucher</span>
                    </button>
                </div>
            </div>`;
  },

  // 7. Dashboard MERCHANT (Toko)
  renderMerchantDashboard(data) {
    const container = document.getElementById("page-home");
    if (!container) return;

    container.innerHTML = `
            <div class="p-6 space-y-6 fade-in pb-24 text-left">
                <div class="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-8 rounded-[3rem] shadow-xl">
                    <p class="text-[8px] font-black opacity-60 uppercase">Merchant dieMAKAN</p>
                    <h2 class="text-xl font-black italic uppercase">Sultan Resto</h2>
                    <p class="mt-4 text-[9px] font-bold">Pesanan Hari Ini: ${data.orders.filter((o) => o.item.includes("MAKAN")).length}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-6 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center gap-2">
                        <i class="fas fa-utensils text-emerald-600"></i>
                        <span class="text-[7px] font-black uppercase">Menu</span>
                    </div>
                    <div class="bg-white p-6 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center gap-2">
                        <i class="fas fa-store-slash text-red-400"></i>
                        <span class="text-[7px] font-black uppercase">Tutup</span>
                    </div>
                </div>
                <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-2">Antrean Dapur</h3>
                <div class="text-center py-10 text-gray-300 text-[10px] font-black uppercase italic">Dapur sedang santai, Beb...</div>
            </div>`;
  },
};
// --- UPDATE renderMerchantDashboard di role-engine.js ---
renderMerchantDashboard(data) {
    const container = document.getElementById('page-home');
    if (!container) return;

    // Filter pesanan khusus dieMAKAN yang statusnya PENDING
    const foodOrders = data.orders.filter(o => o.item.includes('MAKAN') && o.status === 'PENDING');

    container.innerHTML = `
        <div class="p-6 space-y-6 fade-in pb-24 text-left">
            <div class="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-8 rounded-[3rem] shadow-xl">
                <p class="text-[8px] font-black opacity-60 uppercase mb-1">Merchant dieMAKAN</p>
                <h2 class="text-xl font-black italic uppercase">Sultan Resto</h2>
            </div>

            <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-2">Pesanan Masuk (${foodOrders.length})</h3>
            
            <div class="space-y-4">
                ${foodOrders.length > 0 ? foodOrders.map(o => `
                    <div class="bg-white p-6 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-black text-xs uppercase text-zinc-800">${o.item}</h4>
                            <span class="text-[8px] font-black text-emerald-600">Rp ${o.price.toLocaleString()}</span>
                        </div>
                        <p class="text-[8px] text-zinc-400 font-bold uppercase mb-4 italic">Pelanggan: ${o.customer}</p>
                        <button onclick="processMerchantOrder(${o.id}, 'COOKING')" class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-[9px] active:scale-95 shadow-lg shadow-emerald-600/20">Terima & Masak</button>
                    </div>
                `).join('') : `
                    <div class="text-center py-10">
                        <i class="fas fa-utensils text-zinc-200 text-4xl mb-4"></i>
                        <p class="text-[10px] text-zinc-300 font-black uppercase italic">Dapur sedang santai, Beb...</p>
                    </div>
                `}
            </div>
        </div>`;
}

renderChatRoom(targetName) {
    const container = document.getElementById('page-home');
    container.innerHTML = `
        <div class="flex flex-col h-[70dvh] fade-in">
            <div class="flex items-center gap-4 mb-6">
                <button onclick="RoleEngine.updateUI()" class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm"><i class="fas fa-arrow-left text-zinc-400"></i></button>
                <h2 class="text-sm font-black uppercase italic">${targetName}</h2>
            </div>
            
            <div id="chat-box" class="flex-1 overflow-y-auto space-y-4 px-2 no-scrollbar">
                <div class="text-center text-[8px] text-zinc-300 uppercase font-black tracking-widest py-10">Mulai Obrolan Sultan...</div>
            </div>

            <div class="mt-4 flex gap-2">
                <input id="chat-input" type="text" placeholder="Ketik pesan..." class="flex-1 bg-white border border-zinc-100 rounded-2xl px-6 py-4 text-[10px] outline-none shadow-sm">
                <button onclick="sendSultanMessage()" class="w-14 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>`;
}

// --- TAMBAHKAN DI RoleEngine di role-engine.js ---
renderTrackingMap() {
    const container = document.getElementById('page-home');
    container.innerHTML = `
        <div class="p-6 space-y-6 fade-in text-left">
            <div class="flex items-center gap-4">
                <button onclick="RoleEngine.updateUI()" class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm"><i class="fas fa-arrow-left"></i></button>
                <h2 class="text-sm font-black uppercase italic">Lacak Driver</h2>
            </div>

            <div class="relative w-full h-80 bg-zinc-100 rounded-[3rem] border-4 border-white shadow-inner overflow-hidden">
                <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
                
                <div id="driver-marker" class="absolute transition-all duration-1000 ease-linear">
                    <div class="relative">
                        <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <i class="fas fa-motorcycle text-xs"></i>
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                </div>

                <div class="absolute top-10 left-1/2 -translate-x-1/2">
                    <div class="w-10 h-10 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <i class="fas fa-home text-xs"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-zinc-50">
                <p class="text-[8px] font-black text-blue-600 uppercase mb-1">Status Pengiriman</p>
                // Akhir dari fungsi renderTrackingMap
        this.startTrackingLoop();
    }, // <--- PASTIKAN ADA KOMA DI SINI SEBELUM ASYNC

    async startTrackingLoop() {
        const marker = document.getElementById('driver-marker');
        // ... sisa kode ...
    const marker = document.getElementById('driver-marker');
    if (!marker) return;

    const res = await fetch('/api/driver/location');
    const coords = await res.json();

    marker.style.left = coords.x + '%';
    marker.style.top = coords.y + '%';

    // Loop setiap 3 detik
    if (currentRole === 'user') setTimeout(() => this.startTrackingLoop(), 3000);
}

// --- TAMBAHKAN DI DALAM renderUserDashboard ---
// --- TAMBAHKAN DI DALAM renderUserDashboard ---
const favoritePlaces = `
    <div class="space-y-3">
        <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-1">Alamat Favorit</h3>
        <div class="flex gap-3">
            <button onclick="setQuickAddress('Rumah Sultan')" class="flex-1 bg-white p-4 rounded-2xl border border-zinc-100 flex items-center gap-3 active:scale-95 transition-all">
                <i class="fas fa-home text-orange-500"></i>
                <span class="text-[8px] font-black text-zinc-700 uppercase">Rumah</span>
            </button>
        </div>
    </div>`;
                <span class="text-[8px] font-black uppercase text-zinc-600">Rumah</span>
            </button>
            <button onclick="setQuickAddress('Kantor Sultan')" class="flex-1 bg-white p-4 rounded-2xl border border-zinc-100 flex items-center gap-3 active:scale-95 transition-all">
                <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-[10px]"><i class="fas fa-briefcase"></i></div>
                <span class="text-[8px] font-black uppercase text-zinc-600">Kantor</span>
            </button>
        </div>
    </div>`;

// Masukkan favoritePlaces ke dalam innerHTML dashboard
const newsBanner = `
    <div class="relative w-full h-32 bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-xl">
        <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500" class="w-full h-full object-cover opacity-50">
        <div class="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
            <p class="text-orange-500 text-[7px] font-black uppercase tracking-[0.3em] mb-1">Promo Akhir Tahun</p>
            <h3 class="text-white text-[10px] font-black uppercase italic">Diskon 50% Semua Layanan Sultan!</h3>
        </div>
    </div>`;
    
    // --- TAMBAHKAN DI RoleEngine (role-engine.js) ---
renderRatingModal(orderData) {
    const modalHtml = `
        <div id="modal-rating" class="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-8 backdrop-blur-md fade-in">
            <div class="bg-white w-full max-w-sm rounded-[3.5rem] p-10 text-center shadow-2xl border-4 border-orange-50">
                <div class="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <i class="fas fa-star text-3xl"></i>
                </div>
                <h3 class="text-lg font-black italic uppercase text-zinc-800">Gimana Drivernya, Beb?</h3>
                <p class="text-[8px] text-zinc-400 mt-2 uppercase font-bold tracking-widest">Berikan Bintang Untuk ${orderData.driverName || 'Mitra Sultan'}</p>
                
                <div class="flex justify-center gap-3 my-8">
                    ${[1, 2, 3, 4, 5].map(i => `
                        <i id="star-${i}" onclick="RoleEngine.setStar(${i})" class="fas fa-star text-3xl text-zinc-100 cursor-pointer transition-all active:scale-125"></i>
                    `).join('')}
                </div>

                <textarea id="feedback-text" placeholder="Tulis pujian buat Mitra..." class="w-full bg-zinc-50 border-none rounded-2xl p-4 text-[10px] mb-6 outline-none focus:ring-2 focus:ring-orange-200" rows="3"></textarea>
                
                <button onclick="RoleEngine.submitRating(${orderData.id}, '${orderData.driverName}')" class="w-full bg-zinc-900 text-white py-5 rounded-3xl font-black uppercase text-[10px] shadow-lg active:scale-95">Kirim Feedback</button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
},

selectedStars: 0,
setStar(n) {
    this.selectedStars = n;
    for (let i = 1; i <= 5; i++) {
        const star = document.getElementById(`star-${i}`);
        star.classList.toggle('text-yellow-400', i <= n);
        star.classList.toggle('text-zinc-100', i > n);
    }
},

async submitRating(orderId, driverName) {
    if (this.selectedStars === 0) return SultanNotify("Kasih Bintang Dulu, Beb!", "error");
    
    const feedback = document.getElementById('feedback-text').value;
    const res = await fetch('/api/order/rate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ orderId, rating: this.selectedStars, feedback, driverName })
    });

    if (res.ok) {
        document.getElementById('modal-rating').remove();
        SultanNotify("Rating Berhasil! +5 Poin Sultan");
        this.updateUI();
    }
}

// --- TAMBAHKAN DI role-engine.js (di luar RoleEngine) ---
const ServiceRouter = {
    render(id) {
        const container = document.getElementById('page-home');
        let html = '';

        // Header kembali yang seragam
        const backBtn = `<button onclick="RoleEngine.updateUI()" class="mb-6 flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400"><i class="fas fa-arrow-left"></i> Kembali</button>`;

        // Logika Job Desk Berdasarkan Kategori
        switch(id) {
            case 'makan':
                html = this.templateOrder('dieMAKAN', 'fa-utensils', 'Pesan Menu Sultan Sekarang');
                break;
            case 'kirim':
                html = this.templateOrder('dieKIRIM', 'fa-box', 'Kirim Paket Aman & Kilat');
                break;
            case 'wash':
                html = this.templateOrder('dieWASH', 'fa-soap', 'Cuci Kendaraan di Lokasi Sultan');
                break;
            case 'taxi':
                html = this.templateOrder('dieTAXI', 'fa-car', 'Perjalanan Mewah Kelas Sultan');
                break;
            case 'dum truck':
                html = this.templateOrder('Sultan LOGISTIK', 'fa-truck-moving', 'Angkut Material Skala Besar');
                break;
            
            // Kategori Finansial
            case 'diepinjam':
            case 'pay-later':
                html = this.templateFinansial(id, 'Ajukan Pinjaman & Dana Darurat');
                break;
            case 'tagihan':
                html = this.templateFinansial(id, 'Bayar Listrik, Air, & Cicilan');
                break;
            case 'investasi donatur':
                html = this.templateFinansial(id, 'Investasi Sosial & Dana Abadi');
                break;

            // Kategori Sosial (CSR Sultan)
            case 'sumbangan':
            case 'berbagi makanan':
            case 'tempat ibadah':
                html = this.templateSosial(id, 'Waktunya Sultan Berbagi Kebaikan');
                break;
            case 'gotong royang':
            case 'sumbang tenaga':
                html = this.templateSosial(id, 'Aksi Komunitas & Gotong Royong');
                break;

            default:
                html = `<div class="p-10 text-center font-black uppercase text-zinc-300">Layanan ${id} Segera Hadir, Beb!</div>`;
        }

        container.innerHTML = backBtn + html;
    },

    // TEMPLATE 1: Komersial (Pemesanan)
    templateOrder(title, icon, subtitle) {
        return `
            <div class="space-y-6">
                <div class="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[3rem] text-white shadow-2xl">
                    <i class="fas ${icon} text-orange-500 text-3xl mb-4"></i>
                    <h2 class="text-xl font-black italic uppercase">${title}</h2>
                    <p class="text-[8px] opacity-50 uppercase tracking-widest">${subtitle}</p>
                </div>
                <div class="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <input type="text" placeholder="Lokasi Penjemputan..." class="w-full mb-3 p-4 bg-zinc-50 rounded-2xl text-[10px] outline-none">
                    <input type="text" placeholder="Tujuan Sultan..." class="w-full p-4 bg-zinc-50 rounded-2xl text-[10px] outline-none">
                    <button onclick="alert('Mencari Driver...')" class="w-full mt-6 bg-orange-600 text-white py-5 rounded-3xl font-black uppercase text-[10px] shadow-lg">Cek Harga</button>
                </div>
            </div>`;
    },

    // TEMPLATE 2: Finansial
    templateFinansial(id, subtitle) {
        return `
            <div class="space-y-6">
                <div class="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl">
                    <h2 class="text-xl font-black italic uppercase">${id.toUpperCase()}</h2>
                    <p class="text-[8px] opacity-70 uppercase font-bold">${subtitle}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-6 rounded-[2.5rem] text-center border border-blue-50">
                        <p class="text-[7px] font-black text-zinc-400 uppercase">Limit Tersedia</p>
                        <p class="text-sm font-black text-blue-600">Rp 10.000.000</p>
                    </div>
                    <button class="bg-zinc-900 text-white rounded-[2.5rem] font-black uppercase text-[8px]">Ajukan Sekarang</button>
                </div>
            </div>`;
    },

    // TEMPLATE 3: Sosial
    templateSosial(id, subtitle) {
        return `
            <div class="space-y-6">
                <div class="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl">
                    <h2 class="text-xl font-black italic uppercase">${id.toUpperCase()}</h2>
                    <p class="text-[8px] opacity-70 uppercase font-bold tracking-tighter">${subtitle}</p>
                </div>
                <div class="p-4 bg-white rounded-[2.5rem] border border-emerald-50">
                    <p class="text-[9px] text-zinc-500 italic px-4">"Tangan di atas lebih baik dari tangan di bawah, Beb."</p>
                </div>
                <button class="w-full bg-emerald-700 text-white py-5 rounded-3xl font-black uppercase text-[10px]">Salurkan Kebaikan</button>
            </div>`;
    }
};

// Di dalam renderUserDashboard() role-engine.js
let gridHtml = SULTAN_SERVICES.top.map((s) => `
    <button onclick="${s.action}" class="flex flex-col items-center gap-2 active:scale-90 transition-all">
        <div class="w-14 h-14 bg-white border border-zinc-100 text-orange-500 rounded-[1.8rem] flex items-center justify-center text-xl shadow-sm">
            <i class="fas ${s.icon}"></i>
        </div>
        <p class="text-[7px] font-black uppercase text-zinc-600 mt-1">${s.label}</p>
    </button>
`).join("");