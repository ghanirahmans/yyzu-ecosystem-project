# Phase 1: Dashboard Enhancement — Multi-Scope Links + BPH Role + Division Hub

> **Goal:** Transform dashboard YYZU dari platform yang hanya manage team menjadi **Command Center** — single source of truth untuk semua link penting organisasi, dengan role-based views yang sesuai struktur organisasi YYZU.

**Architecture:** Feature-based (sesuai AGENTS.md). Setiap perubahan mengikuti data flow: Schema → Repository → Service → Actions → UI. Tidak ada query Prisma langsung dari page layer.

**Branch:** `feature/phase1-dashboard-command-center`

---

## Task 1: Schema Migration — LinkScope Enum + BPH Role + UsefulLink Refactor

**Objective:** Ubah schema Prisma untuk support multi-scope links (ORG, DIVISION, TEAM) dan tambah BPH role.

**Files:**
- Modify: `prisma/schema.prisma`

**Changes:**

1. Add `LinkScope` enum:
```prisma
enum LinkScope {
  ORG
  DIVISION
  TEAM
}
```

2. Add `BPH` to `UserRole`:
```prisma
enum UserRole {
  MEMBER
  MENTOR
  BPH
  SYSTEM_ADMIN
}
```

3. Refactor `UsefulLink` model:
```prisma
model UsefulLink {
  id         String       @id @default(uuid())
  scope      LinkScope    @default(TEAM)
  teamId     String?
  divisionId String?
  title      String
  url        String
  category   LinkCategory
  notes      String?
  createdBy  String
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  creator    User         @relation(fields: [createdBy], references: [id])
  team       Team?        @relation(fields: [teamId], references: [id])
  division   Division?    @relation(fields: [divisionId], references: [id])

  @@index([scope])
  @@index([teamId])
  @@index([divisionId])
}
```

4. Run migration:
```bash
cd /home/ghaniyrahmans/Projects/yyzu-ecosystem-project
git checkout -b feature/phase1-dashboard-command-center
npx prisma migrate dev --name add_link_scope_and_bph_role
```
Expected: Migration creates new enum + nullable fields for teamId/divisionId. Existing data preserved.

5. Generate client:
```bash
npx prisma generate
```

**Verification:**
- `npx prisma migrate status` shows no pending migrations
- Prisma client compiles without errors
- `npx tsx -e "const { PrismaClient } = require('@prisma/client'); new PrismaClient(); console.log('OK')"` succeeds

---

## Task 2: Update Seed — Org-Wide Links + Division Links + BPH Users

**Objective:** Seed data untuk org-wide links, division-specific links, dan BPH user.

**Files:**
- Modify: `prisma/seed.ts`

**Key changes:**
1. Add BPH user (Siti Nurhaliza as BPH role instead of MEMBER)
2. Create org-wide useful links:
   - Discord server invite
   - GitHub organization
   - Notion workspace
   - Figma team
   - Google Drive shared folder
   - Website YYZU
   - Email contact
   - Instagram & LinkedIn
   - Google Meet link
3. Create division-specific links for each division
4. Use `LinkScope.ORG` for org links and `LinkScope.DIVISION` for division links

**Run seed:**
```bash
npx tsx prisma/seed.ts
```

**Verification:**
- `npx tsx -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); (async () => { const users = await p.user.count(); const links = await p.usefulLink.count(); console.log({users, links}); })()"` shows non-zero links count

---

## Task 3: Update Team Feature — Multi-Scope Link Types & Repository

**Objective:** Update types, repository, service, and schema untuk handle multi-scope links.

**Files:**
- Modify: `src/features/team/types.ts`
- Modify: `src/features/team/repository.ts`
- Modify: `src/features/team/schema.ts`
- Modify: `src/features/team/service.ts`
- Modify: `src/features/team/actions.ts`

**types.ts changes:**
- Add `LinkScope` to imports if not auto-generated
- Add new types for org/division link operations:
```typescript
export interface CreateOrgLinkInput {
  title: string;
  url: string;
  category: LinkCategory;
  notes?: string;
}

export interface CreateDivisionLinkInput {
  divisionId: string;
  title: string;
  url: string;
  category: LinkCategory;
  notes?: string;
}
```

**schema.ts changes:**
- Add `linkScopeSchema` enum Zod
- Add `createOrgLinkSchema` and `createDivisionLinkSchema`

