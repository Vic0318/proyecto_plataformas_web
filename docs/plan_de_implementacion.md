# Plan de Implementación del Marketplace B2B/B2C

Este documento describe la arquitectura elegida, el diseño de la base de datos y los próximos pasos para construir la aplicación web del marketplace, basándose en los Requisitos Funcionales (RF) y No Funcionales (RNF) del proyecto.

## Pila Tecnológica Elegida (Stack)

Tras evaluar las necesidades del proyecto, se ha acordado utilizar las siguientes tecnologías:
- **Framework**: **Next.js** (React) por su capacidad de unificar frontend y backend (API Routes) en un solo repositorio, evitando problemas de CORS y acelerando el desarrollo.
- **Base de Datos**: **PostgreSQL** por su robustez, soporte de transacciones ACID nativas (esencial para evitar ventas dobles de stock en tiempo real) y facilidad para modelar relaciones.
- **ORM (Object-Relational Mapping)**: **Prisma ORM** para interactuar con PostgreSQL de manera tipada y sencilla desde Next.js.
- **Estilos**: **Vanilla CSS (CSS puro)** utilizando variables CSS globales para lograr un diseño premium, responsive y personalizado de alto nivel sin ad-hoc utilities.
- **Autenticación**: **NextAuth.js** para gestionar el inicio de sesión y el control de accesos basado en roles (Empresa, Freelance, Tendero, Admin).
- **Pasarela de Pagos**: **Stripe** (u otra pasarela compatible con PCI-DSS) integrada de forma segura a nivel de servidor.

---

## Estructura y Esquema de Base de Datos (Prisma Schema)

Definiremos el esquema relacional con las siguientes entidades principales:
1. **User**: Roles (`ADMIN`, `EMPRESA`, `VENDEDOR_FREELANCE`, `TENDERO`), email, contraseña encriptada.
2. **CompanyProfile**: Relacionado con `User`. Configura el monto mínimo de compra y estado de suscripción.
3. **FreelanceProfile**: Relacionado con `User`. Estado de certificaciones o tests aprobados.
4. **Product**: Relacionado con `CompanyProfile` (quien lo vende). Contiene stock, precio y umbral de alerta de stock bajo.
5. **Order**: Relacionado con el cliente (`Tendero`), el vendedor (`Freelance`, opcional) y la `Empresa`. Rastrea totales, comisiones y estado de entrega.
6. **CertificationTest**: Creados por Empresas o Administradores para validar perfiles calificados de freelancers.
7. **CertificationAttempt**: Resultados de los exámenes tomados por los freelancers.
8. **Payment**: Registro de cobros (50% o 100%) y retención de comisiones.

---

## Plan de Trabajo por Fases

### Fase 1: Inicialización y Documentación
1. Guardar y actualizar los documentos de diseño (`requisitos_del_proyecto.md` y `plan_de_implementacion.md`) en la carpeta `docs/` del repositorio local.
2. Hacer commit en Git de la documentación y el README actualizado.
3. Inicializar el proyecto Next.js en la carpeta raíz `proyecto_plataformas_web/`.

### Fase 2: Configuración del Core y Base de Datos
1. Instalar y configurar **Prisma ORM** con el esquema de base de datos detallado.
2. Crear un script de semilla (`seed`) para poblar la base de datos con roles y usuarios de prueba.
3. Configurar el sistema de estilos globales con Vanilla CSS (colores oscuros, tipografía moderna e interactividad fluida).

### Fase 3: Autenticación y Layout
1. Configurar **NextAuth.js** para inicio de sesión por roles.
2. Diseñar el layout base responsivo (Navbar, Sidebar y vistas para cada tipo de rol).

---

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutar migraciones locales de base de datos para validar la integridad del esquema.
- Pruebas del API de cálculo de comisiones e inventario con datos semilla.

### Verificación Manual
- Comprobación del correcto registro e inicio de sesión de cada rol.
- Revisión visual de la interfaz adaptada a dispositivos móviles y escritorio.
