# Ficha Técnica
## Proyecto: Plataforma Digital de Vendedores Colaborativos para la Distribución Inteligente de Productos (ISBEN)

Este documento contiene las especificaciones técnicas, arquitectura, modelo de datos y matriz de permisos de la solución desarrollada para la empresa **ISBEN**.

---

### 1. Información General del Proyecto
*   **Nombre de la Solución**: ISBEN B2B/B2C Marketplace Mayorista
*   **Cliente / Empresa**: ISBEN S.A.
*   **Objetivo**: Optimizar la cadena de distribución mayorista mediante una plataforma web que conecte de manera transparente y eficiente a la Empresa (Proveedor), Vendedores Freelance (Venta colaborativa) y Comercios Locales (Tenderos / Clientes finales).

---

### 2. Pila Tecnológica (Tech Stack)

La plataforma utiliza una arquitectura desacoplada para garantizar escalabilidad, rendimiento y facilidad de mantenimiento:

*   **Frontend**: 
    *   **Framework**: Next.js 16 (React 19) con **App Router** y **TypeScript**.
    *   **Estilos (UI)**: **Vanilla CSS** con variables globales (Custom CSS Tokens) estructurado para un diseño premium, fluido, responsivo y adaptado para "analfabetos digitales" (botones grandes, mínimo número de clics).
*   **Backend**:
    *   **Framework**: **Django 6** con **Django REST Framework (DRF)**.
    *   **Panel de Administración**: Django Admin personalizado con acciones de negocio (gestión de stock, despacho y liberación de comisiones).
*   **Base de Datos**:
    *   **Motor**: **PostgreSQL** (compatible con SQLite en entornos de desarrollo).
    *   **ORM**: Django ORM para la interacción segura y tipada con la base de datos.
*   **Autenticación y Seguridad**:
    *   Mecanismo de hashing seguro integrado en Django para almacenamiento de contraseñas.
    *   Control de acceso basado en roles (RBAC - Role-Based Access Control) a nivel de APIs y de interfaz.

---

### 3. Arquitectura del Sistema

La solución implementa una arquitectura cliente-servidor desacoplada:

1.  **Capa de Presentación (Frontend)**: Construido en Next.js. Se comunica con el backend a través de endpoints REST. Ofrece interfaces personalizadas según el rol detectado tras el login.
2.  **Capa de Negocio (Backend)**: Construido en Django. Se encarga del procesamiento de pedidos, control de stock concurrente, cálculo automático de comisiones, y retención/liberación de pagos.
3.  **Capa de Datos (Base de Datos)**: Base de datos relacional PostgreSQL que garantiza transacciones seguras (ACID), previniendo la sobreventa de productos y asegurando la consistencia en el cálculo de las comisiones.

---

### 4. Modelo y Esquema de Base de Datos

Basado en la implementación de `models.py` en Django, las principales entidades y campos son:

#### 4.1. Usuario (`Usuario`)
Hereda de `AbstractUser` de Django para el manejo de credenciales de seguridad.
*   `id` (PK, AutoIncrement)
*   `username` (Varchar, Único)
*   `email` (Varchar)
*   `password` (Hash)
*   `rol` (Varchar, Choices: `ADMIN`, `EMPRESA`, `FREELANCER`, `TENDERO`)
*   `telefono` (Varchar, Opcional)

#### 4.2. Perfil de Empresa (`PerfilEmpresa`)
Almacena configuraciones específicas de las empresas proveedoras.
*   `id` (PK, AutoIncrement)
*   `usuario` (FK a `Usuario`, Relación 1-a-1)
*   `nombre_empresa` (Varchar)
*   `monto_minimo_compra` (Decimal)
*   `suscripcion_activa` (Boolean)
*   `logo` (ImageField, Opcional)

#### 4.3. Perfil de Vendedor Freelance (`PerfilFreelance`)
Registra las certificaciones del vendedor colaborativo.
*   `id` (PK, AutoIncrement)
*   `usuario` (FK a `Usuario`, Relación 1-a-1)
*   `esta_calificado` (Boolean)

#### 4.4. Producto (`Producto`)
Maneja el catálogo mayorista y el stock disponible.
*   `id` (PK, AutoIncrement)
*   `empresa` (FK a `Usuario` con rol EMPRESA)
*   `nombre` (Varchar)
*   `descripcion` (Text)
*   `precio` (Decimal, Precio Mayorista)
*   `stock` (Integer)
*   `umbral_bajo_stock` (Integer, Límite para alertas)
*   `vista_previa` (ImageField, Opcional)

