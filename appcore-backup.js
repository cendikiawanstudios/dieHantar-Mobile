/**
 * app-core.js - THE SULTAN SYSTEM v6.2 (Unified Absolute Edition)
 * Fitur: Chat, Promo, History Klik-able, Struk Share, PT Cards Modern, & Financial Hub
 * Developer: Studio Indragiri
 */

const SULTAN_SERVICES = {
  top: [
    {
      id: "dieMOTOR",
      icon: "fa-motorcycle",
      color: "text-orange-600",
      label: "MOTOR",
    },
    { id: "dieMOBIL", icon: "fa-car", color: "text-blue-600", label: "MOBIL" },
    {
      id: "dieRODA-TIGA",
      icon: "fa-truck-pickup",
      color: "text-green-600",
      label: "RODA-3",
    },
    {
      id: "dieMAKAN",
      icon: "fa-utensils",
      color: "text-red-600",
      label: "MAKAN",
    },
    {
      id: "dieKIRIM",
      icon: "fa-box",
      color: "text-yellow-600",
      label: "KIRIM",
    },
    {
      id: "dieBELANJA",
      icon: "fa-shopping-bag",
      color: "text-purple-600",
      label: "BELANJA",
    },
    { id: "dieWASH", icon: "fa-shirt", color: "text-sky-600", label: "WASH" },
  ],
  food: [
    {
      id: "dieMAKAN",
      icon: "fa-pizza-slice",
      color: "text-red-500",
      label: "MAKAN",
    },
    {
      id: "dieBELANJA",
      icon: "fa-bag-shopping",
      color: "text-purple-500",
      label: "BELANJA",
    },
    {
      id: "dieHEMAT",
      icon: "fa-tags",
      color: "text-orange-500",
      label: "MAKAN HEMAT",
    },
    {
      id: "diePASAR",
      icon: "fa-store",
      color: "text-emerald-500",
      label: "PASAR",
    },
    {
      id: "dieNGEDATE",
      icon: "fa-heart",
      color: "text-pink-500",
      label: "NGE DATE",
    },
  ],
  transport: [
    {
      id: "dieHANTAR-MOTOR",
      icon: "fa-motorcycle",
      color: "text-orange-600",
      label: "HANTAE MOTOR",
    },
    {
      id: "dieHANTAR-MOBIL",
      icon: "fa-car-side",
      color: "text-blue-600",
      label: "HANTAR MOBIL",
    },
    {
      id: "dieHANTAR-KERETA",
      icon: "fa-train-subway",
      color: "text-indigo-600",
      label: "HANTAR KERETA",
    },
    {
      id: "diePENGIRIMAN",
      icon: "fa-box-open",
      color: "text-yellow-600",
      label: "KIRIM BARANG",
    },
    {
      id: "dieTAXI",
      icon: "fa-taxi",
      color: "text-yellow-400",
      label: "TA-XI",
    },
    {
      id: "dieDUMPTRUCK",
      icon: "fa-truck-moving",
      color: "text-zinc-600",
      label: "DUMP-TRUCK",
    },
  ],
  payment: [
    {
      id: "dieMINJAM",
      icon: "fa-hand-holding-dollar",
      color: "text-green-600",
      label: "dieMINJAM",
    },
    {
      id: "dieTAGIHAN",
      icon: "fa-file-invoice-dollar",
      color: "text-blue-500",
      label: "TAGIHAN",
    },
    {
      id: "dieTERDEKAT",
      icon: "fa-map-location-dot",
      color: "text-red-500",
      label: "BELANJA TERDEKAT",
    },
    {
      id: "dieBPKB",
      icon: "fa-id-card-clip",
      color: "text-blue-700",
      label: "BPKB KENDARAAN",
    },
    {
      id: "diePAYLATER",
      icon: "fa-credit-card",
      color: "text-purple-600",
      label: "PAY-LATER",
    },
    {
      id: "dieKONTER",
      icon: "fa-house-signal",
      color: "text-sky-500",
      label: "KONTER DIRUMAH",
    },
    {
      id: "dieINVESTASI",
      icon: "fa-chart-line",
      color: "text-emerald-600",
      label: "INVESTASI DONATUR",
    },
  ],
  social: [
    {
      id: "dieSUMBANGAN",
      icon: "fa-hand-holding-heart",
      color: "text-rose-500",
      label: "SUMBANGAN",
    },
    {
      id: "dieIBADAH",
      icon: "fa-mosque",
      color: "text-emerald-700",
      label: "TEMPAT IBADAH",
    },
    {
      id: "dieBERBAGI",
      icon: "fa-bowl-food",
      color: "text-orange-500",
      label: "BERBAGI MAKANAN",
    },
    {
      id: "dieGOTONGROYONG",
      icon: "fa-users-gears",
      color: "text-blue-500",
      label: "GOTONG ROYONG",
    },
    {
      id: "dieTENAGA",
      icon: "fa-handshake-angle",
      color: "text-amber-600",
      label: "SUMBANG TENAGA",
    },
  ],
};

