/**
 * app-logic.js - THE SULTAN BRAIN v5.5
 * Pusat Kendali Data, Navigasi, Live Tracking, Auto Top-Up & Feedback
 * Developer: Studio Indragiri
 */

// ==========================================
// 1. DATA EKOSISTEM (SINGLE SOURCE OF TRUTH)
// ==========================================
const SULTAN_SERVICES = {
  trusted: [
    {
      id: "dieMOTOR",
      icon: "fa-motorcycle",
      color: "text-orange-600",
      bg: "bg-orange-100",
      label: "MOTOR",
    },
    {
      id: "dieMOBIL",
      icon: "fa-car",
      color: "text-blue-600",
      bg: "bg-blue-100",
      label: "MOBIL",
    },
    {
      id: "dieRODA-TIGA",
      icon: "fa-truck-pickup",
      color: "text-green-600",
      bg: "bg-green-100",
      label: "RODA-3",
    },
    {
      id: "dieMAKAN",
      icon: "fa-utensils",
      color: "text-red-600",
      bg: "bg-red-100",
      label: "dieMAKAN",
    },
    {
      id: "dieKIRIM",
      icon: "fa-box",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      label: "dieKIRIM",
    },
    {
      id: "dieBELANJA",
      icon: "fa-shopping-bag",
      color: "text-purple-600",
      bg: "bg-purple-100",
      label: "BELANJA",
    },
    {
      id: "dieWASH",
      icon: "fa-shirt",
      color: "text-sky-600",
      bg: "bg-white",
      label: "dieWASH",
    },
  ],
  makan: [
    {
      id: "dieMAKAN",
      icon: "fa-pizza-slice",
      color: "text-red-500",
      bg: "bg-red-50",
      label: "MAKAN",
    },
    {
      id: "dieBELANJA",
      icon: "fa-cart-plus",
      color: "text-green-500",
      bg: "bg-green-50",
      label: "BELANJA",
    },
    {
      id: "dieMAKAN HEMAT",
      icon: "fa-tags",
      color: "text-orange-500",
      bg: "bg-orange-50",
      label: "MAKAN HEMAT",
    },
    {
      id: "diePASAR",
      icon: "fa-store",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      label: "diePASAR",
    },
    {
      id: "dieNGE DATE",
      icon: "fa-heart",
      color: "text-pink-500",
      bg: "bg-pink-50",
      label: "NGE DATE",
    },
  ],
  transport: [
    { id: "dieHANTAR MOTOR", icon: "fa-motorcycle", label: "HANTAR MOTOR" },
    { id: "dieHANTAR MOBIL", icon: "fa-car-side", label: "HANTAR MOBIL" },
    { id: "dieHANTAR KERETA", icon: "fa-train", label: "HANTAR KERETA" },
    { id: "diePENGIRIMAN BARANG", icon: "fa-box-open", label: "KIRIM BARANG" },
    { id: "dieTAXI", icon: "fa-taxi", label: "dieTAXI" },
    { id: "dieDUMP-TRUCK", icon: "fa-truck-moving", label: "DUMP TRUCK" },
  ],
};

// ==========================================
// 2. STATE MANAGER
// ==========================================
const MASTER_EMAIL = "cendikiawanstudioindragiri@gmail.com";
let activeLayanan = "",
  progressValue = 0,
  currentRating = 0,
  isDriverRole = false;

