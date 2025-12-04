const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Iniciando restauración de datos a PostgreSQL...')

  const backupPath = path.join(__dirname, 'backup-data.json')

  if (!fs.existsSync(backupPath)) {
    console.error('❌ No se encontró el archivo de respaldo:', backupPath)
    console.log('   Por favor ejecuta primero: node scripts/dump-data.js')
    process.exit(1)
  }

  const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'))

  console.log(`📂 Archivo de respaldo cargado (${data.devices.length} dispositivos, ${data.responsibles.length} responsables)`)

  // 1. Restaurar Responsables (Primero porque Dispositivos dependen de ellos)
  console.log('   Restaurando Responsables...')
  for (const resp of data.responsibles) {
    await prisma.responsible.create({
      data: resp
    })
  }

  // 2. Restaurar Dispositivos
  console.log('   Restaurando Dispositivos...')
  for (const device of data.devices) {
    await prisma.device.create({
      data: device
    })
  }

  // 3. Restaurar Formularios
  console.log('   Restaurando Formularios...')
  for (const form of data.forms) {
    await prisma.deliveryReturnForm.create({
      data: form
    })
  }

  console.log('✅ Restauración completada exitosamente!')
}

main()
  .catch(e => {
    console.error('❌ Error durante la restauración:', e)
    console.log('\n💡 Nota: Si el error es de "Unique constraint", asegúrate de que la base de datos nueva esté vacía.')
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
