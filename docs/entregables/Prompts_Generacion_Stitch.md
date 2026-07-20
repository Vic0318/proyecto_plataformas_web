# Guía de Prompts para Google Stitch
## Proyecto: Plataforma Digital de Vendedores Colaborativos ISBEN

Esta guía contiene los prompts listos para ser copiados y pegados en **Google Stitch** para generar los diseños de las interfaces. Todos los prompts incorporan la **nueva colorometría de ISBEN** (naranja, amarillo-dorado y fondos oscuros premium), el estilo de tarjetas con efecto vidrio (glassmorphism) y las pautas de UX optimizadas según el rol.

---

### 🎨 Paleta de Colores y Estilo Visual Común (Colorometría ISBEN)
Para todas las pantallas, Google Stitch debe aplicar las siguientes directrices visuales:
*   **Fondo de Pantalla**: Oscuro premium (tonos pizarra/azul marino muy oscuro, `#0a0c10` a `#121620`).
*   **Paneles y Tarjetas**: Efecto de vidrio (glassmorphism) con fondo translúcido (`rgba(18, 22, 32, 0.7)`), bordes sutiles semi-transparentes y esquinas redondeadas.
*   **Color de Acento Primario (Naranja ISBEN - `#fd4d01`)**: Utilizado en botones de acción principales (CTA), bordes de enfoque, estados activos y elementos destacados.
*   **Color de Acento Secundario (Amarillo ISBEN - `#feca04`)**: Utilizado para métricas secundarias (comisiones, progreso, alertas).
*   **Tipografía**: Moderna y limpia (sans-serif, de preferencia *Plus Jakarta Sans* y *Outfit*), con excelente legibilidad y altos contrastes.

---

### 1. Prompt: Landing Page (Página de Inicio General)
> **Prompt para Google Stitch:**
> "Design a modern, premium landing page for 'ISBEN B2B/B2C Marketplace', a smart wholesale collaborative distribution platform. The visual style must use a dark premium theme (slate-navy background #0a0c10) with glassmorphism panels. The primary brand color is a vibrant orange-red (#fd4d01) for active states and CTA buttons, and the secondary color is a gold-yellow (#feca04).
> The page should feature a clean header with the ISBEN logo (orange and white) and a status tag 'Next.js Active'. The hero section should display the title 'Distribución Inteligente de Productos - Plataforma Digital de Vendedores Colaborativos' in high-contrast typography with a subtle orange gradient.
> Below the hero, show a responsive grid with 3 highlight cards for the user roles:
> 1. 'Empresas y Proveedores' (with a warehouse icon and details about catalog management and minimum purchase limits).
> 2. 'Vendedores Freelance' (with a briefcase icon and details about commissions and certification exams).
> 3. 'Tenderos y Clientes' (with a shopping cart icon, big buttons, and details about simple wholesale purchasing).
> The footer should include a copyright notice and a small logo link."

---

