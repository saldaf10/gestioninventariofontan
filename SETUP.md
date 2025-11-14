# Guía de Configuración Inicial

## Pasos para configurar el proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="cambiar-este-secreto-en-produccion"
NEXTAUTH_URL="http://localhost:3000"
```

**Importante:** En producción, cambia `NEXTAUTH_SECRET` por un valor seguro generado aleatoriamente.

### 3. Inicializar la base de datos
```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear y sincronizar la base de datos
npx prisma db push
```

### 4. Crear directorio de uploads
El directorio `public/uploads` se creará automáticamente cuando subas el primer archivo, pero puedes crearlo manualmente:

```bash
mkdir -p public/uploads
```

### 5. Ejecutar el servidor de desarrollo
```bash
npm run dev
```

### 6. Acceder a la aplicación
Abre tu navegador en [http://localhost:3000](http://localhost:3000)

**Credenciales:**
- Usuario: `globalsistema`
- Contraseña: `Fontan20251!`

## Comandos útiles

### Desarrollo
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción

### Base de datos
- `npx prisma generate` - Regenera el cliente de Prisma
- `npx prisma db push` - Sincroniza el esquema con la base de datos
- `npx prisma studio` - Abre Prisma Studio (interfaz visual para la BD)

## Estructura de archivos importantes

- `prisma/schema.prisma` - Esquema de la base de datos
- `prisma/dev.db` - Base de datos SQLite (se crea automáticamente)
- `public/uploads/` - Directorio donde se almacenan los PDFs subidos
- `.env` - Variables de entorno (no se incluye en git)

## Notas

- La base de datos SQLite se crea automáticamente en `prisma/dev.db`
- Los archivos PDF se almacenan en `public/uploads/`
- El middleware protege todas las rutas excepto `/login` y `/api`
- Al eliminar un responsable, los dispositivos asociados quedan sin responsable (no se eliminan)