// Global State
let activeLayanan = "",
  progressValue = 0,
  currentRating = 0,
  isDriverRole = false,
  lastStatus = "IDLE";
let tempOrderData = {
  type: "Standard",
  price: 0,
  payment: null,
  gajianData: null,
};
let selectedPTValue = "";
let globalOrders = []; // Cache untuk riwayat agar tidak flicker

// ==========================================
// 2. UI LIBRARY
// ==========================================
const dieHantarUI = {
  renderServiceButton(s) {
    return `
            <button onclick="startBooking('${s.id}', '${s.icon}')" class="flex flex-col items-center gap-2 active:scale-90 transition-all">
                <div class="w-14 h-14 bg-white ${s.color} rounded-[1.8rem] flex items-center justify-center text-xl shadow-sm border border-gray-50"><i class="fas ${s.icon}"></i></div>
                <p class="text-[7px] font-black uppercase text-gray-500 mt-1 text-center leading-tight px-1">${s.label}</p>
            </button>`;
  },

  renderUserStats(id, stats) {
    const c = document.getElementById(id);
    if (c)
      c.innerHTML = `<div class="grid grid-cols-3 gap-3 mb-6 fade-in"><div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center"><p class="text-orange-600 font-black text-sm">${stats.trips || 0}</p><p class="text-[6px] text-gray-400 font-black uppercase">Trips</p></div><div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center"><p class="text-zinc-900 font-black text-sm">${stats.points || 0}</p><p class="text-[6px] text-gray-400 font-black uppercase">Points</p></div><div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center"><p class="text-zinc-900 font-black text-sm">1Th</p><p class="text-[6px] text-gray-400 font-black uppercase">Member</p></div></div>`;
  },

  renderHistory(id, orders) {
    const c = document.getElementById(id);
    if (!c) return;
    if (globalOrders.length === orders.length && c.innerHTML !== "") return;
    globalOrders = orders;

    c.innerHTML =
      orders
        .slice()
        .reverse()
        .map(
          (o, index) => `
            <div onclick="openReceiptFromHistory(${orders.length - 1 - index})" class="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex justify-between items-center mb-3 shadow-sm active:scale-95 transition-all cursor-pointer group">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 ${o.status === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"} rounded-2xl flex items-center justify-center text-xs shadow-inner">
                        <i class="fas ${o.status === "COMPLETED" ? "fa-check-double" : "fa-clock"}"></i>
                    </div>
                    <div>
                        <p class="text-[7px] font-black uppercase ${o.status === "COMPLETED" ? "text-green-500" : "text-orange-500"} mb-1">${o.status}</p>
                        <h4 class="font-black text-xs text-zinc-800 leading-tight">${o.item}</h4>
                        <p class="text-[6px] text-gray-400 font-black uppercase mt-1">${o.date || "Tgl N/A"}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-black text-xs italic text-zinc-900">Rp ${parseInt(o.price).toLocaleString("id-ID")}</p>
                    <i class="fas fa-chevron-right text-[8px] text-gray-200 group-hover:text-orange-500 mt-1"></i>
                </div>
            </div>`,
        )
        .join("") ||
      `<div class="text-center py-20 text-gray-300 font-black text-[10px] uppercase italic">Belum Ada Perjalanan Beb</div>`;
  },

  renderReceiptModal(order) {
    const fullDate =
      order.date ||
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    const fullTime =
      order.time ||
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

    let extraInfo = "";
    if (order.employeeInfo) {
      extraInfo = `
                <div class="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p class="text-[7px] font-black text-gray-400 uppercase mb-2">Data Potong Gajian</p>
                    <p class="text-[9px] font-bold text-zinc-700 leading-tight">
                        👤 ${order.employeeInfo.name} <br>
                        🆔 ${order.employeeInfo.nik} <br>
                        🏢 ${order.employeeInfo.pt}
                    </p>
                </div>`;
    }

    const receiptHtml = `
            <div id="modal-receipt" class="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 backdrop-blur-md fade-in">
                <div class="bg-white w-full max-w-sm rounded-[3.5rem] overflow-hidden shadow-2xl animate-slide-up">
                    <div class="bg-zinc-900 p-10 text-center text-white">
                        <div class="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><i class="fas fa-receipt text-2xl text-white"></i></div>
                        <h3 class="text-xl font-black italic uppercase tracking-tighter">Struk dieHantar</h3>
                        <p class="text-[8px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-2">Digital Receipt Sultan</p>
                    </div>
                    <div class="p-10 pt-8 space-y-4">
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-[9px] font-black text-gray-400 uppercase">Waktu</span>
                            <span class="text-[9px] font-black text-zinc-800">${fullDate} | ${fullTime}</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-[9px] font-black text-gray-400 uppercase">Layanan</span>
                            <span class="text-[9px] font-black text-zinc-800 uppercase">${order.item}</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-[9px] font-black text-gray-400 uppercase">Bayar</span>
                            <span class="text-[9px] font-black text-orange-600 uppercase">${order.paymentMethod}</span>
                        </div>
                        <div class="space-y-1">
                            <p class="text-[7px] font-black text-gray-300 uppercase">Rute</p>
                            <p class="text-[9px] font-bold text-zinc-700 leading-tight">📍 ${order.origin} 🏁 ${order.destination}</p>
                        </div>
                        ${extraInfo}
                        <div class="pt-6 mt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                            <span class="text-xs font-black uppercase italic">Total</span>
                            <span class="text-2xl font-black italic text-zinc-900">Rp ${parseInt(order.price).toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                    <div class="p-10 pt-0 flex gap-3">
                        <button onclick="closeReceipt()" class="flex-1 py-5 bg-gray-100 text-zinc-400 rounded-3xl font-black uppercase text-[10px]">Tutup</button>
                        <button onclick="shareSultanReceipt('${encodeURIComponent(JSON.stringify(order))}')" class="flex-1 py-5 bg-zinc-900 text-white rounded-3xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-xl">
                            <i class="fas fa-share-nodes text-xs text-orange-500"></i> Bagikan
                        </button>
                    </div>
                </div>
            </div>`;
    const div = document.createElement("div");
    div.id = "receipt-root";
    div.innerHTML = receiptHtml;
    document.body.appendChild(div);
  },
};

