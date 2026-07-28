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
import styles from "./LandingPage.module.css";

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  onSelectRoleDemo: (role: "tendero" | "empresa" | "freelance" | "admin") => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isLoggedIn?: boolean;
  onGoToPortal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onSelectRoleDemo,
  theme,
  onToggleTheme,
  isLoggedIn = false,
  onGoToPortal,
}) => {
  return (
    <div className={styles.pageWrapper}>
      {/* Public Header Navigation Bar */}
      <header className={styles.publicHeader}>
        <div className={`container ${styles.headerContainer}`}>
          
          {/* Logo for Navigation Bar */}
          <div className={styles.logoArea}>
            <img
              src="/logos_2.png"
              alt="ISBEN Logo Barra Navegación"
              className={styles.logo}
              style={{ filter: theme === "dark" ? "brightness(1.2)" : "none" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logos_1.png";
              }}
            />
          </div>

          {/* Navigation Links */}
          <nav className={styles.navLinks}>
            <a href="#soluciones" className={styles.navLink}>Soluciones</a>
            <a href="#tenderos" className={styles.navLink}>Tenderos</a>
            <a href="#empresas" className={styles.navLink}>Empresas</a>
            <a href="#freelancers" className={styles.navLink}>Freelancers</a>
          </nav>

          {/* Right Action Controls */}
          <div className={styles.headerActions}>
            <button onClick={onToggleTheme} className={styles.themeBtn}>
              {theme === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
              {theme === "light" ? "Oscuro" : "Claro"}
            </button>

            {isLoggedIn ? (
              <button onClick={onGoToPortal} className={`btn btn-primary ${styles.ctaPrimary}`}>
                Ir al Portal
              </button>
            ) : (
              <>
                {onOpenRegister && (
                  <button onClick={onOpenRegister} className={styles.registerBtn}>
                    Registrarse
                  </button>
                )}
                <button onClick={onOpenLogin} className={`btn btn-primary`} style={{ padding: "8px 20px" }}>
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        
        {/* Background Gradient Aura */}
        <div className={styles.heroBg} />

        <div className={`container ${styles.heroContainer}`}>
          
          {/* Logo Centered with Glowing Halo */}
          <div className={styles.logoCenterWrap}>
            <div className="logo-glow-container">
              <img
                src="/logos_1.png"
                alt="ISBEN Logo Principal Centrado"
                style={{ maxHeight: "200px", width: "auto", objectFit: "contain", filter: theme === "dark" ? "brightness(1.2)" : "none" }}
                onError={(e) => { (e.target as HTMLImageElement).src = "/logos_2.png"; }}
              />
            </div>
          </div>

          <span className={`badge-clean badge-clean-primary ${styles.heroBadge}`}>
            <IconShieldCheck size={16} /> La Red Mayorista B2B &amp; B2C Integrada
          </span>
          <h1 className={styles.heroTitle}>
            Conectamos <span className={styles.heroTitleAccent}>Empresas, Freelancers y Tenderos</span> en una sola plataforma
          </h1>
          <p className={styles.heroSubtitle}>
            Simplificamos el comercio al por mayor: pedidos en pacas por mínimos clics, control de stock en tiempo real y comisiones automáticas sin fricción.
          </p>

          <div className={styles.heroCtas}>
            {isLoggedIn ? (
              <button onClick={onGoToPortal} className={`btn btn-primary ${styles.ctaPrimary}`}>
                Volver a la Plataforma <IconArrowRight size={18} />
              </button>
            ) : (
              <button onClick={onOpenLogin} className={`btn btn-primary ${styles.ctaPrimary}`}>
                Ingresar a la Plataforma <IconArrowRight size={18} />
              </button>
            )}
            <a href="#soluciones" className={`btn btn-outline ${styles.ctaOutline}`}>
              Descubrir Soluciones
            </a>
          </div>

          {/* Hero Visual Mockup */}
          <div className={`card-clean ${styles.mockupCard}`}>
            <div className={styles.browserBar}>
              <div className={styles.dotRed} />
              <div className={styles.dotYellow} />
              <div className={styles.dotGreen} />
              <span className={styles.browserUrl}>https://isben.com/marketplace</span>
            </div>
            
            <div className={styles.mockupGrid}>
              <div className={styles.mockupItem}>
                <IconStore size={28} color="var(--primary)" />
                <h4 className={styles.mockupItemTitle}>Modo Tendero</h4>
                <p className={styles.mockupItemDesc}>Botones táctiles y compra rápida.</p>
              </div>
              <div className={styles.mockupItem}>
                <IconFactory size={28} color="var(--secondary)" />
                <h4 className={styles.mockupItemTitle}>Panel Empresa</h4>
                <p className={styles.mockupItemDesc}>Gestión de stock, ERP y mínimos.</p>
              </div>
              <div className={styles.mockupItem}>
                <IconBriefcase size={28} color="var(--accent-teal)" />
                <h4 className={styles.mockupItemTitle}>Portal Freelance</h4>
                <p className={styles.mockupItemDesc}>Registro de ventas y comisiones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Solutions Pillars */}
      <section id="soluciones" className={styles.solutionsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Diseñado para cada Actor del Comercio Mayorista</h2>
            <p className={styles.sectionSubtitle}>Conoce las herramientas diseñadas para cada rol corporativo</p>
          </div>

          <div className={styles.cardsGrid}>
            
            {/* Card 1: Tendero */}
            <div id="tenderos" className={`card-clean ${styles.roleCard}`}>
              <div>
                <div className={styles.roleIconTendero}>
                  <IconStore size={26} />
                </div>
                <h3 className={styles.roleCardTitle}>Para Tenderos (Clientes)</h3>
                <p className={styles.roleCardDesc}>
                  Realiza pedidos al por mayor directamente a las fábricas. Sin intermediarios innecesarios, con montos mínimos claros ($60 - $80 USD) y confirmación transparente.
                </p>
              </div>
            </div>

            {/* Card 2: Empresa */}
            <div id="empresas" className={`card-clean ${styles.roleCard}`}>
              <div>
                <div className={styles.roleIconEmpresa}>
                  <IconFactory size={26} />
                </div>
                <h3 className={styles.roleCardTitle}>Para Empresas (Proveedores)</h3>
                <p className={styles.roleCardDesc}>
                  Publica tu catálogo mayorista, recibe alertas de stock bajo, conecta tu sistema contable ERP y certifica vendedores con evaluaciones especializadas.
                </p>
              </div>
            </div>

            {/* Card 3: Freelance */}
            <div id="freelancers" className={`card-clean ${styles.roleCard}`}>
              <div>
                <div className={styles.roleIconFreelance}>
                  <IconBriefcase size={26} />
                </div>
                <h3 className={styles.roleCardTitle}>Para Vendedores Freelance</h3>
                <p className={styles.roleCardDesc}>
                  Registra compras a nombre de tus clientes, gana comisiones calculadas automáticamente y mantenlas aseguradas hasta la entrega efectiva del producto.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>
          <div className={styles.footerBrand}>
            <img src="/logos_2.png" alt="ISBEN Logo" className={styles.footerLogo} onError={(e) => { (e.target as HTMLImageElement).src = "/logos_1.png"; }} />
            <span className={styles.footerCopyright}>© 2026 ISBEN Marketplace B2B/B2C. Todos los derechos reservados.</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Términos de Servicio</a>
            <a href="#" className={styles.footerLink}>Privacidad</a>
            <a href="#" className={styles.footerLink}>Contacto PCI-DSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
