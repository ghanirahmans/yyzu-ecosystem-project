// prisma/seed.ts
// Run with: npx tsx prisma/seed.ts  OR  npx prisma db seed
// ============================================================

import { PrismaClient, DivisionName, DivisionRole, ProgramStatus, PartnershipType, PartnershipStatus, UserStatus, UserRole, TeamRole } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

// ── Helpers ────────────────────────────────────────────────────

async function hash(plain: string) {
  return argon2.hash(plain);
}

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ── Seed ──────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding YYZU database...");

  // ── 1. System Admin ──────────────────────────────────────
  const adminPassword = await hash("Admin@YYZU2024");
  const admin = await prisma.user.upsert({
    where: { username: "ghanirahmans" },
    update: {},
    create: {
      username: "ghanirahmans",
      fullName: "Ghani Rahmans",
      email: "admin@yyzu.tech",
      passwordHash: adminPassword,
      status: UserStatus.ACTIVE,
      role: UserRole.SYSTEM_ADMIN,
      approvedAt: new Date(),
      profile: { create: { bio: "Founder & System Administrator YYZU Ecosystem." } },
    },
  });
  console.log(`✓ Admin: ${admin.username}`);

  // ── 2. Active Members ─────────────────────────────────────
  const memberPassword = await hash("Member@YYZU2024");

  const members = await Promise.all([
    // Division heads
    prisma.user.upsert({
      where: { username: "arjun_pratama" },
      update: {},
      create: {
        username: "arjun_pratama",
        fullName: "Arjun Pratama",
        email: "arjun@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "Head of Partnership Division. Passionate about building strategic alliances." } },
      },
    }),
    prisma.user.upsert({
      where: { username: "siti_nurhaliza" },
      update: {},
      create: {
        username: "siti_nurhaliza",
        fullName: "Siti Nurhaliza",
        email: "siti@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "Head of SDM Management. Building the talent pipeline." } },
      },
    }),
    prisma.user.upsert({
      where: { username: "budi_santoso" },
      update: {},
      create: {
        username: "budi_santoso",
        fullName: "Budi Santoso",
        email: "budi@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "Head of Event Organizer. Making every YYZU event memorable." } },
      },
    }),
    prisma.user.upsert({
      where: { username: "dewi_kartika" },
      update: {},
      create: {
        username: "dewi_kartika",
        fullName: "Dewi Kartika",
        email: "dewi@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "Head of Product & Project Management." } },
      },
    }),
    prisma.user.upsert({
      where: { username: "fajar_nugroho" },
      update: {},
      create: {
        username: "fajar_nugroho",
        fullName: "Fajar Nugroho",
        email: "fajar@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "Head of Learning & Curriculum. Designing the YYZU learning paths." } },
      },
    }),
    prisma.user.upsert({
      where: { username: "indah_permata" },
      update: {},
      create: {
        username: "indah_permata",
        fullName: "Indah Permata",
        email: "indah@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "Head of Media & Branding." } },
      },
    }),
    // Regular active member
    prisma.user.upsert({
      where: { username: "rizky_ramadan" },
      update: {},
      create: {
        username: "rizky_ramadan",
        fullName: "Rizky Ramadan",
        email: "rizky@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "Frontend developer, loves React and Next.js." } },
      },
    }),
    prisma.user.upsert({
      where: { username: "maya_anggraini" },
      update: {},
      create: {
        username: "maya_anggraini",
        fullName: "Maya Anggraini",
        email: "maya@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.ACTIVE,
        approvedBy: admin.id,
        approvedAt: new Date(),
        profile: { create: { bio: "UI/UX Designer." } },
      },
    }),
  ]);

  // ── 3. Pending & Rejected members (for testing approval queue) ──
  await Promise.all([
    prisma.user.upsert({
      where: { username: "pending_user_1" },
      update: {},
      create: {
        username: "pending_user_1",
        fullName: "Ahmad Fauzi",
        email: "pending1@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.PENDING_APPROVAL,
        profile: { create: {} },
      },
    }),
    prisma.user.upsert({
      where: { username: "pending_user_2" },
      update: {},
      create: {
        username: "pending_user_2",
        fullName: "Lina Kusuma",
        email: "pending2@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.PENDING_APPROVAL,
        profile: { create: {} },
      },
    }),
    prisma.user.upsert({
      where: { username: "rejected_user_1" },
      update: {},
      create: {
        username: "rejected_user_1",
        fullName: "Dummy Rejected",
        email: "rejected1@yyzu.tech",
        passwordHash: memberPassword,
        status: UserStatus.REJECTED,
        profile: { create: {} },
      },
    }),
  ]);
  console.log(`✓ Users: ${members.length + 1} active, 2 pending, 1 rejected`);

  // ── 3b. Mentor User ───────────────────────────────────────
  const mentorPassword = await hash("Mentor@YYZU2024");
  const mentor = await prisma.user.upsert({
    where: { username: "mentor_review" },
    update: {},
    create: {
      username: "mentor_review",
      fullName: "Mentor Reviewer",
      email: "mentor@yyzu.tech",
      passwordHash: mentorPassword,
      status: UserStatus.ACTIVE,
      approvedBy: admin.id,
      approvedAt: new Date(),
      role: UserRole.MENTOR,
      profile: { create: { bio: "Ecosystem Mentor and Project Reviewer." } },
    },
  });
  console.log(`✓ Mentor: ${mentor.username}`);

  const [arjun, siti, budi, dewi, fajar, indah, rizky, maya] = members;

  // ── 4. Divisions (7 BPH) ──────────────────────────────────
  const divisionDefs: Array<{
    name: DivisionName;
    description: string;
    headId: string;
  }> = [
      {
        name: DivisionName.KOORDINATOR_UMUM,
        description: "Koordinasi umum seluruh operasional dan arah strategis YYZU Ecosystem.",
        headId: admin.id,
      },
      {
        name: DivisionName.PARTNERSHIP,
        description: "Membangun dan mengelola kemitraan strategis dengan kampus, industri, komunitas, dan mentor individu.",
        headId: arjun.id,
      },
      {
        name: DivisionName.SDM_MANAGEMENT,
        description: "Rekrutmen, onboarding, dan pengembangan sumber daya manusia ekosistem YYZU.",
        headId: siti.id,
      },
      {
        name: DivisionName.EVENT_ORGANIZER,
        description: "Perencanaan, eksekusi, dan evaluasi seluruh event YYZU baik internal maupun publik.",
        headId: budi.id,
      },
      {
        name: DivisionName.PRODUCT_PROJECT_MANAGEMENT,
        description: "Manajemen produk dan proyek internal YYZU serta koordinasi tim proyek member.",
        headId: dewi.id,
      },
      {
        name: DivisionName.LEARNING_CURRICULUM,
        description: "Desain kurikulum, jalur belajar, study group, dan konten edukatif ekosistem YYZU.",
        headId: fajar.id,
      },
      {
        name: DivisionName.MEDIA_BRANDING,
        description: "Manajemen media sosial, konten branding, dan komunikasi eksternal YYZU.",
        headId: indah.id,
      },
    ];

  for (const def of divisionDefs) {
    const division = await prisma.division.upsert({
      where: { name: def.name },
      update: { description: def.description },
      create: { name: def.name, description: def.description },
    });

    // Upsert head membership
    await prisma.divisionMembership.upsert({
      where: { userId_divisionId: { userId: def.headId, divisionId: division.id } },
      update: { role: DivisionRole.HEAD },
      create: { userId: def.headId, divisionId: division.id, role: DivisionRole.HEAD },
    });

    // Add a couple of staff members to some divisions
    if (def.name === DivisionName.PARTNERSHIP) {
      await prisma.divisionMembership.upsert({
        where: { userId_divisionId: { userId: rizky.id, divisionId: division.id } },
        update: {},
        create: { userId: rizky.id, divisionId: division.id, role: DivisionRole.STAFF },
      });
    }
    if (def.name === DivisionName.MEDIA_BRANDING) {
      await prisma.divisionMembership.upsert({
        where: { userId_divisionId: { userId: maya.id, divisionId: division.id } },
        update: {},
        create: { userId: maya.id, divisionId: division.id, role: DivisionRole.STAFF },
      });
    }
  }
  console.log("✓ Divisions: 7 created with heads");

  // ── 5. Teams ──────────────────────────────────────────────
  const teamNexus = await prisma.team.upsert({
    where: { name: "Team Nexus" },
    update: {},
    create: {
      name: "Team Nexus",
      description: "Building the YYZU internal admin dashboard. Stack: Next.js, Prisma, PostgreSQL.",
      createdBy: arjun.id,
    },
  });
  await prisma.teamMembership.upsert({
    where: { userId_teamId: { userId: arjun.id, teamId: teamNexus.id } },
    update: {},
    create: { userId: arjun.id, teamId: teamNexus.id, role: TeamRole.TEAM_LEADER },
  });
  await prisma.teamMembership.upsert({
    where: { userId_teamId: { userId: rizky.id, teamId: teamNexus.id } },
    update: {},
    create: { userId: rizky.id, teamId: teamNexus.id, role: TeamRole.MEMBER },
  });

  const teamAurora = await prisma.team.upsert({
    where: { name: "Team Aurora" },
    update: {},
    create: {
      name: "Team Aurora",
      description: "Developing a mentorship matching platform for YYZU community.",
      createdBy: dewi.id,
    },
  });
  await prisma.teamMembership.upsert({
    where: { userId_teamId: { userId: dewi.id, teamId: teamAurora.id } },
    update: {},
    create: { userId: dewi.id, teamId: teamAurora.id, role: TeamRole.TEAM_LEADER },
  });
  await prisma.teamMembership.upsert({
    where: { userId_teamId: { userId: maya.id, teamId: teamAurora.id } },
    update: {},
    create: { userId: maya.id, teamId: teamAurora.id, role: TeamRole.MEMBER },
  });

  // Useful links for Team Nexus
  await prisma.usefulLink.upsert({
    where: { id: "link-nexus-gh" },
    update: {},
    create: {
      id: "link-nexus-gh",
      teamId: teamNexus.id,
      title: "YYZU Admin Repo",
      url: "https://github.com/yyzu-ecosystem/admin",
      category: "GITHUB",
      notes: "Main repository for admin dashboard",
      createdBy: arjun.id,
    },
  });
  await prisma.usefulLink.upsert({
    where: { id: "link-nexus-notion" },
    update: {},
    create: {
      id: "link-nexus-notion",
      teamId: teamNexus.id,
      title: "Team Nexus Workspace",
      url: "https://notion.so/yyzu/nexus",
      category: "NOTION",
      notes: "Sprint planning, task tracking, and docs",
      createdBy: arjun.id,
    },
  });

  // Submissions
  const existingNexusSub = await prisma.submission.findFirst({
    where: { teamId: teamNexus.id },
  });
  if (!existingNexusSub) {
    await prisma.submission.create({
      data: {
        teamId: teamNexus.id,
        status: "NOT_SUBMITTED",
      },
    });
  }

  const existingAuroraSub = await prisma.submission.findFirst({
    where: { teamId: teamAurora.id },
  });
  if (!existingAuroraSub) {
    await prisma.submission.create({
      data: {
        teamId: teamAurora.id,
        submissionLink: "https://github.com/yyzu/team-aurora-project",
        status: "SUBMITTED",
        submittedBy: dewi.id,
        submittedAt: new Date(),
      },
    });
  }

  // Pending join request to Team Nexus
  const pendingUser1 = await prisma.user.findUnique({ where: { username: "pending_user_1" } });
  if (pendingUser1) {
    await prisma.joinRequest.upsert({
      where: { id: "jr-pending-1" },
      update: {},
      create: {
        id: "jr-pending-1",
        userId: pendingUser1.id,
        teamId: teamNexus.id,
        message: "I'd love to contribute to the admin dashboard project!",
        status: "PENDING",
      },
    });
  }
  console.log("✓ Teams: 2 created (Nexus, Aurora)");

  // ── 6. Programs ──────────────────────────────────────────
  const partnershipDiv = await prisma.division.findUnique({ where: { name: DivisionName.PARTNERSHIP } });
  const learningDiv = await prisma.division.findUnique({ where: { name: DivisionName.LEARNING_CURRICULUM } });
  const eventDiv = await prisma.division.findUnique({ where: { name: DivisionName.EVENT_ORGANIZER } });

  await prisma.program.upsert({
    where: { id: "prog-study-group-react" },
    update: {},
    create: {
      id: "prog-study-group-react",
      title: "Study Group: React & Next.js Fundamentals",
      description: "Sesi belajar terarah untuk memperdalam React hooks, state management, dan SSR dengan Next.js App Router.",
      status: ProgramStatus.PUBLIKASI,
      divisions: learningDiv ? { connect: { id: learningDiv.id } } : undefined,
      picUserId: fajar.id,
      startDate: new Date("2024-07-01"),
      endDate: addDays(14),
    },
  });

  await prisma.program.upsert({
    where: { id: "prog-mini-project-q3" },
    update: {},
    create: {
      id: "prog-mini-project-q3",
      title: "Mini Project Q3 2024: Internal Tools Sprint",
      description: "Pengerjaan mini project internal tools YYZU oleh tim proyek member. Sprint 2 minggu dengan deliverable working demo.",
      status: ProgramStatus.PERSIAPAN,
      divisions: eventDiv ? { connect: { id: eventDiv.id } } : undefined,
      picUserId: budi.id,
      startDate: addDays(7),
      endDate: addDays(21),
    },
  });

  await prisma.program.upsert({
    where: { id: "prog-tech-talk-1" },
    update: {},
    create: {
      id: "prog-tech-talk-1",
      title: "Tech Talk Series #1: System Design",
      description: "Sesi sharing dengan praktisi industri membahas system design, scalability, dan engineering best practices.",
      status: ProgramStatus.SELESAI,
      divisions: learningDiv ? { connect: { id: learningDiv.id } } : undefined,
      picUserId: fajar.id,
      startDate: new Date("2024-05-15"),
      endDate: new Date("2024-05-15"),
    },
  });
  console.log("✓ Programs: 3 created");

  // ── 7. Partnerships ──────────────────────────────────────
  await prisma.partnership.upsert({
    where: { id: "partner-univ-indonesia" },
    update: {},
    create: {
      id: "partner-univ-indonesia",
      name: "Universitas Indonesia — Fasilkom",
      type: PartnershipType.KAMPUS,
      status: PartnershipStatus.NEGOTIATING,
      contactName: "Dr. Budi Wibowo",
      contactInfo: "bwibowo@cs.ui.ac.id",
      notes: "Diskusi program magang bersama dan guest lecture series untuk mahasiswa Fasilkom.",
      picUserId: arjun.id,
    },
  });

  await prisma.partnership.upsert({
    where: { id: "partner-techco" },
    update: {},
    create: {
      id: "partner-techco",
      name: "TechCo Indonesia",
      type: PartnershipType.INDUSTRI,
      status: PartnershipStatus.ACTIVE,
      contactName: "Rani Setiawan",
      contactInfo: "rani@techco.id",
      notes: "Partner aktif untuk mentoring session dan penyediaan project brief nyata dari industri.",
      picUserId: arjun.id,
    },
  });

  await prisma.partnership.upsert({
    where: { id: "partner-mentor-baskoro" },
    update: {},
    create: {
      id: "partner-mentor-baskoro",
      name: "Baskoro Adi — Senior SWE Google",
      type: PartnershipType.MENTOR_INDIVIDUAL,
      status: PartnershipStatus.CONTACTED,
      contactName: "Baskoro Adi",
      contactInfo: "baskoro.adi@gmail.com",
      notes: "Calon mentor untuk sesi technical review dan career mentoring.",
      picUserId: arjun.id,
    },
  });
  console.log("✓ Partnerships: 3 created");

  console.log("\n✅ Seed complete!");
  console.log("\nDemo credentials:");
  console.log("  System Admin : username=ghanirahmans  password=Admin@YYZU2024");
  console.log("  Mentor       : username=mentor_review  password=Mentor@YYZU2024");
  console.log("  Team Leader  : username=arjun_pratama  password=Member@YYZU2024");
  console.log("  Member       : username=rizky_ramadan  password=Member@YYZU2024");
  console.log("  Pending      : username=pending_user_1  password=Member@YYZU2024");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