function openReceiptFromHistory(orderIndex) {
  const order = globalOrders[orderIndex];
  if (order) dieHantarUI.renderReceiptModal(order);
}

// ==========================================
// 3. LOGIKA RENDER HALAMAN
// ==========================================
const AppRenderer = {
  init(isDriver = false) {
    this.isDriver = isDriver;
    isDriverRole = isDriver;
    this.renderHome();
    this.renderNav();
    this.renderBookingOptions();
    this.renderAllServices();
  },

  renderHome() {
    const container = document.getElementById("page-home");
    if (!container) return;
    if (this.isDriver) {
      container.innerHTML = `<h2 class="text-xl font-black italic text-zinc-900 uppercase mb-4 text-center">Portal Mitra</h2><div id="driver-wallet-container"></div>`;
    } else {
      let gridHtml = SULTAN_SERVICES.top
        .map((s) => dieHantarUI.renderServiceButton(s))
        .join("");
      gridHtml += `<button onclick="switchPage('all-services')" class="flex flex-col items-center gap-2 active:scale-90 transition-all"><div class="w-14 h-14 bg-zinc-800 text-orange-400 rounded-[1.8rem] flex items-center justify-center text-xl shadow-lg border border-zinc-700"><i class="fas fa-ellipsis"></i></div><p class="text-[7px] font-black uppercase text-zinc-600 mt-1">Lainnya</p></button>`;
      container.innerHTML = `<section class="space-y-6 fade-in"><h3 class="text-[9px] font-black text-zinc-400 uppercase px-2 leading-none tracking-widest italic">Layanan Super Sultan</h3><div class="grid grid-cols-4 gap-y-8">${gridHtml}</div></section>`;
    }
  },

  renderAllServices() {
    const container = document.getElementById("page-all-services");
    if (!container) return;
    const cats = [
      { title: "1. MAKAN & BELANJA", data: SULTAN_SERVICES.food },
      { title: "2. TRANSPORTASI", data: SULTAN_SERVICES.transport },
      { title: "3. PEMBAYARAN", data: SULTAN_SERVICES.payment },
      { title: "4. SOSIAL", data: SULTAN_SERVICES.social },
    ];
    let html = `<div id="live-tracking-slot" class="mb-8"></div><div class="flex items-center gap-4 mb-10"><button onclick="switchPage('home')" class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-400 active:scale-90"><i class="fas fa-arrow-left text-xs"></i></button><h2 class="text-xl font-black italic text-zinc-900 uppercase">Eksplorasi Sultan</h2></div>`;
    cats.forEach((c) => {
      const grid = c.data
        .map((s) => dieHantarUI.renderServiceButton(s))
        .join("");
      html += `<div class="mb-14"><h3 class="text-[9px] font-black text-zinc-400 uppercase px-2 mb-8 tracking-[0.2em] border-l-4 border-orange-500 ml-2 leading-tight">${c.title}</h3><div class="grid grid-cols-4 gap-y-12">${grid}</div></div>`;
    });
    container.innerHTML = html;
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
          `<button id="nav-${i.id}" onclick="switchPage('${i.id}')" class="flex flex-col items-center gap-1 text-gray-300 relative active:scale-95 transition-all"><i class="fas ${i.icon} text-lg"></i><span class="text-[7px] font-black uppercase tracking-tighter">${i.label}</span>${i.id === "home" ? '<div id="active-order-badge" class="hidden absolute top-0 right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-white animate-pulse"></div>' : ""}</button>`,
      )
      .join("");
  },

  renderBookingOptions() {
    const container = document.getElementById("booking-options");
    if (!container) return;
    container.innerHTML = `
            <p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-4">Pilih Kelas Sultan</p>
            <button onclick="setSultanClass('Standard', 15000)" id="class-standard" class="class-btn w-full p-6 bg-orange-50 rounded-[2rem] border-2 border-orange-500 flex justify-between items-center transition-all active:scale-95">
                <div class="flex items-center gap-4"><div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm"><i class="fas fa-motorcycle text-lg"></i></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase leading-none">Standard</h4><p class="text-[8px] text-gray-400 font-bold uppercase mt-1">Cepat & Irit</p></div></div>
                <p class="text-sm font-black text-zinc-900 italic">Rp 15k</p>
            </button>
            <button onclick="setSultanClass('Sultan Class', 25000)" id="class-sultan" class="class-btn w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent flex justify-between items-center transition-all active:scale-95">
                <div class="flex items-center gap-4"><div class="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm"><i class="fas fa-crown text-lg"></i></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase leading-none">Sultan Class</h4><p class="text-[8px] text-gray-400 font-bold uppercase mt-1">VIP Luxury</p></div></div>
                <p class="text-sm font-black text-zinc-900 italic">Rp 25k</p>
            </button>`;
    document.getElementById("btn-submit-order").innerText =
      "Lanjut Ke Pembayaran";
    document.getElementById("btn-submit-order").onclick = () =>
      showPaymentStep();
  },
};

