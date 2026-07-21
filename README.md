# ISBEN - Marketplace Mayorista Inteligente

**ISBEN** es una plataforma web de comercio al por mayor (B2B/B2C) diseñada para agilizar y optimizar la relación comercial entre **Empresas Proveedoras**, **Vendedores Freelance** y **Comercios Locales (Tenderos)**.

---

## 🛠️ Pila Tecnológica (Stack)

- **Frontend**: [Next.js](https://nextjs.org/) (React 19) + **TypeScript**
- **Estilos**: **Vanilla CSS (CSS puro)** con variables globales para diseño adaptativo y soporte de modo claro/oscuro
- **Iconografía**: Lucide React
- **Backend (Python)**: [Django](https://www.djangoproject.com/) (ubicado en la carpeta `/backend`) con base de datos SQLite

---

## 🚀 Instrucciones para Abrir y Ejecutar el Proyecto

Sigue estos pasos en tu computadora si acabas de clonar el repositorio:

### 1. Requisitos Previos
Asegúrate de tener instalado en tu computadora:
- **Node.js** (versión 18.x o superior recomendada): [Descargar Node.js](https://nodejs.org/)
- **Git**: [Descargar Git](https://git-scm.com/)
- *(Opcional)* **Python 3.10+** (solo necesario si deseas ejecutar el servidor backend de Django).

---

### 2. Clonar el Repositorio
Abre tu terminal (Command Prompt, PowerShell o Git Bash) y ejecuta:

```bash
git clone https://github.com/Vic0318/proyecto_plataformas_web.git
cd proyecto_plataformas_web
```

---

### 3. Ejecutar el Frontend (Next.js)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   Ingresa a [http://localhost:3000](http://localhost:3000) en tu navegador web.

---

### 4. (Opcional) Ejecutar el Backend (Django)

Si requieres ejecutar los servicios de API o administración del backend en Python:

1. Ingresa a la carpeta del backend:
   ```bash
   cd backend
   ```
2. *(Opcional)* Activa el entorno virtual existente o crea uno nuevo:
   - **Windows:**
     ```powershell
     venv\Scripts\activate
     ```
   - **Mac / Linux:**
     ```bash
     source venv/bin/activate
     ```
3. Ejecuta el servidor de Django:
   ```bash
   python manage.py runserver
   ```
4. El servidor backend estará activo en `http://127.0.0.1:8000/`.

---

## 👥 Roles de Usuario Disponibles en la Demo

Dentro de la aplicación puedes interactuar con los siguientes roles del sistema:

- 🛒 **Tendero (Cliente)**: Explora el catálogo mayorista, agrega productos al carrito y valida compras según el pedido mínimo configurado.
- 🏢 **Empresa (Proveedor)**: Gestiona catálogo de productos, monitorea niveles de stock/inventario y define reglas comerciales.
- 💼 **Vendedor Freelance**: Revisa empresas con perfiles calificados, comisiones asociadas y tests de certificación.
- ⚡ **Administrador**: Vista global de métricas del sistema, usuarios registrados e historial de transacciones.

---

## 📁 Estructura del Proyecto

```
proyecto_plataformas_web/
├── backend/            # Proyecto Django (API backend, base de datos SQLite)
├── docs/               # Documentación técnica, requisitos y planes
├── public/             # Assets e imágenes estáticas (Logos de ISBEN)
├── src/
│   ├── app/            # Next.js App Router (layout.tsx, globals.css, page.tsx)
│   └── components/     # Componentes de la interfaz de usuario
├── package.json        # Configuración del proyecto y dependencias
└── README.md           # Guía principal del proyecto
```

---

## 📄 Licencia y Documentación Adicional
Puedes encontrar más detalles sobre los requisitos y el plan de implementación en la carpeta [`docs/`](docs/):
- [Especificación de Requisitos](docs/requisitos_del_proyecto.md)
- [Plan de Implementación](docs/plan_de_implementacion.md)
