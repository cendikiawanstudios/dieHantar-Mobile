/**
 * auth.js - Sistem Keamanan Sultan
 * Developer: Studio Indragiri
 */

const SultanAuth = {
  // Cek status login saat aplikasi dibuka
  checkAccess() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      window.location.href = "login.html";
    }
  },

  // Proses keluar dari portal
  logout() {
    localStorage.clear();
    window.location.href = "login.html";
  },

  // Ambil data user yang tersimpan
  getUserData() {
    return {
      name: localStorage.getItem("userName") || "Sultan",
      avatar:
        localStorage.getItem("userAvatar") ||
        "https://ui-avatars.com/api/?name=Sultan&background=ea580c&color=fff",
    };
  },
};

// Jalankan proteksi langsung saat file diload
SultanAuth.checkAccess();
