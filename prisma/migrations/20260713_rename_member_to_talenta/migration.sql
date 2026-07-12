-- Rename MEMBER → TALENTA, SYSTEM_ADMIN → KOORDINATOR_UMUM, BPH → KEPALA_DIVISI
-- Add FOUNDER, TALENTA_INTI

-- 1. Drop default so column accepts any text during transition
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- 2. Create new enum type
CREATE TYPE "UserRole_new" AS ENUM ('FOUNDER', 'KOORDINATOR_UMUM', 'KEPALA_DIVISI', 'TALENTA_INTI', 'KETUA_DEWAN_MENTOR', 'MENTOR', 'TALENTA');

-- 3. Cast column to new type with mapping
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING (
  CASE role::text
    WHEN 'SYSTEM_ADMIN' THEN 'KOORDINATOR_UMUM'::text
    WHEN 'BPH'          THEN 'KEPALA_DIVISI'::text
    WHEN 'MEMBER'       THEN 'TALENTA'::text
    ELSE role::text
  END
)::text::"UserRole_new";

-- 4. Drop old enum
DROP TYPE "UserRole";

-- 5. Rename new enum to original name
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- 6. Restore default
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'TALENTA';

-- 7. Set ghanirahmans as FOUNDER
UPDATE "User" SET role = 'FOUNDER' WHERE username = 'ghanirahmans';
