# Kasir Freand

Aplikasi kasir mobile-first berbasis Next.js 14 dengan desain dark glassmorphism.

## Fitur
- Multi-kasir dengan PIN login & role (owner / kasir)
- Manajemen produk: stok, varian, bundle, harga member, PPN per produk
- Keranjang dengan hold transaction, diskon global/per-item, catatan
- Checkout: tunai / QRIS / transfer, redeem poin loyalty
- Struk digital (WhatsApp share & print)
- Laporan: omzet, transaksi, produk terlaris, breakdown pembayaran, export CSV
- Manajemen pelanggan + program loyalty (poin)
- Shift kasir dengan kas awal & rekap omzet
- Backup & restore data (JSON)
- Notifikasi stok rendah

## Tech Stack
- Next.js 14 (App Router)
- Zustand (state + localStorage persist)
- Tailwind CSS v3
- Recharts, Sonner, nanoid

## Instalasi
```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Default Login
| Nama  | Role  | PIN  |
|-------|-------|------|
| Admin | owner | 1234 |
| Budi  | kasir | 5678 |
| Sari  | kasir | 9012 |

## Struktur Folder
```
app/           → halaman (kasir, produk, pelanggan, laporan, pengaturan)
components/    → UI components per fitur
lib/
  store/       → Zustand stores (auth, cart, product, customer, tx, setting, shift)
  types.ts     → TypeScript interfaces
  utils.ts     → helper functions
  constants.ts → seed data & config
```
