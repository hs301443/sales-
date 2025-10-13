import fs from 'fs'
import path from 'path'
import prisma from '../src/lib/prisma.js'

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

function ensureInt(value, fallback = null) {
  if (value === null || value === undefined || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

async function migrateUsers(exportsDir) {
  const file = path.join(exportsDir, 'users.json')
  if (!fs.existsSync(file)) return
  const users = readJson(file)

  const emailToId = new Map()

  for (const u of users) {
    // Map role values
    let role = u.role
    if (role === 'Sales Leader') role = 'Sales_Leader'

    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role,
        status: u.status || 'Active',
        isDeleted: Boolean(u.isDeleted),
      },
      create: {
        name: u.name,
        email: u.email,
        // Passwords should be re-hashed during application flows; keep original hash if present
        password: u.password || 'REPLACE_ME',
        role,
        status: u.status || 'Active',
        target_id: ensureInt(u.target_id),
        leader_id: ensureInt(u.leader_id),
        isDeleted: Boolean(u.isDeleted),
      },
      select: { id: true, email: true }
    })
    emailToId.set(created.email, created.id)
  }

  return { emailToId }
}

async function migrateLeads(exportsDir, lookups) {
  const file = path.join(exportsDir, 'leads.json')
  if (!fs.existsSync(file)) return
  const leads = readJson(file)

  for (const l of leads) {
    await prisma.lead.create({
      data: {
        name: l.name,
        phone: l.phone,
        type: l.type === 'company' ? 'company' : 'sales',
        status: l.status || 'default',
        sales_id: ensureInt(l.sales_id),
        activity_id: ensureInt(l.activity_id),
        source_id: ensureInt(l.source_id),
        country_id: ensureInt(l.country),
        city_id: ensureInt(l.city),
        transfer: Boolean(l.transfer),
        isDeleted: Boolean(l.isDeleted),
        created_at: l.created_at ? new Date(l.created_at) : undefined,
      }
    })
  }
}

async function main() {
  const exportsDir = process.argv[2] || path.join(process.cwd(), 'exports')
  if (!fs.existsSync(exportsDir)) {
    console.error(`Exports directory not found: ${exportsDir}`)
    process.exit(1)
  }

  // Order matters due to FKs. Add more migrators as needed following this pattern
  // Country -> City -> Target -> User -> Source -> Activity -> Product -> Offer -> Lead -> PaymentMethod -> Payment -> Sales -> ScheduledContact

  await migrateUsers(exportsDir)
  await migrateLeads(exportsDir)

  console.log('Mongo JSON migration completed (users, leads). Extend script for more collections.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


