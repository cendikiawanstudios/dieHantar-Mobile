/**
 * app-core.js - THE SULTAN SYSTEM v5.6
 * Pusat Kendali Terpadu: UI Components, Logic, Sync, & Tracking
 * Developer: Studio Indragiri
 */

// ==========================================
// 1. DATA MASTER EKOSISTEM
// ==========================================
const SULTAN_SERVICES = {
    trusted: [
        { id: 'dieMOTOR', icon: 'fa-motorcycle', color: 'text-orange-600', bg: 'bg-orange-100', label: 'MOTOR' },
        { id: 'dieMOBIL', icon: 'fa-car', color: 'text-blue-600', bg: 'bg-blue-100', label: 'MOBIL' },
        { id: 'dieRODA-TIGA', icon: 'fa-truck-pickup', color: 'text-green-600', bg: 'bg-green-100', label: 'RODA-3' },
        { id: 'dieMAKAN', icon: 'fa-utensils', color: 'text-red-600', bg: 'bg-red-100', label: 'MAKAN' },
        { id: 'dieKIRIM', icon: 'fa-box', color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'KIRIM' },
        { id: 'dieBELANJA', icon: 'fa-shopping-bag', color: 'text-purple-600', bg: 'bg-purple-100', label: 'BELANJA' },
        { id: 'dieWASH', icon: 'fa-shirt', color: 'text-sky-600', bg: 'bg-white', label: 'WASH' }
    ],
    makan: [
        { id: 'dieMAKAN', icon: 'fa-pizza-slice', color: 'text-red-500', bg: 'bg-red-50', label: 'MAKAN' },
        { id: 'dieBELANJA', icon: 'fa-cart-plus', color: 'text-green-500', bg: 'bg-green-50', label: 'BELANJA' },
        { id: 'diePASAR', icon: 'fa-store', color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'diePASAR' }
    ],
    transport: [
        { id: 'dieHANTAR MOTOR', icon: 'fa-motorcycle', label: 'HANTAR MOTOR' },
        { id: 'dieHANTAR MOBIL', icon: 'fa-car-side', label: 'HANTAR MOBIL' },
        { id: 'diePENGIRIMAN', icon: 'fa-box-open', label: 'KIRIM BARANG' }
    ]
};

// Global State
let activeLayanan = "", progressValue = 0, currentRating = 0, isDriverRole = false;

