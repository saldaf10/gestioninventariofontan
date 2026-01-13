const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const d = await prisma.device.count()
  const r = await prisma.responsible.count()
  const dr = await prisma.device.count({ where: { NOT: { responsibleId: null } } })
  console.log('--- DB STATUS ---')
  console.log('Devices:', d)
  console.log('Responsibles:', r)
  console.log('Devices with Responsible:', dr)
  console.log('-----------------')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