**repository.ts changes:**
- `dbCreateUsefulLink`: Make `teamId` optional, add `scope` and `divisionId` params
- Add `dbFindOrgUsefulLinks` — fetch all ORG-scoped links
- Add `dbFindDivisionUsefulLinks(divisionId)` — fetch all DIVISION-scoped links for a division
- Update `dbFindUsefulLinkById` — handle nullable teamId

**service.ts changes:**
- Add `addOrgLink(actor, data)` — only SYSTEM_ADMIN or BPH can add org links
- Add `addDivisionLink(actor, divisionId, data)` — SYSTEM_ADMIN, BPH, or Division HEAD can add division links
- Add `deleteOrgLink(actor, linkId)` — only admin/BPH
- Add `deleteDivisionLink(actor, linkId)` — admin/BPH/division head
- `addUsefulLink` — remains unchanged for team-level

**actions.ts changes:**
- Add `addOrgLinkAction`, `addDivisionLinkAction`
- Add `deleteOrgLinkAction`, `deleteDivisionLinkAction`

**Verification:**
- Check TypeScript compilation: `npx tsc --noEmit`
- Run seed again to ensure no errors

---

## Task 4: Create Shared Link Display Component

**Objective:** Buat reusable component untuk menampilkan link cards yang bisa dipakai di org, division, dan team pages.

**Files:**
- Create: `src/components/dashboard/UsefulLinkCard.tsx`
- Create: `src/components/dashboard/UsefulLinkList.tsx`

**UsefulLinkCard.tsx:**
```tsx
// Card component for a single link
// Props: link (id, title, url, category, notes), onDelete?, canDelete?
// Renders: icon based on category, title, url as clickable link, notes, delete button if canDelete
// Styling: Consistent with existing dashboard design (dark theme, rounded-2xl, etc.)
```

**UsefulLinkList.tsx:**
```tsx
// List component for a section of links
// Props: links[], title, onDelete?, canDelete?
// Renders: section header + grid of UsefulLinkCards
```

**Important:** This is a pure display component. Read from the docs how link categories map to icons.

**Category icon mapping:**
- GITHUB → GitHub icon (use `<Code/>` or custom)
- NOTION → Notion-like icon
- FIGMA → Figma-like icon
- DISCORD → MessageSquare
- GOOGLE_DRIVE → HardDrive or Folder
- JIRA → Kanban-like icon
- DOCUMENTATION → Book or FileText
- OTHER → Link2

**Verification:**
- Component compiles without TS errors
- Visually consistent with existing dashboard components

---

## Task 5: Update Division Hub Pages — Add Links Section

**Objective:** Tambah division-specific links dan org-wide links di halaman divisi.

**Files:**
- Modify: `src/app/dashboard/divisions/page.tsx`
- Modify: `src/app/dashboard/divisions/[id]/page.tsx`

**divisions/page.tsx (list page) changes:**
- Add org-wide links section at top (visible to all authenticated users)
- Show key links: Discord, GitHub, Notion, Figma, etc.
- Keep existing division list below

**divisions/[id]/page.tsx (detail page) changes:**
- Add division-specific links section (right sidebar or below member management)
- Only division members or admin/BPH can see manage links button
- Add org-wide links section as a collapsible footer
- Update query to fetch division's useful links
- Pass session user's division role (HEAD/STAFF) to determine edit permissions

**Query changes in detail page:**
```typescript
const usefulLinks = await prisma.usefulLink.findMany({
  where: { 
    scope: 'DIVISION',
    divisionId: division.id 
  },
  orderBy: { createdAt: 'desc' }
});

const orgLinks = await prisma.usefulLink.findMany({
  where: { scope: 'ORG' },
  orderBy: { createdAt: 'desc' }
});
```

**Verification:**
- Navigate to `/dashboard/divisions` — org links visible
- Navigate to `/dashboard/divisions/[id]` — division links visible in sidebar
- Responsive layout works

---

## Task 6: Update Role System — Guards & DashboardShell for BPH

**Objective:** Update permission guards dan sidebar navigation untuk handle BPH role.

**Files:**
- Modify: `src/lib/guards.ts`
- Modify: `src/components/dashboard/DashboardShell.tsx`
- Modify: `src/components/dashboard/DashboardShell.tsx` (nav items)

