"use client";

import React from "react";
import {
  IconStore,
  IconFactory,
  IconBriefcase,
  IconSun,
  IconMoon,
  IconArrowRight,
  IconShieldCheck
} from "@/components/Icons";

interface LandingPageProps {
  onOpenLogin: () => void;
  onSelectRoleDemo: (role: "tendero" | "empresa" | "freelance" | "admin") => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isLoggedIn?: boolean;
  onGoToPortal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onSelectRoleDemo,
  theme,
  onToggleTheme,
  isLoggedIn = false,
  onGoToPortal,
}) => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Public Header Navigation Bar (Uses logos_2.png) */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--bg-glass)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-color)",
          padding: "0.85rem 0"
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Logo 2 for Navigation Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img
              src="/logos_2.png"
              alt="ISBEN Logo Barra Navegación"
              style={{ height: "46px", objectFit: "contain", filter: theme === "dark" ? "brightness(1.2)" : "none" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logos_1.png";
              }}
            />
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="#soluciones" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Soluciones</a>
            <a href="#tenderos" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Tenderos</a>
            <a href="#empresas" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Empresas</a>
            <a href="#freelancers" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Freelancers</a>
          </nav>

          {/* Right Action Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={onToggleTheme}
              style={{
                background: "transparent",
                border: "1px solid var(--border-color)",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {theme === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
              {theme === "light" ? "Oscuro" : "Claro"}
            </button>

            {isLoggedIn ? (
              <button
                onClick={onGoToPortal}
                className="btn btn-primary"
                style={{ padding: "8px 20px" }}
              >
                Ir al Portal
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="btn btn-primary"
                style={{ padding: "8px 20px" }}
              >
                Iniciar Sesión
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section (Uses extra-large centered logos_1.png with enhanced ambient orange blur background) */}
      <section style={{ padding: "4rem 0 3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        
        {/* Background Wide Subtle Gradient Aura */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "750px",
            height: "450px",
            background: "radial-gradient(ellipse at center, var(--glow-orange) 0%, rgba(253, 77, 1, 0.08) 50%, rgba(253, 77, 1, 0) 75%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            zIndex: 0
          }}
        />

        <div className="container" style={{ maxWidth: "900px", position: "relative", zIndex: 1 }}>
          
          {/* Logo 1 Centered with Enhanced Glowing Ambient Orange Halo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <div className="logo-glow-container">
              <img
                src="/logos_1.png"
                alt="ISBEN Logo Principal Centrado"
                style={{ maxHeight: "200px", width: "auto", objectFit: "contain", filter: theme === "dark" ? "brightness(1.2)" : "none" }}
                onError={(e) => { (e.target as HTMLImageElement).src = "/logos_2.png"; }}
              />
            </div>
          </div>

          <span className="badge-clean badge-clean-primary" style={{ marginBottom: "1rem", padding: "6px 16px", fontSize: "0.85rem", gap: "6px" }}>
            <IconShieldCheck size={16} /> La Red Mayorista B2B & B2C Integrada
          </span>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.25rem", lineHeight: 1.15 }}>
            Conectamos <span style={{ color: "var(--primary)" }}>Empresas, Freelancers y Tenderos</span> en una sola plataforma
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Simplificamos el comercio al por mayor: pedidos en pacas por mínimos clics, control de stock en tiempo real y comisiones automáticas sin fricción.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            {isLoggedIn ? (
              <button onClick={onGoToPortal} className="btn btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1.05rem" }}>
                Volver a la Plataforma <IconArrowRight size={18} />
              </button>
            ) : (
              <button onClick={onOpenLogin} className="btn btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1.05rem" }}>
                Ingresar a la Plataforma <IconArrowRight size={18} />
              </button>
            )}
            <a href="#soluciones" className="btn btn-outline" style={{ padding: "0.9rem 2rem", fontSize: "1.05rem" }}>
              Descubrir Soluciones
            </a>
          </div>

          {/* Hero Visual Showcase Mockup */}
          <div
            className="card-clean"
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-xl)",
              background: "var(--bg-secondary)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border-color)",
              overflow: "hidden"
            }}
          >
            <div style={{ background: "var(--bg-tertiary)", padding: "0.75rem 1rem", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>https://isben.com/marketplace</span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", textAlign: "left" }}>
              <div style={{ background: "var(--bg-primary)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
                <IconStore size={28} color="var(--primary)" />
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.5rem" }}>Modo Tendero</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Botones táctiles y compra rápida.</p>
              </div>
              <div style={{ background: "var(--bg-primary)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
                <IconFactory size={28} color="var(--secondary)" />
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.5rem" }}>Panel Empresa</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Gestión de stock, ERP y mínimos.</p>
              </div>
              <div style={{ background: "var(--bg-primary)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
                <IconBriefcase size={28} color="var(--accent-teal)" />
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.5rem" }}>Portal Freelance</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Registro de ventas y comisiones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Solutions Pillars */}
      <section id="soluciones" style={{ padding: "4rem 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Diseñado para cada Actor del Comercio Mayorista</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Conoce las herramientas diseñadas para cada rol corporativo</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            
            {/* Card 1: Tendero */}
            <div id="tenderos" className="card-clean" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
              <div>
                <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", background: "rgba(253, 77, 1, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <IconStore size={26} />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>Para Tenderos (Clientes)</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  Realiza pedidos al por mayor directamente a las fábricas. Sin intermediarios innecesarios, con montos mínimos claros ($60 - $80 USD) y confirmación transparente.
                </p>
              </div>
            </div>

            {/* Card 2: Empresa */}
            <div id="empresas" className="card-clean" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
              <div>
                <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", background: "rgba(15, 23, 42, 0.1)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <IconFactory size={26} />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>Para Empresas (Proveedores)</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  Publica tu catálogo mayorista, recibe alertas de stock bajo, conecta tu sistema contable ERP y certifica vendedores con evaluaciones especializadas.
                </p>
              </div>
            </div>

            {/* Card 3: Freelance */}
            <div id="freelancers" className="card-clean" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
              <div>
                <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", background: "rgba(13, 148, 136, 0.1)", color: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <IconBriefcase size={26} />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>Para Vendedores Freelance</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  Registra compras a nombre de tus clientes, gana comisiones calculadas automáticamente y mantenlas aseguradas hasta la entrega efectiva del producto.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: "auto", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", padding: "2.5rem 0 1.5rem" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src="/logos_2.png" alt="ISBEN Logo" style={{ height: "36px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).src = "/logos_1.png"; }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>© 2026 ISBEN Marketplace B2B/B2C. Todos los derechos reservados.</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem" }}>
            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Términos de Servicio</a>
            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacidad</a>
            <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Contacto PCI-DSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