// ==========================================
// 3. UI RENDERER ENGINE
// ==========================================
const AppRenderer = {
  init(isDriver = false) {
    this.isDriver = isDriver;
    isDriverRole = isDriver;
    this.renderHome();
    this.renderAllServices();
    this.renderNav();
    this.renderBookingOptions();
    this.renderStatus();
  },

  renderHome() {
    const container = document.getElementById("page-home");
    if (!container) return;
    if (this.isDriver) {
      container.innerHTML = `<h2 class="text-xl font-black italic text-zinc-900 uppercase mb-4">Dompet Mitra</h2><div id="driver-wallet-container"></div><div class="mt-8"><h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-2 mb-4">Riwayat Trip</h3><div id="history-list"></div></div>`;
      dieHantarUI.renderDriverWallet("driver-wallet-container", {
        balance: 850000,
      });
    } else {
      const gridHtml = SULTAN_SERVICES.trusted
        .slice(0, 7)
        .map(
          (s) => `
                <button onclick="startBooking('${s.id}', '${s.icon}')" class="flex flex-col items-center gap-2 active:scale-90 transition-all">
                    <div class="w-14 h-14 bg-white ${s.color} rounded-[1.8rem] flex items-center justify-center text-xl shadow-sm border border-gray-50"><i class="fas ${s.icon}"></i></div>
                    <p class="text-[9px] font-black uppercase text-gray-500 mt-1">${s.id.replace("die", "")}</p>
                </button>`,
        )
        .join("");
      container.innerHTML = `<section class="space-y-6 fade-in"><h3 class="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none px-2">Layanan Super Sultan</h3><div class="grid grid-cols-4 gap-y-8 gap-x-3 text-center">${gridHtml}<button onclick="switchPage('all-services')" class="flex flex-col items-center gap-2 active:scale-95"><div class="w-14 h-14 bg-zinc-100 text-zinc-600 rounded-[1.8rem] flex items-center justify-center text-xl border-2 border-zinc-200"><i class="fas fa-th-large"></i></div><p class="text-[9px] font-black uppercase text-gray-400 mt-1 italic">Lainnya</p></button></div></section>`;
    }
  },

  renderStatus() {
    const area =
      document.getElementById("status-area") ||
      document.getElementById("global-status-container");
    if (!area) return;
    area.innerHTML = `<div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase italic fade-in"><div class="flex items-center gap-2"><div class="w-2 h-2 ${this.isDriver ? "bg-blue-500" : "bg-green-500"} rounded-full animate-pulse"></div><p>${this.isDriver ? "Sistem Mitra Online" : "Ecosystem Active"}</p></div><i class="fas fa-location-dot text-orange-600 text-xs animate-bounce"></i></div>`;
  },

  renderAllServices() {
    const container = document.getElementById("page-all-services");
    if (!container) return;
    container.innerHTML = `
            <div class="flex items-center gap-4 mb-8"><button onclick="switchPage('home')" class="w-10 h-10 bg-white border rounded-2xl flex items-center justify-center active:scale-90 shadow-sm"><i class="fas fa-arrow-left text-xs text-zinc-400"></i></button><h2 class="text-xl font-black italic text-zinc-900 uppercase">Pusat Layanan</h2></div>
            <section class="bg-orange-50/50 p-5 rounded-[2.5rem] border border-orange-100 mb-10 shadow-inner"><h3 class="text-[10px] font-black text-orange-600 uppercase mb-5 px-2">Terpercaya</h3><div class="grid grid-cols-4 gap-4">${SULTAN_SERVICES.trusted.map((s) => `<div onclick="startBooking('${s.id}', '${s.icon}')" class="flex flex-col items-center gap-2"><div class="w-11 h-11 bg-white ${s.color} rounded-xl flex items-center justify-center shadow-sm"><i class="fas ${s.icon} text-lg"></i></div><p class="text-[7px] font-black uppercase">${s.label.replace("die", "")}</p></div>`).join("")}</div></section>
            <section class="space-y-5 px-2 mb-10"><h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">1. Pesan Makan</h3><div class="grid grid-cols-4 gap-y-8">${SULTAN_SERVICES.makan.map((m) => `<div onclick="startBooking('${m.id}', '${m.icon}')" class="flex flex-col items-center gap-2 text-center"><div class="w-11 h-11 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mx-auto shadow-sm"><i class="fas ${m.icon}"></i></div><p class="text-[7px] font-bold uppercase leading-tight">${m.label.replace("die", "")}</p></div>`).join("")}</div></section>
            <section class="space-y-5 px-2 mb-10"><h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">2. Transportasi</h3><div class="grid grid-cols-4 gap-y-8">${SULTAN_SERVICES.transport.map((t) => `<div onclick="startBooking('${t.id}', '${t.icon}')" class="flex flex-col items-center gap-2 text-center"><div class="w-11 h-11 bg-zinc-100 text-zinc-700 rounded-2xl flex items-center justify-center mx-auto"><i class="fas ${t.icon}"></i></div><p class="text-[7px] font-bold uppercase leading-tight">${t.label.replace("die", "")}</p></div>`).join("")}</div></section>`;
  },

  renderNav() {
    const nav = document.getElementById("main-nav");
    if (!nav) return;
    const items = this.isDriver
      ? [
          { id: "home", icon: "fa-radar", label: "Order" },
          { id: "profile", icon: "fa-user-circle", label: "Profil" },
        ]
      : [
          { id: "home", icon: "fa-home", label: "Beranda" },
          { id: "promo", icon: "fa-percentage", label: "Promo" },
          { id: "history", icon: "fa-receipt", label: "Riwayat" },
          { id: "chat", icon: "fa-comment-dots", label: "Pesan" },
          { id: "profile", icon: "fa-crown", label: "Sultan" },
        ];
    nav.innerHTML = items
      .map(
        (i) =>
          `<button onclick="switchPage('${i.id}')" id="nav-${i.id}" class="flex flex-col items-center gap-1 text-gray-300 transition-all active:scale-95"><i class="fas ${i.icon} text-lg"></i><span class="text-[7px] font-black uppercase tracking-tighter">${i.label}</span></button>`,
      )
      .join("");
  },

  renderBookingOptions() {
    const container = document.getElementById("booking-options");
    if (!container) return;
    container.innerHTML = `
            <button onclick="executeOrder('Standard', 15000)" class="w-full p-6 bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus:border-orange-500 flex justify-between items-center group active:scale-95 transition-all"><div class="flex items-center gap-4"><div id="opt-icon-1" class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm"></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase mb-1">Standard</h4><p class="text-[8px] text-gray-400 font-bold uppercase">Ekonomis & Cepat</p></div></div><p class="text-sm font-black text-zinc-900 italic">Rp 15k</p></button>
            <button onclick="executeOrder('Sultan Class', 25000)" class="w-full p-6 bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus:border-orange-500 flex justify-between items-center group active:scale-95 transition-all"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm"><i class="fas fa-crown"></i></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase mb-1">Sultan Class</h4><p class="text-[8px] text-gray-400 font-bold uppercase">VIP Luxury Service</p></div></div><p class="text-sm font-black text-zinc-900 italic">Rp 25k</p></button>`;
  },

  renderTrackingView(order, driver) {
    const homeContainer = document.getElementById("page-home");
    if (!homeContainer) return;
    homeContainer.innerHTML = `
            <div class="space-y-6 fade-in">
                <div class="flex justify-between items-center px-2">
                    <div><h3 class="text-xl font-black italic text-zinc-900 uppercase leading-none">${order.item}</h3><p class="text-[8px] font-black text-orange-600 uppercase tracking-widest mt-1 animate-pulse">Status: Driver OTW Lokasi</p></div>
                    <div class="text-right"><p id="eta-display" class="text-[18px] font-black italic text-zinc-900 leading-none">-- MIN</p><p class="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">Estimasi Tiba</p></div>
                </div>
                <div id="map-slot"></div>
                <div class="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=${driver.name}&background=18181b&color=f97316" class="w-full h-full object-cover">
                        </div>
                        <div><h4 class="text-xs font-black uppercase text-zinc-800">${driver.name}</h4><p class="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">Elite Mitra • ${driver.id}</p></div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="switchPage('chat')" class="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center active:scale-90"><i class="fas fa-comment-dots text-xs"></i></button>
                        <button onclick="alert('Menghubungi...')" class="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center active:scale-90"><i class="fas fa-phone text-xs"></i></button>
                    </div>
                </div>
            </div>`;
  },
};