**guards.ts changes:**
```typescript
// Add helper
export function isAdmin(user: ActiveUser): boolean {
  return user.role === 'SYSTEM_ADMIN' || user.role === 'BPH';
}

// Or keep existing validateActiveUser and add new guard:
export async function validateBphUser(): Promise<ActiveUser> {
  const user = await validateActiveUser();
  if (user.role !== 'SYSTEM_ADMIN' && user.role !== 'BPH') {
    throw new Error('Forbidden: Requires BPH or ADMIN role.');
  }
  return user;
}
```

**DashboardShell.tsx changes:**
- `isAdmin` check: also include `BPH` role alongside `SYSTEM_ADMIN`
- Add BPH nav items (after "Administration" section or as separate "BPH" section)
  - `/dashboard/divisions` — Manage Divisions (if not already shown)
  - `/dashboard/programs` — All Programs (cross-division)
- Update admin section to show for BPH also:
  - Manage Users (admin only)
  - Manage Teams (admin only)
  - Audit Log (admin only)
- User footer: show BPH badge for BPH users

**Verification:**
- BPH user sees nav items appropriately
- SYSTEM_ADMIN still sees admin section
- MEMBER and MENTOR don't see BPH/admin items

---

## Task 7: Update Dashboard Home — Org Links Widget + BPH View

**Objective:** Tambah org-wide links widget di dashboard utama dan BPH-specific overview.

**Files:**
- Modify: `src/app/dashboard/page.tsx`

**Changes:**

1. **Org Links Widget** (visible to ALL authenticated users):
```tsx
// Fetch org links
const orgLinks = await prisma.usefulLink.findMany({
  where: { scope: 'ORG' },
  orderBy: { createdAt: 'desc' },
});

// Display as a grid of link cards in a section above Today's Focus
```

Place it right after the welcome section, before Today's Focus. Key links prominently displayed.

2. **BPH View Enhancement:**
- If user is BPH or SYSTEM_ADMIN, show additional cards:
  - Division overview (how many divisions, members per division)
  - All programs summary (across all divisions)
  - Pending approvals count

3. **Current Team + No Team flow** — unchanged for non-BPH users.

**Verification:**
- Logged-in user sees org links at top of dashboard
- BPH/admin sees additional overview stats
- Clicking a link opens in new tab (target="_blank")

---

## Task 8: Update Division Feature — Server Actions for Division Links

**Objective:** Tambah server actions untuk manage division links via Division Feature, bukan Team Feature (karena division links lebih cocok di feature division).

**Files:**
- Modify: `src/features/division/types.ts`
- Modify: `src/features/division/repository.ts`
- Modify: `src/features/division/service.ts`
- Modify: `src/features/division/actions.ts`

**types.ts:**
- Add link-related types

**repository.ts:**
```typescript
export async function dbFindDivisionUsefulLinks(divisionId: string): Promise<UsefulLink[]> {
  return prisma.usefulLink.findMany({
    where: { scope: 'DIVISION', divisionId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function dbCreateDivisionLink(data: {
  divisionId: string;
  title: string;
  url: string;
  category: LinkCategory;
  notes?: string | null;
  createdBy: string;
}): Promise<{ id: string }> {
  return prisma.usefulLink.create({
    data: {
      scope: 'DIVISION',
      divisionId: data.divisionId,
      title: data.title,
      url: data.url,
      category: data.category,
      notes: data.notes,
      createdBy: data.createdBy,
    },
    select: { id: true },
  });
}

export async function dbDeleteDivisionLink(linkId: string, divisionId: string): Promise<void> {
  await prisma.usefulLink.delete({
    where: { id: linkId, scope: 'DIVISION', divisionId },
  });
}
```

**service.ts:**
```typescript
export async function addDivisionLink(
  actor: ActiveUser,
  divisionId: string,
  data: { title: string; url: string; category: string; notes?: string }
): Promise<ActionResult> {
  const membership = await prisma.divisionMembership.findUnique({
    where: { userId_divisionId: { userId: actor.id, divisionId } },
  });
  
  const canManage = 
    actor.role === 'SYSTEM_ADMIN' || 
    actor.role === 'BPH' ||
    membership?.role === 'HEAD';
  
  if (!canManage) {
    return { success: false, error: 'UNAUTHORIZED' };
  }
  
  const link = await dbCreateDivisionLink({
    divisionId,
    title: data.title,
    url: data.url,
    category: data.category as LinkCategory,
    notes: data.notes ?? null,
    createdBy: actor.id,
  });
  
  await createAuditLog(actor.id, 'DIVISION_LINK_ADD', 'UsefulLink', link.id, {
    divisionId,
    title: data.title,
  });
  
  return { success: true };
}

export async function deleteDivisionLink(
  actor: ActiveUser,
  linkId: string,
  divisionId: string
): Promise<ActionResult> {
  // Same permission check as addDivisionLink
  ...
}
```

