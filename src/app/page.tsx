import React from "react";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Header */}
      <header className="glass-panel" style={{ margin: "1rem", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
            A
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.5px" }}>
            AURA <span style={{ color: "var(--primary)" }}>B2B</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", background: "var(--secondary-glow)", color: "var(--secondary)", fontWeight: 600 }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--secondary)", display: "inline-block" }}></span>
            Next.js Activo
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "-1.5px", marginBottom: "1rem" }}>
          El Futuro del Comercio Mayorista <br />
          <span className="gradient-accent" style={{ fontWeight: 800 }}>Inteligente y Sin Fricción</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 3rem auto" }}>
          Una plataforma unificada que empodera a empresas distribuidoras, potencia el trabajo de vendedores independientes y simplifica el abastecimiento de los comercios locales.
        </p>

        {/* Roles Grid */}
        <div className="grid-auto" style={{ marginTop: "2rem" }}>
          {/* Card 1: Empresas */}
          <div className="glass-panel glow-effect" style={{ padding: "2rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="10" width="20" height="12" rx="2" ry="2" />
                <path d="M12 22V10" />
                <path d="M17 22V14" />
                <path d="M7 22V14" />
                <path d="M2 14h20" />
                <path d="M20 10V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.3rem" }}>Empresas y Proveedores</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", flexGrow: 1 }}>
              Control total de inventario a gran escala. Configuración de montos mínimos de compra, publicación de catálogos mayoristas e integración automatizada con ERPs contables.
            </p>
            <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>Modulo RF2 y RF3.3 &rarr;</div>
          </div>

          {/* Card 2: Freelancers */}
          <div className="glass-panel glow-effect" style={{ padding: "2rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.3rem" }}>Vendedores Freelance</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", flexGrow: 1 }}>
              Generación de pedidos a nombre de terceros y cobro automatizado de comisiones garantizadas tras la entrega. Acceso a exámenes de validación para perfiles altamente calificados.
            </p>
            <div style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>Modulo RF1.3 y RF4 &rarr;</div>
          </div>

          {/* Card 3: Tenderos */}
          <div className="glass-panel glow-effect" style={{ padding: "2rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--secondary-glow)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.3rem" }}>Tenderos y Clientes</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", flexGrow: 1 }}>
              Interfaz simplificada con flujos optimizados de mínimos clics, diseñada para compras rápidas de lotes. Opciones de pago seguro (adelanto del 50% o 100%).
            </p>
            <div style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: 600 }}>Modulo RF3.1 y RNF2 &rarr;</div>
          </div>
        </div>
      </section>

      {/* Database & Architecture Status Section */}
      <section className="container" style={{ marginBottom: "4rem" }}>
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", borderLeft: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ color: "var(--primary)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem" }}>Arquitectura de la Solución</h2>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>
            El sistema se ha inicializado con un esqueleto limpio de <strong>Next.js (App Router)</strong>. La base de datos relacional elegida es <strong>PostgreSQL</strong> y la integración de datos se realizará mediante <strong>Prisma ORM</strong> para garantizar integridad referencial y prevención de ventas duplicadas.
          </p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            <div>
              <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Base de datos</span>
              <strong style={{ color: "var(--text-primary)" }}>PostgreSQL + Prisma</strong>
            </div>
            <div>
              <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Estilos</span>
              <strong style={{ color: "var(--text-primary)" }}>Vanilla CSS Custom Tokens</strong>
            </div>
            <div>
              <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Autenticación</span>
              <strong style={{ color: "var(--text-primary)" }}>NextAuth.js (En Cola)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "2rem", borderTop: "1px solid var(--border-glass)", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
        <p>&copy; {new Date().getFullYear()} Aura B2B Marketplace. Todos los derechos reservados.</p>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          Documentos del proyecto disponibles en local bajo la carpeta <code>docs/</code>
        </p>
      </footer>
    </main>
  );
}