// ==========================================
// 2. UI LIBRARY (Pabrik Komponen)
// ==========================================
const dieHantarUI = {
    renderUserStats(containerId, stats) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `
            <div class="grid grid-cols-3 gap-3 mb-6 fade-in">
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center active:scale-95 transition-all"><p class="text-orange-600 font-black text-sm">${stats.trips || 0}</p><p class="text-[6px] text-gray-400 font-black uppercase">Trips</p></div>
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center active:scale-95 transition-all"><p class="text-zinc-900 font-black text-sm">${stats.points || 0}</p><p class="text-[6px] text-gray-400 font-black uppercase">Points</p></div>
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center active:scale-95 transition-all"><p class="text-zinc-900 font-black text-sm">1Th</p><p class="text-[6px] text-gray-400 font-black uppercase">Member</p></div>
            </div>`;
    },

    renderLiveMap(containerId, progress, serviceName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        let icon = 'fa-motorcycle';
        if (serviceName.includes('MOBIL')) icon = 'fa-car';
        if (serviceName.includes('MAKAN')) icon = 'fa-utensils';

        container.innerHTML = `
            <div class="bg-zinc-100 rounded-[2.5rem] h-52 w-full relative overflow-hidden shadow-inner border border-gray-200">
                <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
                <div class="absolute top-1/2 left-10 right-10 h-1.5 bg-gray-200 rounded-full -translate-y-1/2"></div>
                <div class="absolute top-1/2 left-10 h-1.5 bg-orange-500 rounded-full -translate-y-1/2 transition-all duration-1000" style="width: ${progress}%"></div>
                <div class="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center">
                    <div class="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-zinc-900 border-4 border-orange-500 animate-bounce"><i class="fas fa-street-view"></i></div>
                </div>
                <div class="absolute top-1/2 -translate-y-1/2 transition-all duration-1000" style="left: calc(${progress}% + 15px)">
                    <div class="w-12 h-12 bg-zinc-900 rounded-[1.2rem] shadow-2xl flex items-center justify-center text-orange-500 border-2 border-white rotate-[-5deg]"><i class="fas ${icon} text-lg"></i></div>
                </div>
            </div>`;
    },

    renderAutoTopupCard(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `
            <div class="bg-white p-6 rounded-[2.5rem] border border-orange-100 shadow-sm mb-6 fade-in">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><i class="fas fa-robot text-sm"></i></div>
                        <div><h4 class="text-xs font-black text-zinc-800 uppercase">Smart Auto Top-Up</h4><p class="text-[7px] font-bold text-gray-400 uppercase">Status: ${config.active ? 'Aktif' : 'Off'}</p></div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" ${config.active ? 'checked' : ''} onchange="toggleAutoTopup(this.checked)">
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-3 rounded-2xl"><p class="text-[6px] font-black text-gray-400 uppercase mb-1">Threshold</p><p class="text-[10px] font-black">Rp ${config.threshold.toLocaleString()}</p></div>
                    <div class="bg-gray-50 p-3 rounded-2xl"><p class="text-[6px] font-black text-gray-400 uppercase mb-1">Top-Up</p><p class="text-[10px] font-black text-orange-600">Rp ${config.amount.toLocaleString()}</p></div>
                </div>
            </div>`;
    },

    renderReviewModal(driverName) {
        if(document.getElementById('modal-review')) return;
        const modal = document.createElement('div');
        modal.id = 'modal-review';
        modal.className = 'fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-8 backdrop-blur-sm fade-in';
        modal.innerHTML = `
            <div class="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center animate-slide-up shadow-2xl">
                <div class="w-20 h-20 bg-orange-100 rounded-3xl mx-auto mb-6 flex items-center justify-center text-orange-600"><i class="fas fa-medal text-3xl"></i></div>
                <h3 class="text-xl font-black italic uppercase mb-2">Trip Selesai!</h3>
                <p class="text-[9px] font-bold text-gray-400 mb-8 uppercase tracking-widest">Beri bintang untuk ${driverName}</p>
                <div class="flex justify-center gap-3 mb-8">
                    ${[1, 2, 3, 4, 5].map(i => `<button onclick="setSultanRating(${i})" id="star-${i}" class="text-2xl text-gray-200 transition-all"><i class="fas fa-star"></i></button>`).join('')}
                </div>
                <textarea id="review-comment" placeholder="Kesan Sultan..." class="w-full p-4 bg-gray-50 rounded-2xl text-[10px] border-none mb-8 h-20 outline-none resize-none shadow-inner"></textarea>
                <button onclick="submitSultanReview()" class="w-full py-4 bg-orange-600 text-white rounded-2xl font-black italic uppercase shadow-lg active:scale-95 transition-all">Kirim Feedback</button>
            </div>`;
        document.body.appendChild(modal);
    },

    renderHistory(containerId, orders) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = orders.slice().reverse().map(o => `
            <div class="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex justify-between items-center mb-3 shadow-sm fade-in">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 ${o.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} rounded-2xl flex items-center justify-center text-xs shadow-inner"><i class="fas ${o.status === 'COMPLETED' ? 'fa-check-double' : 'fa-clock'}"></i></div>
                    <div><p class="text-[7px] font-black uppercase ${o.status === 'COMPLETED' ? 'text-green-500' : 'text-orange-500'} mb-1">${o.status}</p><h4 class="font-black text-xs text-zinc-800 leading-tight">${o.item}</h4></div>
                </div>
                <div class="text-right"><p class="font-black text-xs italic">Rp ${parseInt(o.price).toLocaleString('id-ID')}</p></div>
            </div>`).join('') || `<div class="text-center py-20 text-gray-300 font-black text-[10px] uppercase italic">Belum Ada Aktivitas</div>`;
    }
};

