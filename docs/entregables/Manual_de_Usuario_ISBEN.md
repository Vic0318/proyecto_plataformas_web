# Manual de Usuario
## Proyecto: Plataforma Digital de Vendedores Colaborativos ISBEN

Este manual explica detalladamente cómo navegar y operar las funciones disponibles en la versión actual del prototipo de la plataforma digital **ISBEN B2B/B2C**.

---

### 1. Introducción a la Plataforma
La plataforma **ISBEN** está diseñada para simplificar el proceso de distribución y venta al por mayor. Cuenta con una arquitectura en donde:
1.  **Frontend (Next.js)**: Sirve como la cara visible e interactiva de la marca, diseñada con el lenguaje visual oficial de ISBEN.
2.  **Panel de Administración (Django Admin)**: Actúa como el centro de control operativo del prototipo donde se gestionan los usuarios, inventarios, exámenes de calificación, pedidos y comisiones.

---

### 2. Guía Visual y Colorometría (Identidad ISBEN)
La interfaz del sistema sigue rigurosamente la guía de marca de **ISBEN** para brindar una experiencia de usuario premium, coherente y de alta legibilidad:
*   **Color Primario (Naranja ISBEN - `#fd4d01`)**: Utilizado para elementos de navegación principal, logotipos, botones de acciones primarias e indicadores de estado activos.
*   **Color Secundario (Amarillo ISBEN - `#feca04`)**: Utilizado para estados de alerta, confirmaciones y secciones asociadas a comisiones de ventas.
*   **Contraste Premium**: La aplicación utiliza fondos oscuros refinados (`#0a0c10` a `#1a1f2e`) con paneles de efecto vidrio (glassmorphism) que garantizan que el texto y los logotipos resalten, facilitando la lectura para personas de cualquier edad.

---

### 3. Roles de Usuario y Operaciones del Sistema

El prototipo actual cuenta con cuatro roles configurados con sus respectivos permisos:

#### 3.1. Administrador de Plataforma (Admin)
Es el usuario que gestiona todo el sistema a través del panel de administración `/admin/`.

**Operaciones Clave**:
1.  **Gestión de Usuarios**: Puede crear, modificar y eliminar cuentas de Empresas, Vendedores Freelance y Tenderos.
2.  **Operaciones Rápidas de Inventario (Acción Personalizada)**:
    *   En la sección *Productos*, el administrador puede seleccionar múltiples productos y aplicar la acción **"Reabastecer stock (+50 unidades)"** con un solo clic.
3.  **Procesamiento de Pedidos (Acción Personalizada)**:
    *   **Marcar como Despachado**: Permite cambiar el estado de los pedidos seleccionados para indicar que han salido de bodega.
    *   **Confirmar Entrega y Liberar Comisión**: Acción crítica que cambia el estado a *Entregado*, marca la entrega como confirmada y libera la comisión retenida del vendedor freelance automáticamente, asegurando que solo se pague por ventas efectivas y entregadas.

#### 3.2. Empresa (Proveedor)
Representa a los distribuidores de productos que proveen el catálogo.

**Operaciones Clave**:
1.  **Configurar Perfil**: Define el nombre comercial y el **monto mínimo de compra** (ej: entre $60 y $80) que los clientes deben cumplir para poder procesar un pedido.
2.  **Gestión de Catálogo**: Sube nuevos productos mayoristas con su respectivo precio, stock y el *umbral de stock bajo*. Si el stock cae por debajo de este umbral, el sistema mostrará una alerta visual roja de stock bajo (⚠️).
3.  **Creación de Exámenes**: Define cuestionarios o cursos de certificación para que los vendedores freelance puedan certificarse y vender productos calificados.

#### 3.3. Vendedor Freelance
Vendedor colaborativo que trabaja bajo esquema de comisiones.

**Operaciones Clave**:
1.  **Visualizar Catálogo**: Consulta los productos de las empresas proveedoras.
2.  **Rendir Exámenes**: Realiza los exámenes creados por las empresas para obtener la certificación de "Vendedor Calificado".
3.  **Registrar Pedidos**: Registra ventas y pedidos a nombre de sus clientes (tenderos) locales.
4.  **Monitorear Comisiones**: Puede ver el estado de sus comisiones, las cuales permanecerán en estado *retenido* (comisión retenida = True) hasta que se confirme la entrega física de la mercancía.

#### 3.4. Tendero (Cliente final)
Comerciante local que se abastece de la plataforma.

**Operaciones Clave**:
1.  **Compra Directa**: Puede ingresar a la plataforma, armar su carrito con productos de los proveedores y finalizar el pedido directamente.
2.  **Control de Monto Mínimo**: El sistema valida automáticamente que el total de su compra supere el límite establecido por el proveedor (por ejemplo, $60). Si no se supera, el sistema bloquea el pedido impidiendo que se registre en base de datos.
3.  **Pago Parcial o Total**: Permite procesar abonos del 50% o el pago total del 100% de la mercancía a través del flujo transaccional.
4.  **Confirmación de Entrega**: Una vez recibe el pedido en su negocio, interactúa con el sistema para confirmar la recepción del producto.

---

### 4. Instrucciones para Ejecutar y Probar el Prototipo

Para iniciar la solución de manera local, sigue los pasos descritos a continuación:

#### 4.1. Ejecutar el Backend (Django)
1.  Abre una terminal en la carpeta `proyecto_plataformas_web/backend`.
2.  Activa el entorno virtual:
    *   *Windows*: `venv\Scripts\activate`
3.  Ejecuta las migraciones si es necesario: `python manage.py migrate`
4.  Crea un superusuario para probar el rol de Admin: `python manage.py createsuperuser`
5.  Inicia el servidor backend: `python manage.py runserver`
6.  Accede a `http://127.0.0.1:8000/admin/` con las credenciales creadas.

#### 4.2. Ejecutar el Frontend (Next.js)
1.  Abre otra terminal en la carpeta raíz `proyecto_plataformas_web`.
2.  Instala las dependencias (si no se ha hecho): `npm install`
3.  Inicia el servidor de desarrollo: `npm run dev`
4.  Abre en tu navegador la dirección `http://localhost:3000`. Verás la landing page con la identidad visual oficial de **ISBEN** y la arquitectura de roles integrada.
