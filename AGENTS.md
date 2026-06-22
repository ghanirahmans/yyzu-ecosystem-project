@AGENTS.md
# YYZU Admin System — Agent Guidelines

## Project Overview
YYZU Admin System adalah internal web app untuk manajemen komunitas YYZU.
Stack: Next.js 16 App Router · Prisma · PostgreSQL · Tailwind CSS · Vercel

---

## Folder Structure (Feature-based)

src/
  app/                  → Routing only (page.tsx, layout.tsx, loading.tsx)
  features/             → Semua domain logic diletakkan di sini
    [feature-name]/
      components/       → UI komponen khusus fitur ini
      actions.ts        → Server Actions (entry point dari UI)
      service.ts        → Business logic murni
      repository.ts     → Semua query Prisma
      schema.ts         → Zod validation schema
      types.ts          → TypeScript types/interfaces
  components/           → Shared/reusable UI komponen
  lib/                  → Utilities, helpers, constants
  db/                   → Prisma client instance (singleton)

---

## Core Rules

### Architecture
- DILARANG taruh business logic di `app/` layer (page, layout, route handler)
- DILARANG query Prisma langsung dari `actions.ts` — harus lewat `repository.ts`
- DILARANG import antar-feature secara langsung — ekstrak ke `lib/` atau `components/` jika perlu shared
- Setiap fitur harus self-contained dalam foldernya sendiri

### Data Flow
UI (page.tsx) → actions.ts → service.ts → repository.ts → Prisma → DB

Tidak boleh skip layer. Tidak boleh balik arah.

### Validation
- Semua input divalidasi di `schema.ts` menggunakan Zod
- Validasi dilakukan di `actions.ts` sebelum masuk ke `service.ts`
- Jangan duplikasi schema di banyak tempat

### Error Handling
- Gunakan return type eksplisit: `{ success: true, data } | { success: false, error: string }`
- Jangan biarkan error bubble mentah ke UI
- Server Actions wajib handle error secara eksplisit

### TypeScript
- Tidak boleh pakai `any`
- Definisikan semua types di `types.ts` per fitur
- Gunakan Zod `.infer` untuk derive type dari schema

### Naming Convention
- File: `kebab-case.ts`
- Komponen: `PascalCase.tsx`
- Functions/variables: `camelCase`
- DB/Prisma models: `PascalCase` (ikut Prisma convention)
- Server Actions: prefix `action` → `actionCreateProgram`
- Service functions: prefix verb → `createProgram`, `getPrograms`
- Repository functions: prefix `db` → `dbFindPrograms`, `dbCreateProgram`

### Styling
- Gunakan Tailwind utility classes
- Hindari inline style kecuali dynamic value yang tidak bisa di-handle Tailwind
- Komponen shared wajib ada di `components/`, bukan disalin-tempel

---

## What NOT to Do
- Jangan buat file di luar struktur yang sudah ditentukan tanpa alasan jelas
- Jangan hardcode nilai konfigurasi — taruh di `lib/config.ts` atau env
- Jangan pakai `useEffect` untuk data fetching — gunakan Server Components
- Jangan bypass auth middleware untuk shortcut
- Jangan buat abstraksi prematur sebelum ada kebutuhan konkret

---

## Before Writing Code
1. Identifikasi fitur mana yang terpengaruh
2. Cek apakah ada repository/service yang bisa di-reuse
3. Tulis schema Zod dulu sebelum implementasi
4. Ikuti data flow: actions → service → repository