// ==========================================
// 4. THE MASTER SYNC LOOP (REAL-TIME HEARTBEAT)
// ==========================================
async function syncAll() {
  try {
    const res = await fetch("/api/data");
    const d = await res.json();
    const user = d.user;
    const activeOrder = d.orders.find((o) => o.status === "PENDING");
    const homeContainer = document.getElementById("page-home");

    // 1. INFINITE WEALTH MANAGER (Auto Top-Up)
    if (
      user.auto_topup &&
      user.auto_topup.active &&
      user.balance < user.auto_topup.threshold
    ) {
      await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: user.auto_topup.amount }),
      });
      alert(
        `⚡ AUTO TOP-UP SULTAN!\nSaldo Anda telah diisi otomatis sebesar Rp ${user.auto_topup.amount.toLocaleString()}`,
      );
      return syncAll();
    }

    // 2. GLOBAL STATS SYNC (Header & Identity)
    if (document.getElementById("balance"))
      document.getElementById("balance").innerText =
        "Rp " + user.balance.toLocaleString("id-ID");
    if (document.getElementById("user-display-name"))
      document.getElementById("user-display-name").innerText = user.name;
    if (document.getElementById("user-avatar"))
      document.getElementById("user-avatar").src =
        `https://ui-avatars.com/api/?name=${user.name}&background=fff&color=ea580c`;

    // 3. SMART UI SWITCHER (Menu vs Tracking)
    if (!isDriverRole && homeContainer) {
      if (activeOrder) {
        // Render rangka tracking jika belum ada
        if (!document.getElementById("map-slot")) {
          AppRenderer.renderTrackingView(activeOrder, d.driver);
        }
        // Update pergerakan motor & ETA secara halus
        if (progressValue < 90) {
          progressValue += 3;
          const eta = Math.max(1, 5 - Math.floor(progressValue / 20));
          if (document.getElementById("eta-display"))
            document.getElementById("eta-display").innerText = `${eta} MIN`;
          dieHantarUI.renderLiveMap(
            "map-slot",
            progressValue,
            activeOrder.item,
          );
        } else {
          completeOrderSultan(activeOrder.id);
        }
      } else {
        // Kembalikan ke menu utama jika pesanan selesai
        if (
          document.getElementById("map-slot") ||
          homeContainer.innerHTML.trim() === ""
        ) {
          progressValue = 0;
          AppRenderer.renderHome();
        }
      }
    }

    // 4. DYNAMIC PAGE CONTENT (Profil & History)
    const profilePage = document.getElementById("page-profile");
    if (profilePage && !profilePage.classList.contains("hidden")) {
      dieHantarUI.renderUserStats("user-stats-container", {
        trips: d.orders.length,
        points: user.points,
        years: 1,
      });
      // Gunakan ID auto-topup-slot agar tidak bentrok dengan stats
      const autoTopupContainer = document.getElementById("auto-topup-slot");
      if (autoTopupContainer)
        dieHantarUI.renderAutoTopupCard("auto-topup-slot", user.auto_topup);
    }

    dieHantarUI.renderHistory("history-list", d.orders);
    if (d.system.maintenance === "ON")
      document.getElementById("maint-screen").classList.remove("hidden");
  } catch (e) {
    console.warn("Syncing...");
  }
}