// ==========================================
// 4. CORE SYNC & LOGIC
// ==========================================
async function syncAll() {
  try {
    const res = await fetch("/api/data");
    const d = await res.json();
    const user = d.user;
    const activeOrder = d.orders.find((o) => o.status === "PENDING");

    if (lastStatus === "PENDING" && !activeOrder) {
      const sound = document.getElementById("audio-ding");
      if (sound) sound.play().catch((e) => {});
      alert(
        `✨ PERJALANAN SELESAI!\nSultan ${user.name.split(" ")[0]} sampai tujuan.`,
      );
    }
    lastStatus = activeOrder ? "PENDING" : "IDLE";

    if (document.getElementById("welcome-name"))
      document.getElementById("welcome-name").innerText = user.name
        .split(" ")[0]
        .toUpperCase();
    ["user-display-name", "prof-name-display"].forEach((id) => {
      if (document.getElementById(id))
        document.getElementById(id).innerText = user.name.toUpperCase();
    });

    const formattedBalance = "Rp " + user.balance.toLocaleString("id-ID");
    if (document.getElementById("balance"))
      document.getElementById("balance").innerText = formattedBalance;

    // --- UPDATE SALDO DI HALAMAN WALLET ---
    if (document.getElementById("wallet-balance-big")) {
      document.getElementById("wallet-balance-big").innerText =
        formattedBalance;
    }

    const badge = document.getElementById("active-order-badge");
    if (activeOrder) {
      if (badge) badge.classList.remove("hidden");
      if (
        !isDriverRole &&
        !document
          .getElementById("page-all-services")
          .classList.contains("hidden")
      ) {
        if (!document.getElementById("map-slot"))
          AppRenderer.renderTrackingCard(activeOrder, d.driver);
        if (progressValue < 95) {
          progressValue += 2;
          dieHantarUI.renderLiveMap(
            "map-slot",
            progressValue,
            activeOrder.item,
          );
        } else {
          completeOrderSultan(activeOrder.id);
        }
      }
    } else {
      if (badge) badge.classList.add("hidden");
      progressValue = 0;
    }

    dieHantarUI.renderHistory("history-list", d.orders);
    if (!document.getElementById("page-chat").classList.contains("hidden")) {
      dieHantarUI.renderChats("chat-box-user", d.chats);
    }
  } catch (e) {
    console.warn("Pulse Gagal...");
  }
}