// ==========================================
// 3. LOGIKA RENDER HALAMAN (The Sultan Brain)
// ==========================================
const AppRenderer = {
    init(isDriver = false) {
        this.isDriver = isDriver; isDriverRole = isDriver;
        this.renderHome(); this.renderNav(); this.renderBookingOptions();
    },

    renderHome() {
        const container = document.getElementById('page-home');
        if (!container) return;
        if (this.isDriver) {
            container.innerHTML = `
                <h2 class="text-xl font-black italic text-zinc-900 uppercase mb-4">Dompet Mitra</h2>
                <div id="driver-wallet-container"></div>
                <div class="mt-8"><h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-2 leading-none mb-4">Riwayat Trip</h3><div id="history-list"></div></div>`;
            dieHantarUI.renderDriverWallet('driver-wallet-container', { balance: 850000 });
        } else {
            const gridHtml = SULTAN_SERVICES.trusted.map(s => `
                <button onclick="startBooking('${s.id}', '${s.icon}')" class="flex flex-col items-center gap-2 active:scale-90 transition-all">
                    <div class="w-14 h-14 bg-white ${s.color} rounded-[1.8rem] flex items-center justify-center text-xl shadow-sm border border-gray-50"><i class="fas ${s.icon}"></i></div>
                    <p class="text-[9px] font-black uppercase text-gray-500 mt-1">${s.id.replace('die','')}</p>
                </button>`).join('');
            container.innerHTML = `<section class="space-y-6 fade-in"><h3 class="text-[10px] font-black text-zinc-400 uppercase px-2 leading-none">Layanan Super Sultan</h3><div class="grid grid-cols-4 gap-y-8">${gridHtml}</div></section>`;
        }
    },

    renderNav() {
        const nav = document.getElementById('main-nav'); if (!nav) return;
        const items = this.isDriver ? [{ id: 'home', icon: 'fa-radar', label: 'Order' }, { id: 'profile', icon: 'fa-user-circle', label: 'Profil' }] : [{ id: 'home', icon: 'fa-home', label: 'Beranda' }, { id: 'promo', icon: 'fa-percentage', label: 'Promo' }, { id: 'history', icon: 'fa-receipt', label: 'Riwayat' }, { id: 'chat', icon: 'fa-comment-dots', label: 'Pesan' }, { id: 'profile', icon: 'fa-crown', label: 'Sultan' }];
        nav.innerHTML = items.map(i => `<button onclick="switchPage('${i.id}')" id="nav-${i.id}" class="flex flex-col items-center gap-1 text-gray-300 transition-all active:scale-95"><i class="fas ${i.icon} text-lg"></i><span class="text-[7px] font-black uppercase">${i.label}</span></button>`).join('');
    },

    renderBookingOptions() {
        const container = document.getElementById('booking-options'); if (!container) return;
        container.innerHTML = `
            <button onclick="executeOrder('Standard', 15000)" class="w-full p-6 bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus:border-orange-500 flex justify-between items-center group active:scale-95 transition-all">
                <div class="flex items-center gap-4"><div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm"><i class="fas fa-motorcycle text-lg"></i></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase leading-none">Standard</h4><p class="text-[8px] text-gray-400 font-bold uppercase leading-none mt-1">Ekonomis & Cepat</p></div></div>
                <p class="text-sm font-black text-zinc-900 italic">Rp 15k</p>
            </button>
            <button onclick="executeOrder('Sultan', 25000)" class="w-full p-6 bg-gray-50 rounded-[2.5rem] border-2 border-transparent focus:border-orange-500 flex justify-between items-center group active:scale-95 transition-all">
                <div class="flex items-center gap-4"><div class="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm"><i class="fas fa-crown text-lg"></i></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase leading-none">Sultan Class</h4><p class="text-[8px] text-gray-400 font-bold uppercase leading-none mt-1">VIP Luxury Service</p></div></div>
                <p class="text-sm font-black text-zinc-900 italic">Rp 25k</p>
            </button>`;
    },

    renderTrackingCard(order, driver) {
        const slot = document.getElementById('live-tracking-slot');
        if (!slot) return;
        slot.innerHTML = `
            <div class="bg-white rounded-[2.5rem] p-5 shadow-xl border border-orange-100 mb-6 fade-in">
                <div class="flex justify-between items-center mb-4">
                    <div><h3 class="text-xs font-black italic text-zinc-900 uppercase leading-none">${order.item}</h3><p class="text-[7px] font-black text-orange-600 uppercase mt-1 animate-pulse">Mitra OTW Lokasi</p></div>
                    <div class="text-right"><p id="eta-display" class="text-sm font-black italic text-zinc-900 leading-none">5 MIN</p><p class="text-[6px] font-bold text-gray-400 uppercase">Estimasi</p></div>
                </div>
                <div id="map-slot" class="mb-4"></div>
                <div class="flex justify-between items-center bg-zinc-50 p-3 rounded-2xl border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden"><img src="https://ui-avatars.com/api/?name=${driver.name}&background=18181b&color=f97316" class="w-full h-full"></div>
                        <p class="text-[9px] font-black uppercase text-zinc-800">${driver.name}</p>
                    </div>
                    <button onclick="switchPage('chat')" class="text-orange-600 px-3 active:scale-90"><i class="fas fa-comment-dots"></i></button>
                </div>
            </div>`;
    }
};

