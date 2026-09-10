const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { memories: true } }
    },
    orderBy: { createdAt: 'asc' }
  });
  const memories = await p.memory.findMany({ orderBy: { createdAt: 'desc' } });

  console.log('\n===== DATABASE OVERVIEW =====');
  console.log(`Total Users   : ${users.length}`);
  console.log(`Total Memories: ${memories.length}`);
  console.log('\n--- Users ---');
  users.forEach(u => {
    console.log(`  [${u.role.toUpperCase()}] ${u.username}  |  memories: ${u._count.memories}  |  active: ${u.isActive}`);
  });
  console.log('\n--- Memories ---');
  if (memories.length === 0) console.log('  (none yet)');
  memories.forEach(m => {
    console.log(`  "${m.title}" [${m.type}]  |  user: ${m.userId}`);
  });
  console.log('\n DB file: prisma/dev.db (SQLite)');
}

main().finally(() => p.$disconnect());