**actions.ts:**
- `actionAddDivisionLink(divisionId, data)` ← only if member of division (HEAD) or admin/BPH
- `actionDeleteDivisionLink(linkId, divisionId)` ← same permission
- Revalidate path: `/dashboard/divisions/[id]`

**Verification:**
- Division HEAD can add/delete links
- Division STAFF (member) cannot add/delete links
- Admin/BPH can manage any division's links

---

## Task 9: Create Org-Wide Links Management Page (Admin/BPH Only)

**Objective:** Halaman khusus untuk manage org-wide links.

**Files:**
- Create: `src/app/dashboard/admin/links/page.tsx`

**Page:**
- Simple CRUD: List existing org links, add new, delete
- Accessible only to SYSTEM_ADMIN and BPH
- Uses `addOrgLinkAction` and `deleteOrgLinkAction` from team feature
- Or create dedicated admin actions

**Verification:**
- Navigate to `/dashboard/admin/links` as admin/BPH → visible
- Navigate as member → not found or redirect
- Add new org link → appears on all dashboards
- Delete org link → disappears

---

## Task 10: Final Verification & Cleanup

**Objective:** Pastikan semua perubahan berfungsi dan tidak ada regresi.

**Steps:**
1. `npx prisma generate` — regenerates client
2. `npx tsc --noEmit` — no type errors
3. `npx prisma migrate status` — all migrations applied
4. Reset DB + full reseed for clean state:
   ```bash
   npx prisma migrate reset --force
   npx tsx prisma/seed.ts
   ```
5. `npm run dev` — app starts without errors
6. Manual test flows:
   - Login as SYSTEM_ADMIN → see org links + admin section
   - Login as BPH → see org links + BPH section (no admin)
   - Login as MENTOR → see org links only
   - Login as MEMBER → see org links + team info
   - Navigate to divisions → org links visible
   - Navigate to division detail → division links visible
   - Check team workspace → team links still work

7. `git status` — all changes tracked
8. `git add -A && git commit -m "feat: phase 1 dashboard - multi-scope links, BPH role, division hubs"`

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing team links break | High | Keep TEAM scope backward compatible, teamId remains in use |
| Division HEAD permission check wrong | Medium | Test with seed: assign HEAD role, verify CRUD works |
| BPH role exposed to admin-only features | Medium | Guards check BPH !== SYSTEM_ADMIN where admin-only is required (audit, manage users) |
| Migration causes data loss | High | Team links kept via scope=TEAM + teamId unchanged. Only ADD new fields, never drop existing |
| TypeScript errors from new Prisma types | Medium | Run `tsc --noEmit` before final commit |

---

## Files Changed Summary

```
Modified:
  prisma/schema.prisma                    — LinkScope enum, BPH role, UsefulLink refactor
  prisma/seed.ts                          — Org links, division links, BPH user
  src/features/team/types.ts              — New link input types
  src/features/team/repository.ts         — New link repository methods
  src/features/team/schema.ts             — New Zod schemas
  src/features/team/service.ts            — New link business logic
  src/features/team/actions.ts            — New link server actions
  src/features/division/types.ts          — Link types
  src/features/division/repository.ts     — Division link queries
  src/features/division/service.ts        — Division link business logic
  src/features/division/actions.ts        — Division link server actions
  src/lib/guards.ts                       — BPH guard
  src/components/dashboard/DashboardShell.tsx — BPH nav items
  src/app/dashboard/page.tsx              — Org links widget + BPH view
  src/app/dashboard/divisions/page.tsx    — Org links section
  src/app/dashboard/divisions/[id]/page.tsx — Division links section

Created:
  src/components/dashboard/UsefulLinkCard.tsx  — Reusable link card
  src/components/dashboard/UsefulLinkList.tsx  — Reusable link list
  src/app/dashboard/admin/links/page.tsx       — Org link management
```
