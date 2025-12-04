const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('📦 Iniciando respaldo de datos SQLite...')

  // 1. Obtener todos los datos
  const responsibles = await prisma.responsible.findMany()
  const devices = await prisma.device.findMany()
  const forms = await prisma.deliveryReturnForm.findMany()

  const data = {
    responsibles,
    devices,
    forms
  }

  // 2. Guardar en archivo JSON
  const backupPath = path.join(__dirname, 'backup-data.json')
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2))

  console.log(`
✅ Respaldo completado exitosamente!
   Archivo: ${backupPath}
   
   Resumen:
   - ${responsibles.length} Responsables
   - ${devices.length} Dispositivos
   - ${forms.length} Formularios
  `)
}

main()
  .catch(e => {
    console.error('❌ Error durante el respaldo:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