function switchPage(pageId) {
  document
    .querySelectorAll(".page-content")
    .forEach((p) => p.classList.add("hidden"));
  const target = document.getElementById("page-" + pageId);
  if (target) target.classList.remove("hidden");

  if (pageId === "promo") AppRenderer.renderPromos();
  if (pageId === "history" || pageId === "chat" || pageId === "wallet-hub")
    syncAll();

  document.querySelectorAll("nav button").forEach((b) => {
    b.classList.remove("active-tab", "text-orange-600");
    b.classList.add("text-gray-300");
  });
  const navBtn = document.getElementById(
    "nav-" +
      (pageId === "all-services" || pageId === "wallet-hub" ? "home" : pageId),
  );
  if (navBtn) {
    navBtn.classList.add("active-tab", "text-orange-600");
    navBtn.classList.remove("text-gray-300");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ==========================================
// 6. BOOKING & PAYMENT LOGIC
// ==========================================
function showPaymentStep() {
  const origin = document.getElementById("input-origin").value;
  const dest = document.getElementById("input-destination").value;
  if (!origin || !dest)
    return alert("Alamat jemput & tujuan wajib Sultan isi Beb!");

  const container = document.getElementById("booking-options");
  const methods = [
    {
      id: "mbanking",
      label: "M-Banking Indonesia",
      icon: "fa-building-columns",
    },
    { id: "qris", label: "Scan QRIS Sultan", icon: "fa-qrcode" },
    { id: "diepay", label: "dieHantar Pay", icon: "fa-wallet" },
    { id: "ewallet", label: "E-Wallet Sultan", icon: "fa-mobile-screen" },
    { id: "potonggajian", label: "Bayar diePotongGajian", icon: "fa-receipt" },
  ];
  container.innerHTML = `<p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-4">Metode Pembayaran Sultan</p><div class="space-y-3">${methods.map((m) => `<button onclick="renderPaymentDetails('${m.id}', '${m.label}')" class="pay-option-btn w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent flex items-center justify-between transition-all active:scale-95"><div class="flex items-center gap-4"><div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-sm"><i class="fas ${m.icon} text-xs"></i></div><span class="text-[10px] font-bold text-zinc-700 uppercase">${m.label}</span></div><i class="fas fa-chevron-right text-zinc-300 text-[10px]"></i></button>`).join("")}</div>`;
}

function renderPaymentDetails(id, label) {
  tempOrderData.payment = label;
  const container = document.getElementById("booking-options");
  if (id === "potonggajian") {
    const ptList = [
      "PT. RIAU SAKTI UNITED PLANTATIONS",
      "PT. PUTRA RIAU ABADI",
      "PT. ELANG DAMAY PERKASA",
      "PT. MEDI JAYA ABADI",
      "PT. SRIKANDI MITRA USAHA",
      "PT. RIAU MANDALA PUTRA",
      "PT. ASKAR DAKSA MANDALA",
    ];
    container.innerHTML = `<div class="space-y-6 fade-in pb-4"><div class="p-4 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col items-center text-center"><div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-600 mb-2"><i class="fas fa-barcode text-xl"></i></div><p class="text-[8px] font-black text-orange-600 uppercase mb-1 italic">Scan Identitas Karyawan</p><button class="bg-orange-600 text-white px-3 py-1 rounded-lg text-[8px] font-black">SCAN KODE BATANG</button></div><div class="space-y-3"><input id="pg-name" type="text" placeholder="Nama Lengkap" class="w-full bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100"><div class="grid grid-cols-2 gap-3"><input id="pg-nik" type="text" placeholder="NIK Label" class="bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100"><input id="pg-fixno" type="number" placeholder="Fix No" class="bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100"></div></div><p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest pl-1">Pilih Perusahaan Anda</p><div class="space-y-2 max-h-60 overflow-y-auto no-scrollbar">${ptList.map((pt, i) => `<button onclick="selectSultanPT('${pt}', ${i})" id="pt-card-${i}" class="pt-card w-full p-4 bg-white rounded-2xl border border-gray-100 flex justify-between items-center group text-left transition-all"><div class="flex items-center gap-3"><i class="fas fa-building text-zinc-400 text-[10px]"></i><span class="text-[9px] font-black text-zinc-700 uppercase leading-tight">${pt}</span></div><i class="fas fa-check-circle text-orange-600 opacity-0"></i></button>`).join("")}</div><input id="pg-pt-custom" oninput="clearPTSelection()" type="text" placeholder="Nama PT Belum Terdaftar? Ketik di sini..." class="w-full bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100 italic"></div>`;
  } else {
    container.innerHTML = `<div class="p-8 bg-orange-50 rounded-[2.5rem] text-center fade-in"><i class="fas fa-shield-halved text-4xl text-orange-600 mb-4"></i><h4 class="text-sm font-black uppercase text-zinc-800 tracking-tighter">Pembayaran Aman</h4><p class="text-[9px] text-gray-500 mt-2">Menunggu konfirmasi via ${label}</p></div>`;
  }
  document.getElementById("btn-submit-order").innerText = "Konfirmasi & Bayar";
  document.getElementById("btn-submit-order").onclick = () =>
    executeFinalOrder(id);
}

async function executeFinalOrder(payId) {
  let gajian = null;
  if (payId === "potonggajian") {
    const name = document.getElementById("pg-name").value,
      nik = document.getElementById("pg-nik").value,
      fix = document.getElementById("pg-fixno").value;
    if (
      !name ||
      !nik ||
      !fix ||
      (!selectedPTValue && !document.getElementById("pg-pt-custom").value)
    )
      return alert("Lengkapi data Sultan Beb!");
    gajian = {
      name,
      nik,
      fix,
      pt: selectedPTValue || document.getElementById("pg-pt-custom").value,
    };
  }
  const origin = document.getElementById("input-origin").value,
    dest = document.getElementById("input-destination").value;
  const orderPayload = {
    item: `${activeLayanan} [${tempOrderData.type}]`,
    price: tempOrderData.price,
    origin,
    destination: dest,
    paymentMethod: tempOrderData.payment,
    employeeInfo: gajian,
  };

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    if (res.ok) {
      closeBooking();
      dieHantarUI.renderReceiptModal(orderPayload);
      syncAll();
    } else alert("Saldo Kurang!");
  } catch (e) {
    alert("Sistem Sibuk!");
  }
}

// --- LOGIKA SHARING ---
function shareSultanReceipt(orderEncoded) {
  const order = JSON.parse(decodeURIComponent(orderEncoded));
  const text = `👑 *STRUK DIGITAL dieHantar* 👑\n\n📅 Waktu: ${order.date || "Tgl N/A"} ${order.time || "Jam N/A"}\n🚀 Layanan: ${order.item}\n📍 Dari: ${order.origin}\n🏁 Ke: ${order.destination}\n💳 Bayar: ${order.paymentMethod}\n💰 *TOTAL: Rp ${parseInt(order.price).toLocaleString("id-ID")}*`;
  if (navigator.share)
    navigator.share({ title: "Struk dieHantar", text: text });
  else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

// --- FUNGSI PT CARDS ---
function selectSultanPT(name, index) {
  selectedPTValue = name;
  document.getElementById("pg-pt-custom").value = "";
  document.querySelectorAll(".pt-card").forEach((c) => {
    c.classList.remove("active");
    c.querySelector(".fa-check-circle").classList.add("opacity-0");
  });
  const target = document.getElementById(`pt-card-${index}`);
  target.classList.add("active");
  target.querySelector(".fa-check-circle").classList.remove("opacity-0");
}
function clearPTSelection() {
  selectedPTValue = "";
  document.querySelectorAll(".pt-card").forEach((c) => {
    c.classList.remove("active");
    c.querySelector(".fa-check-circle").classList.add("opacity-0");
  });
}
function closeReceipt() {
  const root = document.getElementById("receipt-root");
  if (root) root.remove();
}
function closeBooking() {
  document.getElementById("modal-booking").classList.add("hidden");
}
function startBooking(l, i) {
  activeLayanan = l;
  document.getElementById("input-origin").value = "";
  document.getElementById("input-destination").value = "";
  tempOrderData = { type: "Standard", price: 15000, payment: null };
  AppRenderer.renderBookingOptions();
  document.getElementById("modal-booking").classList.remove("hidden");
}
function setSultanClass(t, p) {
  tempOrderData.type = t;
  tempOrderData.price = p;
  document.querySelectorAll(".class-btn").forEach((b) => {
    b.classList.remove("border-orange-500", "bg-orange-50");
    b.classList.add("bg-gray-50", "border-transparent");
  });
  const tar = t === "Standard" ? "class-standard" : "class-sultan";
  document
    .getElementById(tar)
    .classList.add("border-orange-500", "bg-orange-50");
}

// --- PROMO & CHAT ---
AppRenderer.renderPromos = function () {
  const container = document.getElementById("promo-list");
  if (!container) return;
  const promos = [
    {
      title: "DISKON GAJIAN",
      desc: "Potongan 50% via diePotongGajian",
      code: "GAJIAN50",
    },
    { title: "SULTAN BARU", desc: "Saldo Awal Rp 100.000", code: "HELLO313" },
  ];
  container.innerHTML = promos
    .map(
      (p) =>
        `<div class="bg-zinc-900 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden"><h4 class="text-orange-500 font-black italic text-sm mb-1">${p.title}</h4><p class="text-white text-[9px] font-bold uppercase opacity-70">${p.desc}</p><div class="mt-4 bg-white/10 px-3 py-1 rounded-lg text-white text-[8px] font-black">${p.code}</div></div>`,
    )
    .join("");
};

async function sendSultanChat() {
  const input = document.getElementById("chat-input-user");
  const text = input.value.trim();
  if (!text) return;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "Sultan", text: text }),
    });
    if (res.ok) {
      input.value = "";
      syncAll();
    }
  } catch (e) {}
}