#### 4.5. Examen de Certificación (`ExamenCertificacion`)
*   `id` (PK, AutoIncrement)
*   `empresa` (FK a `Usuario` con rol EMPRESA)
*   `titulo` (Varchar)
*   `descripcion` (Text)

#### 4.6. Resultado de Examen (`ResultadoExamen`)
*   `id` (PK, AutoIncrement)
*   `freelancer` (FK a `Usuario` con rol FREELANCER)
*   `examen` (FK a `ExamenCertificacion`)
*   `aprobado` (Boolean)
*   `fecha_presentacion` (DateTime)

#### 4.7. Pedido (`Pedido`)
*   `id` (PK, AutoIncrement)
*   `cliente` (FK a `Usuario` con rol TENDERO)
*   `vendedor_freelance` (FK a `Usuario` con rol FREELANCER, Opcional)
*   `empresa` (FK a `Usuario` con rol EMPRESA)
*   `estado` (Varchar, Choices: `PENDIENTE`, `PAGADO`, `DESPACHADO`, `ENTREGADO`, `CANCELADO`)
*   `monto_total` (Decimal)
*   `monto_comision` (Decimal)
*   `comision_retenida` (Boolean, por defecto True)
*   `entrega_confirmada` (Boolean)
*   `fecha_creacion` (DateTime)
*   `fecha_actualizacion` (DateTime)

#### 4.8. Detalle del Pedido (`DetallePedido`)
*   `id` (PK, AutoIncrement)
*   `pedido` (FK a `Pedido`)
*   `producto` (FK a `Producto`)
*   `cantidad` (PositiveInteger)
*   `precio_unitario` (Decimal)

#### 4.9. Registro de Pago (`Pago`)
*   `id` (PK, AutoIncrement)
*   `pedido` (FK a `Pedido`)
*   `monto_pagado` (Decimal)
*   `pasarela_id` (Varchar, ID de Transacción Pasarela)
*   `fecha_pago` (DateTime)
*   `porcentaje_cobrado` (Decimal, ej: 50.00 o 100.00)

---

### 5. Requisitos del Sistema

#### 5.1. Requisitos Funcionales (RF)
*   **Gestión de Cuentas y Perfiles**: Registro y autenticación segura. Configuración de montos mínimos de compra para Empresas y gestión de calificación para Freelancers.
*   **Gestión de Catálogo e Inventarios**: Carga de productos por lote/mayorista. Monitoreo de stock con alertas visuales de "Stock Bajo".
*   **Flujo de Pedidos**: Compra directa por parte del tendero o registro de pedidos asistido por un vendedor freelance.
*   **Pagos y Comisiones**: Cobro adelantado (50% o 100%). Retención de la comisión del freelance hasta que el tendero confirme la entrega del producto.

#### 5.2. Requisitos No Funcionales (RNF)
*   **Diseño Premium y UX Simplificada**: Interfaz adaptada con el sistema visual de **ISBEN** (naranja, amarillo y tonalidades oscuras premium) que minimiza los clics del usuario final.
*   **Seguridad**: Encriptación de contraseñas mediante algoritmos seguros de Django y preparación para integración de pagos PCI-DSS.
*   **Consistencia de Datos**: Validaciones a nivel de base de datos para impedir compras por debajo del monto mínimo y evitar transacciones duplicadas sin stock disponible.

---

### 6. Matriz de Permisos por Rol

El sistema utiliza la siguiente matriz de accesos y operaciones:

| Módulo/Acción | Empresa (Proveedor) | Vendedor Freelance | Tendero (Cliente) | Admin. Plataforma |
| :--- | :---: | :---: | :---: | :---: |
| **Ver catálogo** | Sí | Sí | Sí | Sí |
| **Comprar / Hacer pedido** | No | Sí (Para terceros) | Sí | No |
| **Definir monto mínimo** | Sí | No | No | Sí |
| **Aprobar exámenes/tests** | Sí (Crea el test) | Sí (Rinde el test) | No | Sí |
| **Pagar suscripción/comisión** | Sí | No | No | Sí (Recibe pago) |
| **Confirmar entrega** | Sí (Despachador) | No | Sí | No |
| **Liberar Comisiones** | No | No | No | Sí (Acción Admin) |
