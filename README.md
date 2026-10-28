# Astra Ecosystem - Portal SSO

Portal SSO adalah landing dashboard katalog terpadu untuk ekosistem analitik geospasial Astra (VoxaGIS, Grovia, FlowGIS) dengan perlindungan otentikasi sentral Keycloak OpenID Connect (OIDC).

## Fitur Utama

1. **Seluruh Portal Dilindungi Login (Mandatory Authentication)**:
   - Pengguna tanpa sesi aktif otomatis dialihkan ke halaman login Keycloak (`signinRedirect`).
   - Menyimpan target path asal (`REDIRECT_AFTER_LOGIN`) agar setelah otentikasi langsung dikembalikan ke halaman yang dituju.
   - Dilengkapi proteksi anti-looping pada halaman callback (`/auth/callback`) dan penanganan error (`/error`).
2. **Katalog Aplikasi Berbasis Peran (Role-Based Access Tiles)**:
   - Menampilkan tile aplikasi yang relevan berdasarkan klaim `realm_access.roles` pengguna (`app-voxagis`, `app-grovia`, `app-flowgis`).
   - Role `admin` memiliki akses penuh untuk melihat seluruh katalog aplikasi.
   - Dilengkapi pesan Empty State yang jelas jika pengguna belum memiliki role aplikasi.
   - Membuka aplikasi pada tab baru (`target="_blank" rel="noopener noreferrer"`) agar Portal tetap dapat diakses sebagai hub navigasi ekosistem.
3. **Logout Terpusat & Sinkronisasi Sesi**:
   - Mendukung deteksi berakhirnya sesi Keycloak lintas tab dan lintas aplikasi secara real-time melalui `monitorSession` (OP iframe `check_session_iframe`).
   - Event listener OIDC (`addUserSignedOut`, `addSilentRenewError`, `addAccessTokenExpired`) dan pengecekan tab aktif (`visibilitychange`/`focus` throttle 15 detik).
   - Setelah sesi berakhir atau tombol logout ditekan, pengguna diarahkan ke Landing Page SSO (`VITE_LANDING_URL`).
4. **Tautan Manajemen Profil**:
   - Tautan langsung ke konsol manajemen akun Keycloak (`VITE_KEYCLOAK_ACCOUNT_URL`) untuk pembaruan profil pengguna.

> **Catatan Keamanan Penting**: Menyembunyikan kartu aplikasi pada portal ini **bukan** merupakan pengamanan tunggal. Setiap aplikasi secara mandiri memverifikasi token dan hak akses (role) masing-masing pengguna.

---

## Konfigurasi Environment Variables

Salin `.env.example` ke `.env`:

```bash
cp .env.example .env
```

| Variabel | Deskripsi | Nilai Default Lokal |
|---|---|---|
| `VITE_KEYCLOAK_AUTHORITY` | URL Realm Keycloak Issuer | `http://localhost:8080/realms/wefgis` |
| `VITE_KEYCLOAK_CLIENT_ID` | Client ID Keycloak Portal | `portal` |
| `VITE_KEYCLOAK_ACCOUNT_URL` | URL Konsol Profil Akun Keycloak | `http://localhost:8080/realms/wefgis/account` |
| `VITE_LANDING_URL` | URL Landing Page SSO (Tujuan Post-Logout) | `http://localhost:3000` |
| `VITE_APP_VOXAGIS_URL` | URL Platform VoxaGIS | `http://localhost:5175` |
| `VITE_APP_GROVIA_URL` | URL Platform Grovia (Biomass) | `http://localhost:5173` |
| `VITE_APP_FLOWGIS_URL` | URL Platform FlowGIS | `http://localhost:5174` |

---

## Konfigurasi Klien Keycloak (Client `portal`)

Daftarkan konfigurasi berikut pada client **`portal`** di realm **`astra`** pada konsol admin Keycloak:

- **Client ID**: `portal`
- **Client Protocol**: `openid-connect`
- **Access Type / Client Authentication**: `Public` (Off)
- **Standard Flow Enabled**: `ON` (Authorization Code)
- **Direct Access Grants Enabled**: `OFF`
- **PKCE Code Challenge Method**: `S256`
- **Valid redirect URIs**:
  ```text
  http://localhost:5176/auth/callback
  http://localhost:5176/*
  ```
- **Web origins**:
  ```text
  http://localhost:5176
  +
  ```
- **Valid post logout redirect URIs**:
  ```text
  http://localhost:3000
  http://localhost:3000/*
  http://localhost:5176/*
  +
  ```

---


### Konfigurasi Direct Entry (`entryPath`)

Setiap aplikasi pada `appsConfig` dapat memiliki properti opsional `entryPath`:
- Jika `entryPath` didefinisikan (contoh: `/sso/start?returnTo=%2Fdashboard`), tombol "Buka Platform" akan mengarahkan pengguna langsung ke rute `/sso/start` aplikasi tersebut. Karena pengguna telah memiliki sesi aktif di Keycloak, aplikasi target akan mengautentikasi pengguna secara instan dan meneruskannya langsung ke dashboard tanpa menampilkan landing page atau tombol login manual.
- Jika `entryPath` tidak didefinisikan (atau `null`, seperti pada FlowGIS sebelum integrasi `/sso/start`), tautan akan fallback membuka URL dasar aplikasi (`app.url`).
- Komponen `AppTile` secara aman menggabungkan `app.url` dan `app.entryPath` dengan menormalkan trailing dan leading slashes untuk mencegah URL tidak valid (misal `//sso`).

---

## Menjalankan Aplikasi

### 1. Mode Development Lokal (Vite)
```bash
npm install
npm run dev
```
Aplikasi berjalan pada: `http://localhost:5176`

### 2. Mode Docker Compose
```bash
docker compose up -d --build
```

### 3. Build Produksi
```bash
npm run build
```
