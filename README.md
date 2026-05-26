# (Nombre Pagina) - Marketplace Mayorista Inteligente

Aura B2B es una plataforma web de comercio al por mayor (B2B/B2C) diseñada para agilizar y optimizar la relación comercial entre Proveedores (Empresas), Vendedores Freelance y Comercios Locales (Tenderos).

## Pila Tecnológica (Stack)

Para garantizar consistencia en las transacciones, velocidad de desarrollo y una excelente experiencia visual, el proyecto utiliza:

- **Frontend & Backend (API)**: [Next.js](https://nextjs.org/) (React) utilizando el **App Router** y **TypeScript** para un código seguro y tipado.
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/), ideal para asegurar la integridad transaccional de inventarios y cálculos de comisiones (ACID).
- **ORM**: [Prisma ORM](https://www.prisma.io/) para la interacción segura y tipada con la base de datos.
- **Estilos**: **Vanilla CSS (CSS puro)** organizado mediante variables y tokens globales para asegurar una interfaz altamente personalizada, responsive y de estética Premium.
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/) para control de acceso y manejo de roles del sistema.

---

## Instrucciones para Iniciar el Proyecto

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

### 1. Requisitos Previos
Asegúrate de tener instalado:
- **Node.js** (versión 20.x o superior recomendada).
- Una instancia de **PostgreSQL** activa (local, mediante Docker, o en la nube en plataformas como Supabase o Neon.tech).

### 2. Clonar e Instalar Dependencias
Clona el repositorio en tu máquina local e ingresa a la carpeta del proyecto:
```bash
git clone https://github.com/Vic0318/proyecto_plataformas_web.git
cd proyecto_plataformas_web
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo llamado `.env` en la raíz del proyecto y define la URL de tu base de datos de PostgreSQL:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/aura_b2b?schema=public"
NEXTAUTH_SECRET="un_secreto_muy_seguro_y_largo_aqui"
```

### 4. Configurar la Base de Datos con Prisma
Aplica el esquema y ejecuta las migraciones iniciales en PostgreSQL:
```bash
npx prisma db push
```
*(Opcional)* Si hay datos de prueba (semilla) configurados, puedes poblar la base de datos ejecutando:
```bash
npx prisma db seed
```

### 5. Iniciar el Servidor de Desarrollo
Corre el proyecto localmente:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Recomendaciones de Desarrollo

- **Consistencia en Estilos**: Evita instalar frameworks de CSS utilitario como Tailwind CSS. Utiliza el sistema de variables de `src/app/globals.css` para crear componentes consistentes con la guía visual premium.
- **Flujo de Base de Datos**: Cada vez que realices cambios en el archivo `prisma/schema.prisma`, asegúrate de correr `npx prisma generate` para actualizar los tipos autocompletados en el editor.
- **Roles y Permisos**: Siempre verifica los permisos en el backend al crear APIs; recuerda que los Tenderos y Vendedores Freelance tienen capacidades y vistas distintas.

---

## Documentación Adicional
Puedes encontrar más detalles sobre el diseño técnico y del negocio en la carpeta `docs/`:
- [Especificación de Requisitos](docs/requisitos_del_proyecto.md)
- [Plan de Implementación](docs/plan_de_implementacion.md)
