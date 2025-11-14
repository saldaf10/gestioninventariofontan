# Inventario Colegio Fontán

Sistema de gestión de inventario de dispositivos electrónicos para el Colegio Fontán.

## Características

- ✅ Gestión completa de dispositivos (CRUD)
- ✅ Gestión de responsables (CRUD)
- ✅ Gestión de formularios PDF de entrega/devolución
- ✅ Búsqueda por código de dispositivo
- ✅ Búsqueda por nombre de responsable
- ✅ Autenticación simple
- ✅ Dashboard con estadísticas
- ✅ Diseño moderno y responsive

## Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma** (SQLite)
- **Tailwind CSS**
- **React Hot Toast**

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` y configurar:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

3. Inicializar la base de datos:
```bash
npx prisma generate
npx prisma db push
```

4. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000)

## Credenciales de Acceso

- **Usuario:** `globalsistema`
- **Contraseña:** `Fontan20251!`

## Estructura del Proyecto

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard principal
│   ├── dispositivos/     # Gestión de dispositivos
│   ├── responsables/     # Gestión de responsables
│   ├── formularios/     # Gestión de formularios PDF
│   ├── buscar/          # Búsqueda
│   └── login/            # Página de login
├── components/           # Componentes reutilizables
├── lib/                  # Utilidades y configuración
└── prisma/               # Esquema de base de datos
```

## Formato de Códigos de Dispositivos

Los códigos deben seguir el formato:
- `CF-XXX` → Colegio Fontán
- `RF-XXX` → Renting Fontán
- `AF-XXX` → Asofontán

Donde XXX son números (ej: CF-001, RF-123, AF-456)

## Colores del Tema

- **Violeta Principal:** `#50007D`
- **Cian Acento:** `#00C8FF`

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar esquema con BD
- `npm run db:studio` - Abrir Prisma Studio

## Notas

- Los archivos PDF se almacenan en `public/uploads/`
- La base de datos SQLite se crea automáticamente en `prisma/dev.db`
- Al eliminar un responsable, los dispositivos asociados quedan sin responsable (responsibleId = null)

