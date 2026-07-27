# ISBEN - Marketplace Mayorista Inteligente B2B & B2C

**ISBEN** es una plataforma web moderna de comercio al por mayor diseñada para agilizar y optimizar la relación comercial entre **Empresas Proveedoras**, **Vendedores Freelance** y **Comercios Locales (Tenderos)**.

---

## 🛠️ Pila Tecnológica (Stack)

* **Frontend**: Next.js (React 19) + **TypeScript**
* **Estilos**: **Vanilla CSS (CSS puro)** con un sistema de diseño premium, soporte nativo de modo claro/oscuro y diseño adaptable (responsive)
* **Iconografía**: Lucide React
* **Backend**: Django (Python) con base de datos SQLite y endpoints JSON sin fricciones

---

## ✨ Características Principales Implementadas

1. **Autenticación e Integración de Roles**:
   * Login conectado al backend de Django con redirección automática al panel del rol correspondiente: Tendero, Empresa, Vendedor Freelance o Administrador.
   * Persistencia de sesión mediante `localStorage` para mantener al usuario activo tras refrescar la página.

2. **Tienda y Checkout Mayorista (Tendero)**:
   * Carrito de compras interactivo con validación de monto mínimo de compra configurado en tiempo real.
   * Pasarela de pago nativa integrada (con modal de vidrio esmerilado de éxito/error).
   * Barra de progreso de stock para alertas de bajo inventario.

3. **Panel de Control de Proveedores (Empresa)**:
   * Configuración dinámica del monto mínimo de compra.
   * Panel de inventario para crear productos y definir imágenes personalizadas.
   * Gestor y creador de exámenes de certificación para freelancers.

4. **Portal del Freelancer**:
   * Catálogo rápido y simulador de pedidos para clientes.
   * Historial de comisiones ganadas y acumuladas.
   * Sistema de exámenes interactivo con preguntas de opción múltiple conectado al backend para registrar la aprobación.

5. **Panel del Administrador**:
   * Monitoreo en tiempo real del total de ventas, comisiones pagadas y cantidad de usuarios activos.

---

## 🚀 Instrucciones de Ejecución

### 1. Clonar el Repositorio
Abre tu terminal y ejecuta:
```bash
git clone https://github.com/Vic0318/proyecto_plataformas_web.git
cd proyecto_plataformas_web
```

### 2. Ejecutar el Frontend (Next.js)
1. Ingresa a la carpeta:
   ```bash
   cd frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre la URL en el navegador: [http://localhost:3000](http://localhost:3000)

### 3. Ejecutar el Backend (Django)
1. Abre otra terminal e ingresa a la carpeta:
   ```bash
   cd backend
   ```
2. Activa el entorno virtual:
   * **Windows**: `venv\Scripts\activate`
   * **Mac/Linux**: `source venv/bin/activate`
3. Inicia el servidor:
   ```bash
   python manage.py runserver
   ```
4. El backend estará activo en: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 👥 Cuentas de Demostración Disponibles

Para facilitar la evaluación, utiliza estas credenciales (se auto-pueblan en la base de datos):

| Rol de Usuario | Nombre de Usuario | Correo Electrónico | Contraseña Común |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin_isben` | `admin@isben.com` | `admin123` o la configurada |
| **Empresa (Proveedor)** | `empresa_isben` | `proveedor@isben.com` | `proveedor123` |
| **Vendedor Freelance** | `carlos_freelance` | `carlos.vendedor@freelance.com` | `freelancer123` |
| **Tendero (Cliente)** | `don_pepe` | `donpepe@tiendita.com` | `tendero123` |

---

## 🔌 API Endpoints Habilitados (`/api/`)

* `POST /api/login/` - Autenticación de usuarios y mapeo de roles.
* `GET /api/productos/` - Listar productos (se auto-pueblan productos por defecto si la BD está vacía).
* `POST /api/productos/` - Creación de nuevos productos con soporte de imagen personalizada.
* `GET /api/pedidos/` - Listar transacciones históricas filtradas por usuario.
* `POST /api/pedidos/` - Registrar compra, descontar stock de producto y calcular comisión.
* `GET /api/min-order/` - Consultar monto mínimo de compra.
* `POST /api/min-order/` - Actualizar monto mínimo de compra.
* `GET /api/tests/` - Listar exámenes de certificación y estado del freelancer.
* `POST /api/tests/` - Crear nuevas pruebas desde el panel de empresa.
* `POST /api/tests/take/` - Registrar la aprobación de un examen por el freelancer.

---

## 📁 Estructura General de Carpetas

```
proyecto_plataformas_web/
├── backend/            # Proyecto Django (Base de datos SQLite y APIs)
│   ├── backend_project/
│   └── marketplace/    # Modelos, vistas y lógica comercial
├── frontend/           # Proyecto Next.js (TypeScript y CSS Vanilla)
│   ├── src/
│   │   ├── app/        # Rutas principales y estilos globales
│   │   └── components/ # Componentes (TenderoView, EmpresaDashboard, FreelancePortal, etc.)
│   └── public/         # Assets e imágenes
└── docs/               # Documentación y requisitos del proyecto
```