// ==========================================
// 5. TRANSACTIONAL ACTIONS (API INTERFACE)
// ==========================================
async function executeOrder(tipe, harga) {
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item: `${activeLayanan} [${tipe}]`,
        price: harga,
      }),
    });
    if (res.ok) {
      closeBooking();
      SultanSound.playOrder();
      alert("🔔 PESANAN SULTAN TERKIRIM!");
      switchPage("home");
      syncAll();
    }
  } catch (e) {
    alert("Sistem Sibuk!");
  }
}

async function completeOrderSultan(orderId) {
  try {
    const res = await fetch("/api/complete-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId }),
    });
    if (res.ok) {
      progressValue = 0;
      const d = await (await fetch("/api/data")).json();
      dieHantarUI.renderReviewModal("modal-container", d.driver.name);
    }
  } catch (e) {
    console.log("Finish Error");
  }
}

async function submitSultanReview() {
  if (currentRating === 0) return alert("Berikan bintang dulu, Sultan! ⭐");
  await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rating: currentRating,
      comment: document.getElementById("review-comment").value,
    }),
  });
  if (document.getElementById("modal-review"))
    document.getElementById("modal-review").remove();
  alert("😇 Terimakasih Sultan! Poin Loyalitas Anda bertambah.");
  syncAll();
}

async function toggleAutoTopup(isActive) {
  await fetch("/api/user/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active: isActive }),
  });
  syncAll();
}

// ==========================================
// 6. NAVIGATION & UTILITIES
// ==========================================
function switchPage(pageId) {
  document
    .querySelectorAll(".page-content")
    .forEach((p) => p.classList.add("hidden"));
  const target = document.getElementById("page-" + pageId);
  if (target) target.classList.remove("hidden");

  document
    .querySelectorAll("nav button")
    .forEach((b) => b.classList.remove("active-tab"));
  const navId = [
    "bills",
    "finance-hub",
    "social-hub",
    "diepay-history",
    "all-services",
  ].includes(pageId)
    ? "history"
    : pageId;
  const navBtn = document.getElementById("nav-" + navId);
  if (navBtn) navBtn.classList.add("active-tab");

  // Quick refresh saat ganti halaman
  syncAll();
}

function setSultanRating(n) {
  currentRating = n;
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`star-${i}`).querySelector("i");
    star.className =
      i <= n
        ? "fas fa-star text-yellow-400 scale-125"
        : "far fa-star text-gray-200 scale-100";
  }
}

function startBooking(layanan, icon) {
  activeLayanan = layanan;
  if (document.getElementById("modal-booking")) {
    document.getElementById("booking-title").innerText = `Pesan ${layanan}`;
    document.getElementById("opt-icon-1").innerHTML =
      `<i class="fas ${icon} text-lg text-orange-600"></i>`;
    document.getElementById("modal-booking").classList.remove("hidden");
  }
}

const SultanSound = {
  playOrder() {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
    );
    audio.play().catch(() => {});
  },
};
function closeBooking() {
  document.getElementById("modal-booking").classList.add("hidden");
}
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
async function executeWithdraw() {
  alert("✅ Tarik tunai sukses!");
  syncAll();
}
