# Spesifikasi API - YYZU Admin System

Dokumen ini berisi daftar dan struktur API yang tersedia pada YYZU Admin System. Sistem ini menggunakan arsitektur **Next.js App Router** yang mengandalkan **Route Handlers** (REST API) untuk kebutuhan integrasi client-side standard dan **Server Actions** (RPC-style) sebagai entry point utama interaksi UI.

---

## 1. Arsitektur Data & Validasi

Mengikuti aturan di [AGENTS.md](file:///home/ghaniyrahmans/Projects/yyzu-ecosystem-project/AGENTS.md):
- **Validasi**: Setiap input data diverifikasi menggunakan **Zod Schema** di level Server Action sebelum diteruskan ke service layer.
- **Error Handling**: Semua action mengembalikan tipe data konsisten:
  ```typescript
  { success: true; data?: any } | { success: false; error: string }
  ```
- **Keamanan**: Operasi sensitif dilindungi dengan verifikasi sesi aktif (`validateActiveUser()`) atau pemeriksaan live database untuk admin (`requireAdmin()`).

---

## 2. Route Handlers (REST Endpoints)

Endpoint REST standar yang didefinisikan dalam folder `src/app/api/`.

### Auth & Session

#### GET `/api/session/status`
* **File Source**: [route.ts](file:///home/ghaniyrahmans/Projects/yyzu-ecosystem-project/src/app/api/session/status/route.ts)
* **Deskripsi**: Memeriksa status sesi otentikasi pengguna saat ini.
* **Autentikasi**: Tidak wajib (akan mengembalikan status tidak aktif jika belum login).
* **Response**:
  * **200 OK (Authenticated)**:
    ```json
    {
      "authenticated": true,
      "user": {
        "userId": "string",
        "username": "string",
        "role": "SYSTEM_ADMIN | MEMBER | ...",
        "status": "ACTIVE | PENDING_APPROVAL | ...",
        "fullName": "string"
      }
    }
    ```
  * **401 Unauthorized**:
    ```json
    {
      "authenticated": false
    }
    ```

#### POST `/api/auth/logout`
* **File Source**: [route.ts](file:///home/ghaniyrahmans/Projects/yyzu-ecosystem-project/src/app/api/auth/logout/route.ts)
* **Deskripsi**: Menghapus session cookie aktif dan me-log out pengguna.
* **Autentikasi**: Wajib.
* **Response**:
  * **200 OK**:
    ```json
    {
      "success": true
    }
    ```

---

## 3. Server Actions (RPC APIs)

Server Actions didefinisikan di dalam folder domain fitur masing-masing di bawah `src/features/[feature-name]/actions.ts` atau secara global di `src/app/actions/`.

### 3.1. Authentication (`src/features/auth/actions.ts`)
Mengatur pendaftaran, masuk, dan keluar dari aplikasi. Memiliki pengaman bawaan *Rate Limiting* (maksimal 5 request per menit per IP).

* **`actionLogin(formData: LoginInput)`**
  * **Deskripsi**: Autentikasi pengguna berdasarkan username/password, membuat session cookie, dan mencatat audit log.
  * **Validation Schema**: `loginSchema`
  * **Error Codes**: `TOO_MANY_REQUESTS`, `INVALID_INPUTS`, `INVALID_CREDENTIALS`

* **`actionRegister(formData: RegisterInput)`**
  * **Deskripsi**: Mendaftarkan akun pengguna baru ke sistem (status awal `PENDING_APPROVAL`).
  * **Validation Schema**: `registerSchema`
  * **Error Codes**: `Too many requests. Please wait a minute and try again.`, `Validation failed.`

* **`actionLogout()`**
  * **Deskripsi**: Menghapus cookie sesi pengguna aktif.

---

### 3.2. Team Management (`src/features/team/actions.ts`)
Mengatur pembuatan tim, modifikasi data, kelola anggota, pengumpulan submission, serta link eksternal tim. Seluruh aksi membutuhkan user dengan status `ACTIVE`.

#### Aksi Undangan & Request Gabung
* **`acceptInvitationAction(invitationId: string)`**
  * **Deskripsi**: Menerima undangan untuk masuk ke dalam tim.

* **`rejectInvitationAction(invitationId: string)`**
  * **Deskripsi**: Menolak undangan masuk tim.

* **`sendJoinRequestAction(teamId: string, message?: string)`**
  * **Deskripsi**: Mengirim permohonan bergabung ke tim tertentu disertai pesan opsional.

* **`cancelJoinRequestAction(requestId: string)`**
  * **Deskripsi**: Membatalkan permohonan gabung yang sedang pending.

* **`approveJoinRequestAction(requestId: string)`**
  * **Deskripsi**: Menyetujui permohonan gabung pengguna (hanya bisa dipanggil oleh `TEAM_LEADER`).

* **`rejectJoinRequestAction(requestId: string)`**
  * **Deskripsi**: Menolak permohonan gabung pengguna (hanya bisa dipanggil oleh `TEAM_LEADER`).

#### CRUD & Pengaturan Tim
* **`createTeamAction(data: { name: string; description?: string })`**
  * **Deskripsi**: Membuat tim baru. Pengguna yang membuat otomatis menjadi `TEAM_LEADER`.
  * **Validation Schema**: `teamSchema`

* **`updateTeamInfoAction(data: { name: string; description?: string })`**
  * **Deskripsi**: Memperbarui informasi nama/deskripsi tim. Hanya untuk `TEAM_LEADER`.
  * **Validation Schema**: `teamSchema`

* **`deleteTeamAction(confirmName: string)`**
  * **Deskripsi**: Menghapus tim secara permanen (memerlukan konfirmasi nama tim yang cocok). Hanya untuk `TEAM_LEADER`.

#### Manajemen Anggota
* **`inviteMemberAction(username: string)`**
  * **Deskripsi**: Mengundang pengguna lain bergabung ke tim berdasarkan username-nya.

* **`removeMemberAction(userIdToDelete: string)`**
  * **Deskripsi**: Mengeluarkan anggota dari tim (hanya untuk `TEAM_LEADER`).

* **`leaveTeamAction()`**
  * **Deskripsi**: Keluar dari tim aktif secara mandiri (tidak berlaku untuk leader kecuali kepemimpinan dipindahkan terlebih dahulu).

* **`transferLeadershipAction(newLeaderUserId: string)`**
  * **Deskripsi**: Mentransfer jabatan `TEAM_LEADER` kepada anggota tim lain.

#### Link Bermanfaat & Tugas (Submissions)
* **`addUsefulLinkAction(data: UsefulLinkInput)`**
  * **Deskripsi**: Menambahkan link referensi/kebutuhan tim.
  * **Validation Schema**: `usefulLinkSchema`

* **`deleteUsefulLinkAction(linkId: string)`**
  * **Deskripsi**: Menghapus link referensi yang sudah ada.

* **`updateSubmissionAction(data: { submissionLink: string })`**
  * **Deskripsi**: Mengirimkan atau memperbarui link pengumpulan project/tugas tim.
  * **Validation Schema**: `submissionSchema`

* **`reviewSubmissionAction(teamId: string, status: "APPROVED" | "REVISION", feedback?: string)`**
  * **Deskripsi**: Memberikan review, status persetujuan, atau feedback pada submission tim (biasanya dipanggil oleh admin/evaluator).
  * **Validation Schema**: `reviewSubmissionSchema`

---

### 3.3. Program Management (`src/features/program/actions.ts`)
Mengatur manajemen program atau kegiatan ekosistem YYZU.

* **`actionCreateProgram(data: ProgramInput)`**
  * **Deskripsi**: Membuat program baru.
  * **Validation Schema**: `programSchema`

* **`actionUpdateProgram(programId: string, data: ProgramInput)`**
  * **Deskripsi**: Mengedit info program yang ada.
  * **Validation Schema**: `programSchema`

* **`actionUpdateProgramStatus(programId: string, status: ProgramStatus)`**
  * **Deskripsi**: Memperbarui status program (`UPCOMING`, `ACTIVE`, `COMPLETED`, `ARCHIVED`).

* **`actionApproveProgram(programId: string, approvalStatus: ProgramApprovalStatus)`**
  * **Deskripsi**: Menyetujui atau menolak permohonan program baru.

---

### 3.4. Division Management (`src/features/division/actions.ts`)
Mengelola struktur kepengurusan divisi internal YYZU.

* **`actionAddDivisionMember(divisionId: string, username: string, role: DivisionRole)`**
  * **Deskripsi**: Menambahkan pengguna ke dalam divisi dengan role tertentu (`HEAD`, `MEMBER`, dsb).
  * **Validation Schema**: `addDivisionMemberSchema`

* **`actionRemoveDivisionMember(divisionId: string, membershipId: string)`**
  * **Deskripsi**: Mengeluarkan anggota dari divisi.
  * **Validation Schema**: `removeDivisionMemberSchema`

* **`actionChangeDivisionRole(divisionId: string, membershipId: string, role: DivisionRole)`**
  * **Deskripsi**: Mengubah tingkatan peran anggota divisi.
  * **Validation Schema**: `changeDivisionRoleSchema`

---

### 3.5. Partnership Management (`src/features/partnership/actions.ts`)
Mengatur manajemen partner eksternal/kemitraan program.

* **`actionCreatePartnership(data: PartnershipInput)`**
  * **Deskripsi**: Menambahkan data kemitraan baru.
  * **Validation Schema**: `partnershipSchema`

* **`actionUpdatePartnership(partnershipId: string, data: PartnershipInput)`**
  * **Deskripsi**: Memperbarui informasi kemitraan yang tersimpan.
  * **Validation Schema**: `partnershipSchema`

---

### 3.6. Profile Management (`src/features/profile/actions.ts`)
Mengatur pembaruan data pribadi pengguna.

* **`actionUpdateProfile(data: ProfileInput)`**
  * **Deskripsi**: Memperbarui informasi profil pengguna login (`fullName`, dsb) dan memperbarui data session cookie secara dinamis.
  * **Validation Schema**: `profileSchema`

---

### 3.7. Admin Management (`src/app/actions/admin.ts`)
Fitur khusus administrator sistem. Setiap action di sini diverifikasi secara ketat melalui pemeriksaan live database (`requireAdmin()`).

* **`approveUserAction(userId: string)`**
  * **Deskripsi**: Menyetujui permohonan pendaftaran user baru (mengubah status dari `PENDING_APPROVAL` ke `ACTIVE`).

* **`rejectUserAction(userId: string)`**
  * **Deskripsi**: Menolak permohonan pendaftaran user baru (mengubah status menjadi `REJECTED`).

* **`toggleUserSuspensionAction(userId: string)`**
  * **Deskripsi**: Melakukan suspend (`SUSPENDED`) atau mengaktifkan kembali (`ACTIVE`) akun user.
  * *Catatan*: Tidak dapat men-suspend sesama admin.

* **`toggleTeamSuspensionAction(teamId: string)`**
  * **Deskripsi**: Melakukan suspend/aktifkan kembali tim. Tim yang sudah di-arsip (`ARCHIVED`) tidak dapat disuspensi.

* **`forceDeleteTeamAction(teamId: string)`**
  * **Deskripsi**: Melakukan soft-delete pada tim dengan mengubah namanya menjadi format `${team.name}_deleted_${timestamp}` agar nama tim aslinya dapat dipakai kembali di masa depan oleh tim lain.

* **`forceTransferTeamLeadershipAction(teamId: string, newLeaderUserId: string)`**
  * **Deskripsi**: Memindahkan status kepemimpinan tim (`TEAM_LEADER`) secara paksa ke anggota tim lain.
