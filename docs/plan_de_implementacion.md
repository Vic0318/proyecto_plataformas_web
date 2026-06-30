# Plan de Implementación del Marketplace B2B/B2C

Este documento describe la arquitectura propuesta, el diseño de la base de datos y los próximos pasos para construir la aplicación web del marketplace, basándose en los Requisitos Funcionales (RF) y No Funcionales (RNF) proporcionados.

## Revisión Requerida del Usuario

> [!IMPORTANT]
> Por favor revisa la pila tecnológica (stack) propuesta y las preguntas abiertas a continuación. Tus decisiones guiarán la inicialización del proyecto.

## Preguntas Abiertas

> [!WARNING]
> Para proceder con la configuración más precisa, por favor aclara lo siguiente:
> 1. **Stack Tecnológico Frontend**: Dado que ahora usaremos **Django** para el backend, ¿prefieres usar el sistema de plantillas de Django (Full-Stack) o separar el frontend utilizando React (Vite o Next.js) y comunicar ambos vía API REST? *Recomiendo separar el frontend (React/Next.js) y el backend (Django REST Framework) para mayor escalabilidad.*
> 2. **Base de Datos**: Con Django, SQLite viene por defecto y es genial para empezar. ¿Deseas mantener SQLite para esta fase inicial, o prefieres configurar PostgreSQL desde el inicio para producción?
> 3. **Diseño y Marca**: ¿Tienes una paleta de colores específica, logotipos o guías de marca que quieras seguir para lograr esa estética "Premium" y la interfaz altamente intuitiva para los usuarios (tenderos)?
> 4. **Pasarela de Pagos**: ¿Qué pasarela de pagos tienes planeado utilizar para procesar tarjetas de crédito en tu región (ej. Stripe, PayPal, MercadoPago, Kushki, PayU)?

## Arquitectura Propuesta

- **Frontend**: Next.js o Vite (React) para construir una interfaz extremadamente intuitiva y de mínimos clics, adaptada para "analfabetos digitales". (Alternativa: Plantillas de Django si prefieres no separar el stack).
- **Estilos**: Vanilla CSS (CSS puro) para crear una interfaz premium, altamente responsiva, dinámica y estética, evitando estilos genéricos.
- **Backend/API**: Django con Django REST Framework para manejar la lógica de negocio, la gestión de inventario y la creación de la API.
- **Base de Datos**: Gestionada por el ORM de Django (SQLite en desarrollo, migrable a PostgreSQL en producción) para asegurar la integridad de los datos de pedidos e inventario.
- **Autenticación**: Django Allauth o SimpleJWT (JSON Web Tokens) con el sistema de hashing seguro integrado de Django (RNF3.2).
- **Seguridad**: Integración de pagos compatible con PCI-DSS a través de proveedores de terceros (ej. Stripe) (RNF3.1).

## Esquema de Base de Datos Propuesto (Nivel Alto)

Basado en los requisitos, estas son las entidades principales:

- `User` (Usuario): Maneja la autenticación (id, email, password_hash, rol: ADMIN, EMPRESA, VENDEDOR_FREELANCE, TENDERO).
- `CompanyProfile` (Perfil de Empresa): Almacena configuraciones específicas de la empresa (monto_minimo_pedido, estado_suscripcion).
- `FreelanceProfile` (Perfil Freelance): Rastrea el estado de las certificaciones.
- `Product` (Producto): Gestiona el catálogo y el inventario (nombre, descripción, precio, stock, umbral_bajo_stock, empresa_id).
- `Order` (Pedido): Gestiona las compras (tendero_id, freelancer_id, empresa_id, estado, monto_total, monto_comision, entrega_confirmada).
- `Test / Certification` (Exámenes / Certificaciones): Para empresas que requieren "perfiles calificados".
- `Payment` (Pago): Registra las transacciones y retiene las comisiones de los freelancers hasta la confirmación de la entrega.

## Fase 1: Fundaciones

1. **Inicializar Proyecto**: Crear el entorno virtual e inicializar el proyecto de Django, así como el repositorio de frontend (si aplica).
2. **Configurar CSS Global**: Definir variables CSS para la paleta de colores premium, tipografía moderna (ej. Inter o Outfit) y micro-animaciones.
3. **Inicialización de la Base de Datos**: Configurar los modelos en Django (models.py) y ejecutar las migraciones iniciales.
4. **Módulo de Autenticación**: Implementar registro, inicio de sesión y control de acceso basado en roles (RBAC) usando los grupos/permisos de Django.

## Plan de Verificación

### Pruebas Automatizadas
- Pruebas de integración para el flujo de pedidos para asegurar que el stock se actualice correctamente y se manejen compras concurrentes.
- Pruebas unitarias para la lógica de cálculo de comisiones.

### Verificación Manual
- Revisión de la UX/UI teniendo en mente el perfil del "analfabeto digital" (botones grandes, mínimos clics).
- Verificar los permisos de roles basándose en la matriz proporcionada en los requerimientos.