// ==========================================
// 4. CORE ENGINE (SYNC, NAV, & ACTIONS)
// ==========================================
async function syncAll() {
    try {
        const res = await fetch('/api/data'); 
        const d = await res.json();
        const user = d.user;
        const activeOrder = d.orders.find(o => o.status === 'PENDING');
        const trackingSlot = document.getElementById('live-tracking-slot');
        const homeContainer = document.getElementById('page-home');

        // 1. INFINITE WEALTH MANAGER (Auto Top-Up)
        if (user.auto_topup && user.auto_topup.active && user.balance < user.auto_topup.threshold) {
            await fetch('/api/topup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: user.auto_topup.amount }) });
            alert(`⚡ AUTO TOP-UP SULTAN!\nSaldo Anda telah diisi otomatis sebesar Rp ${user.auto_topup.amount.toLocaleString()}`);
            return syncAll(); 
        }

        // 2. IDENTITY SYNC
        if(document.getElementById('balance')) document.getElementById('balance').innerText = 'Rp ' + user.balance.toLocaleString('id-ID');
        if(document.getElementById('user-display-name')) document.getElementById('user-display-name').innerText = user.name;
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ea580c&color=fff&bold=true`;
        if(document.getElementById('user-avatar')) document.getElementById('user-avatar').src = avatarUrl;
        if(document.getElementById('prof-avatar-large')) document.getElementById('prof-avatar-large').src = avatarUrl;

        // 3. UI SYNC (Menu Icons)
        if (homeContainer && homeContainer.innerHTML.trim() === "") {
            AppRenderer.renderHome(); 
        }

        // 4. STACKING TRACKING SYSTEM
        if (!isDriverRole && trackingSlot) {
            if (activeOrder) {
                if (!document.getElementById('map-slot')) {
                    AppRenderer.renderTrackingCard(activeOrder, d.driver);
                }
                if (progressValue < 95) {
                    progressValue += 2;
                    const eta = Math.max(1, 5 - Math.floor(progressValue/20));
                    if(document.getElementById('eta-display')) document.getElementById('eta-display').innerText = `${eta} MIN`;
                    dieHantarUI.renderLiveMap('map-slot', progressValue, activeOrder.item);
                } else {
                    completeOrderSultan(activeOrder.id);
                }
            } else {
                trackingSlot.innerHTML = "";
                progressValue = 0;
            }
        }

        // 5. PROFILE & HISTORY REFRESH
        const profilePage = document.getElementById('page-profile');
        if (profilePage && !profilePage.classList.contains('hidden')) {
            dieHantarUI.renderUserStats('user-stats-container', { trips: d.orders.length, points: user.points });
            dieHantarUI.renderAutoTopupCard('auto-topup-slot', user.auto_topup);
        }
        dieHantarUI.renderHistory('history-list', d.orders);

    } catch (e) { console.warn("Sync Pulse..."); }
}

async function executeOrder(tipe, harga) {
    try {
        const res = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item: `${activeLayanan} [${tipe}]`, price: harga }) });
        if(res.ok) {
            document.getElementById('modal-booking').classList.add('hidden');
            switchPage('home'); syncAll();
        }
    } catch(e) { alert("Sistem Sibuk!"); }
}

async function completeOrderSultan(orderId) {
    try {
        const res = await fetch('/api/complete-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId }) });
        if (res.ok) { 
            progressValue = 0; 
            const d = await (await fetch('/api/data')).json(); 
            dieHantarUI.renderReviewModal(d.driver.name); 
        }
    } catch (e) { console.log("Finish Error"); }
}

function switchPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById('page-' + pageId);
    if(target) target.classList.remove('hidden');
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active-tab'));
    const navId = ['bills', 'finance-hub', 'social-hub', 'diepay-history', 'all-services'].includes(pageId) ? 'history' : pageId;
    const navBtn = document.getElementById('nav-' + navId);
    if(navBtn) navBtn.classList.add('active-tab');
    syncAll();
}

// Helpers
function setSultanRating(n) {
    currentRating = n;
    for(let i=1; i<=5; i++) {
        const star = document.getElementById(`star-${i}`);
        star.className = (i <= n) ? 'text-2xl text-yellow-400 scale-110' : 'text-2xl text-gray-200 scale-100';
    }
}

async function submitSultanReview() {
    if(currentRating === 0) return alert("Bintang?");
    await fetch('/api/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating: currentRating }) });
    document.getElementById('modal-review').remove();
    syncAll();
}

function startBooking(layanan, icon) {
    activeLayanan = layanan;
    document.getElementById('booking-title').innerText = `Pesan ${layanan}`;
    document.getElementById('modal-booking').classList.remove('hidden');
}

async function toggleAutoTopup(isActive) {
    await fetch('/api/user/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: isActive }) });
    syncAll();
}

function closeBooking() { document.getElementById('modal-booking').classList.add('hidden'); }
function logout() { localStorage.clear(); window.location.href = 'login.html'; }

// 5. INTERACTION ENGINE (PULL TO REFRESH)
const dieHantarRefresh = {
    init(containerId, callback, themeColor = "#ea580c") {
        const container = document.getElementById(containerId);
        if (!container) return;
        const port = window.location.port;
        const refreshIcon = port === '4000' ? 'fa-radar' : 'fa-rocket';
        const indicator = document.createElement('div');
        indicator.id = 'ptr-indicator';
        indicator.className = 'flex justify-center items-center overflow-hidden transition-all duration-300 w-full';
        indicator.style.height = '0px';
        indicator.innerHTML = `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg" style="color: ${themeColor}"><i class="fas ${refreshIcon} text-sm" id="ptr-icon"></i></div>`;
        container.prepend(indicator);
        let startY = 0; let pulling = false;
        container.addEventListener('touchstart', (e) => { if (container.scrollTop === 0) { startY = e.touches[0].pageY; pulling = true; } }, { passive: true });
        container.addEventListener('touchmove', (e) => {
            if (!pulling) return;
            const diff = e.touches[0].pageY - startY;
            if (diff > 0 && diff < 100) { indicator.style.height = diff + 'px'; document.getElementById('ptr-icon').style.transform = `rotate(${diff * 4}deg)`; }
        }, { passive: true });
        container.addEventListener('touchend', async () => {
            if (!pulling) return; pulling = false;
            if (parseInt(indicator.style.height) > 60) {
                indicator.style.height = '60px'; document.getElementById('ptr-icon').classList.add('fa-spin');
                if (callback) await callback();
                setTimeout(() => { indicator.style.height = '0px'; document.getElementById('ptr-icon').classList.remove('fa-spin'); }, 1000);
            } else { indicator.style.height = '0px'; }
        });
    }
};

// INITIALIZE SYSTEM
window.onload = () => {
    const isDriver = window.location.port === "4000";
    AppRenderer.init(isDriver);
    syncAll();
    switchPage('home');
    setInterval(syncAll, 2000); // Pulse Every 2s
    dieHantarRefresh.init('main-scroll-container', async () => { await syncAll(); }, isDriver ? '#2563eb' : '#ea580c');
};