### 2. Prompt: Pantalla de Login y Registro de Roles
> **Prompt para Google Stitch:**
> "Design a high-fidelity sign-in/sign-up screen for the ISBEN wholesale platform. The background is a clean dark navy (#0a0c10). The center features a translucent glassmorphic login card.
> Inside the card, display the ISBEN branding logo on top. Below it, place the login form fields (Username/Email and Password) with thin borders that glow orange (#fd4d01) when active.
> Before the 'Ingresar' action button, include a modern selector using 3 large card options for the user to choose their profile/role: 'Empresa', 'Vendedor Freelance', and 'Tendero (Cliente)'. Each role card should have an icon and label. When selected, the card border highlights in vibrant orange (#fd4d01).
> The primary 'Ingresar' button must be large, high-contrast, rounded, and colored in solid ISBEN orange-red (#fd4d01) with white text. Provide a subtle link below for 'Registrarse' or 'Recuperar contraseña' in gold-yellow (#feca04)."

---

### 3. Prompt: Catálogo de Productos (Vista del Tendero / Comercio Local)
> **Prompt para Google Stitch:**
> "Design a simplified, high-contrast product catalog interface for local store owners (Tenderos), optimized for users with low digital literacy. Use a premium dark theme. The layout consists of a top navigation bar showing the ISBEN logo and a search bar.
> Below the header, show a prominent visual progress bar in gold-yellow (#feca04) showing: 'Progreso para pedido mínimo: $45 / $60'.
> Below, display a grid of product cards. Each card represents a wholesale product lot and must have:
> - A product image placeholder.
> - Title in clear white text (e.g., 'Lote de Aceite 1L x 12 unidades').
> - Large, bold price (e.g., '$18.50').
> - A red warning badge saying '⚠️ Stock Bajo (5)' if the stock is low.
> - A simplified quantity selector with large '+' and '-' buttons, and a huge orange-red (#fd4d01) 'Agregar' button that is very easy to tap.
> The layout must look extremely clean, minimizing visual noise, with high contrast and large text."

---

### 4. Prompt: Carrito y Pantalla de Pago (Checkout Simplificado)
> **Prompt para Google Stitch:**
> "Design a simplified checkout and cart summary screen for the ISBEN marketplace. Dark theme with glassmorphic containers. 
> The left column lists the selected items in the cart with clear quantities, unit prices, and a quick trash/delete icon. 
> The right column contains a summary card with:
> - Subtotal and Taxes.
> - Total Amount (e.g., '$120.00').
> - A prominent payment option selector showing two large tap-to-select panels:
>   1. 'Pagar 50% Adelantado' (ideal for store owners to secure the order).
>   2. 'Pagar 100% Total'.
>   Each panel should show the exact calculated amount (e.g., '$60.00' or '$120.00') in large yellow-gold text (#feca04).
> The main action button 'Confirmar y Pagar' must be a full-width, solid orange-red (#fd4d01) button with white text and a security lock icon. Include PCI-DSS security badges (Stripe, Visa, Mastercard) at the bottom."

---

### 5. Prompt: Dashboard del Vendedor Freelance (Comisiones y Ventas)
> **Prompt para Google Stitch:**
> "Design a premium dashboard interface for the Freelance Seller role in the ISBEN marketplace. Premium dark background with glassmorphism.
> On top, display 3 key metric cards with glass effects and subtle borders:
> 1. 'Ventas Totales' (with a chart icon).
> 2. 'Comisiones Retenidas' (shown in gold-yellow #feca04, indicating pending delivery).
> 3. 'Comisiones Liberadas' (shown in green or vibrant orange #fd4d01, ready for payout).
> Below the metrics, display two main columns:
> - Left Column: 'Mis Pedidos Registrados' showing a list of recent orders made on behalf of local stores, with customer name, total price, and shipping status (e.g., 'Despachado', 'Pendiente de Pago', 'Entregado').
> - Right Column: 'Mis Certificaciones y Exámenes' showing a list of supplier companies, their certification status (e.g., 'Certificado', 'Pendiente'), and a large button 'Rendir Examen' in orange-red (#fd4d01) to take tests for high-value product sales."

---

### 6. Prompt: Pantalla de Examen de Certificación (Vendedor Freelance)
> **Prompt para Google Stitch:**
> "Design an interactive, clean interface for a certification test taken by a freelance seller. Dark theme with glassmorphic cards.
> At the top, show a progress indicator (e.g., 'Pregunta 3 de 10') and a countdown timer in gold-yellow (#feca04).
> In the center, a large card contains the question: '¿Cuál es la temperatura de almacenamiento recomendada para productos farmacéuticos de cadena de frío?'.
> Below the question, display 4 large, clickable multiple-choice options with rounded corners. The options have transparent backgrounds. When hovered or selected, the option highlights with a solid ISBEN orange-red (#fd4d01) border and a soft glow.
> At the bottom, show 'Anterior' and 'Siguiente' navigation buttons. The 'Siguiente' button is a solid orange-red (#fd4d01) button, while the 'Anterior' button is outlined."

---

### 7. Prompt: Panel de la Empresa Proveedora (Gestión de Productos)
> **Prompt para Google Stitch:**
> "Design an administration dashboard for the Supplier/Company role in the ISBEN platform. Dark theme with glassmorphism.
> A left sidebar navigation includes links to: 'Catálogo de Productos', 'Pedidos Recibidos', 'Configuración de Monto Mínimo', and 'Suscripción'.
> In the main area, display a header 'Gestión de Catálogo Mayorista' with a prominent button '+ Agregar Producto' in vibrant orange-red (#fd4d01).
> Below, display a table of current products with columns: Image, Product Name, Wholesale Price, Stock, Alert Threshold, and Actions (Edit/Delete). If stock is below the threshold, highlight the stock cell in solid red with a warning icon.
> On the right, include a quick settings card to configure the 'Monto Mínimo de Compra' with an input field (defaulting to e.g., $60.00) and a 'Guardar Configuración' button in gold-yellow (#feca04)."

---

### 8. Prompt: Panel de Administración de la Plataforma (Superusuario)
> **Prompt para Google Stitch:**
> "Design the main platform admin panel (Superuser/Staff) for ISBEN. Premium dark slate theme.
> Show a top row of summary widgets: Total Users, Total Active Companies, Monthly Transactions, and Retained Commission Pool.
> The main view displays an 'Auditoría de Pedidos' table. For each row (Order ID, Store Name, Supplier, Total Amount, Commission, Status), show action buttons to manage the workflow:
> - A button 'Marcar Despachado' (subtle border action).
> - A major action button 'Confirmar Entrega y Liberar Comisión' styled in solid orange-red (#fd4d01) with white text, representing the critical transaction that pays the freelancer.
> The interface should feel highly administrative and reliable, with clear status badges ('PENDIENTE', 'DESPACHADO', 'ENTREGADO') colored dynamically."