// --- FUNGSI AKSES DOMPET ---
function openWalletAction(action) {
  if (action === "topup") {
    alert("Beb, silakan transfer ke Virtual Account Sultan: 8877085123456");
  } else if (action === "transfer") {
    alert(
      "Fitur Transfer ke Seluruh Bank Indonesia segera hadir di portal Sultan!",
    );
  } else if (action === "qris") {
    alert("Buka kamera untuk Scan QRIS... (Simulasi)");
  }
}

const dieHantarRefresh = {
  init(id, cb, color = "#ea580c") {
    const c = document.getElementById(id);
    if (!c) return;
    const ind = document.createElement("div");
    ind.id = "ptr-ind";
    ind.className =
      "flex justify-center items-center overflow-hidden transition-all duration-300 w-full";
    ind.style.height = "0px";
    ind.innerHTML = `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg" style="color: ${color}"><i class="fas fa-rocket text-sm" id="ptr-icon"></i></div>`;
    c.prepend(ind);
    let sY = 0,
      pull = false;
    c.addEventListener(
      "touchstart",
      (e) => {
        if (c.scrollTop === 0) {
          sY = e.touches[0].pageY;
          pull = true;
        }
      },
      { passive: true },
    );
    c.addEventListener(
      "touchmove",
      (e) => {
        if (!pull) return;
        const d = e.touches[0].pageY - sY;
        if (d > 0 && d < 100) {
          ind.style.height = d + "px";
          document.getElementById("ptr-icon").style.transform =
            `rotate(${d * 4}deg)`;
        }
      },
      { passive: true },
    );
    c.addEventListener("touchend", async () => {
      if (!pull) return;
      pull = false;
      if (parseInt(ind.style.height) > 60) {
        ind.style.height = "60px";
        document.getElementById("ptr-icon").classList.add("fa-spin");
        if (cb) await cb();
        setTimeout(() => {
          ind.style.height = "0px";
          document.getElementById("ptr-icon").classList.remove("fa-spin");
        }, 1000);
      } else ind.style.height = "0px";
    });
  },
};

window.onload = () => {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
    return;
  }
  AppRenderer.init(window.location.port === "4000");
  syncAll();
  setInterval(syncAll, 2000);
  switchPage("home");
  dieHantarRefresh.init(
    "main-scroll-container",
    async () => {
      await syncAll();
    },
    window.location.port === "4000" ? "#2563eb" : "#ea580c",
  );
};
