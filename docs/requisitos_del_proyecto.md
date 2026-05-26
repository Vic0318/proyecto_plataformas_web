# Especificación de Requisitos del Proyecto

Este documento detalla los requisitos funcionales, no funcionales y la matriz de permisos para la plataforma web del Marketplace B2B/B2C.

## Requisitos Funcionales (RF)

Estos son los procesos y acciones específicas que la aplicación web debe permitir realizar a los distintos tipos de usuarios (Empresas, Vendedores Freelance, Tenderos/Clientes y Administradores).

### 1. Gestión de Usuarios y Roles
- **RF1.1:** El sistema debe permitir el registro y autenticación de diferentes roles de usuario: Administrador de Plataforma, Empresa (Proveedor), Vendedor Freelance y Tendero (Cliente).
- **RF1.2:** El sistema debe permitir a las empresas configurar el perfil de vendedor que necesitan (perfil general o perfil calificado).
- **RF1.3:** El sistema debe incluir un módulo de validación/certificación (tests o cursos) para los vendedores freelance que deseen aplicar a empresas con "perfiles calificados" (ej. farmacéuticas).

### 2. Catálogo e Inventario
- **RF2.1:** El sistema debe mostrar un catálogo de productos orientados a la venta al por mayor (pacas, lotes).
- **RF2.2:** El sistema debe reflejar el nivel de stock disponible de los productos.
- **RF2.3:** El sistema debe generar alertas automáticas cuando un producto alcance un nivel bajo de stock.
- **RF2.4:** El sistema debe permitir la integración de inventarios con los sistemas contables o ERPs propios de las empresas.

### 3. Gestión de Pedidos y Ventas
- **RF3.1:** El sistema debe permitir a los Tenderos hacer pedidos directos a las Empresas sin intervención de un vendedor freelance.
- **RF3.2:** El sistema debe permitir a los Vendedores Freelance registrar pedidos a nombre de los clientes/tenderos.
- **RF3.3:** El sistema debe permitir a las empresas configurar montos mínimos de compra (ej. $60 a $80 dólares).
- **RF3.4:** El sistema debe generar facturación automática detallada por cada pedido realizado.

### 4. Pagos y Comisiones
- **RF4.1:** El sistema debe integrar una pasarela de pagos que permita el cobro por adelantado del 50% o 100% del valor del pedido.
- **RF4.2:** El sistema debe calcular automáticamente la comisión del vendedor freelance basada en los márgenes de ganancia establecidos por la empresa.
- **RF4.3:** El sistema debe retener el pago de la comisión del vendedor hasta que exista una confirmación explícita de que el producto fue entregado al cliente.

### 5. Monetización de la Plataforma
- **RF5.1:** El sistema debe tener un módulo de facturación interna para cobrar a las empresas, ya sea mediante una suscripción anual o aplicando un porcentaje de comisión por transacción (ej. 2%).

---

## Requisitos No Funcionales (RNF)

Estos requisitos definen los atributos de calidad, restricciones técnicas y el entorno del sistema.

### 1. Plataforma y Arquitectura
- **RNF1.1:** El sistema se desarrollará y desplegará exclusivamente como una aplicación web en su primera fase (no habrá desarrollo de aplicación móvil nativa todavía).
- **RNF1.2:** La arquitectura debe estar diseñada con capacidades de integración mediante APIs o Microservicios para conectarse de manera fluida con los sistemas contables externos de las empresas.

### 2. Usabilidad (UX/UI)
- **RNF2.1:** La interfaz de usuario debe ser extremadamente intuitiva, clara y con botones grandes, considerando que el usuario final (tendero) puede tener un perfil demográfico de mayor edad y bajo conocimiento tecnológico ("analfabeto digital").
- **RNF2.2:** El flujo de compra debe minimizarse a la menor cantidad de clics posibles para reducir la fricción y el margen de error en los pedidos.

### 3. Seguridad
- **RNF3.1:** El sistema debe garantizar la seguridad de los datos financieros al procesar tarjetas de crédito, cumpliendo con los estándares de encriptación actuales (ej. certificación PCI-DSS a través de la pasarela de pagos).
- **RNF3.2:** Las contraseñas de los usuarios deben almacenarse de forma encriptada (hashing).

### 4. Rendimiento y Escalabilidad
- **RNF4.1:** Las actualizaciones de stock deben reflejarse casi en tiempo real para evitar que dos usuarios compren el mismo lote de productos si solo queda uno disponible.
- **RNF4.2:** La base de datos (sea relacional o no relacional) debe diseñarse pensando en la futura escalabilidad hacia un entorno móvil.

---

## Matriz de Permisos por Rol

Esta tabla resume cómo interactúa cada rol con las funciones principales del sistema:

| Módulo/Acción | Empresa (Proveedor) | Vendedor Freelance | Tendero (Cliente) | Admin. Plataforma |
| :--- | :---: | :---: | :---: | :---: |
| **Ver catálogo** | ✔️ | ✔️ | ✔️ | ✔️ |
| **Comprar / Hacer pedido** | ❌ | ✔️ (Para terceros) | ✔️ | ❌ |
| **Definir monto mínimo** | ✔️ | ❌ | ❌ | ✔️ |
| **Aprobar exámenes/tests** | ✔️ (Crea el test) | ✔️ (Rinde el test) | ❌ | ✔️ |
| **Pagar suscripción/comisión** | ✔️ | ❌ | ❌ | ✔️ (Recibe pago) |
| **Confirmar entrega** | ✔️ (Despachador) | ❌ | ✔️ | ❌ |
