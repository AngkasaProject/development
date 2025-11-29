// src/data/dashboard-config.js
// Ganti nilai HASH ini dengan hash SHA256 dari password Anda
// Contoh: SHA256 dari "admin123" adalah "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"

export const DASHBOARD_CONFIG = {
  USERNAME: 'admin',
  PASSWORD_SHA256: 'f4c5325e5e26e21513309d0cb371d0153fe4f8d34578bf94f0d6f8c2ccad85e1',
  SESSION_KEY: 'auth_token_secret',
  SLUG: 'dashboard'
}
