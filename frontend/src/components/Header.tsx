"use client";

import React, { useState } from "react";
import {
  IconShoppingCart,
  IconSun,
  IconMoon,
  IconLogOut,
  IconStore,
  IconChevronDown,
  IconSettings,
  IconList
} from "@/components/Icons";

interface HeaderProps {
  currentRole: "tendero" | "empresa" | "freelance" | "admin";
  username: string;
  onLogout: () => void;
  onGoHome: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  cartCount: number;
  cartTotal: number;
  minOrder: number;
  onOpenCart: () => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  username,
  onLogout,
  onGoHome,
  theme,
  onToggleTheme,
  cartCount,
  cartTotal,
  minOrder,
  onOpenCart,
  onOpenSettings,
  onOpenHistory,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMinOrderReached = cartTotal >= minOrder;
  const progressPercent = Math.min(100, Math.round((cartTotal / minOrder) * 100));

  const roleLabel = {
    tendero: "Portal Tendero",
    empresa: "Portal Empresa",
    freelance: "Portal Freelance",
    admin: "Portal Administrador",
  }[currentRole];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.75rem 0"
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Brand & Logo 2 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={onGoHome}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <img
              src="/logos_2.png"
              alt="ISBEN Logo"
              style={{ height: "44px", objectFit: "contain", filter: theme === "dark" ? "brightness(1.2)" : "none" }}
              onError={(e) => { (e.target as HTMLImageElement).src = "/logos_1.png"; }}
            />
          </button>
          <span className="badge-clean badge-clean-neutral" style={{ fontSize: "0.75rem" }}>
            {roleLabel}
          </span>
        </div>

        {/* Right Navigation & User Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          
          {/* Tendero Cart Button */}
          {currentRole === "tendero" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: "110px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: isMinOrderReached ? "var(--accent-teal)" : "var(--accent-amber)" }}>
                  {isMinOrderReached ? "Mínimo alcanzado" : `Faltan $${Math.max(0, minOrder - cartTotal)}`}
                </span>
                <div style={{ width: "100%", height: "4px", background: "var(--bg-tertiary)", borderRadius: "10px", overflow: "hidden", marginTop: "2px" }}>
                  <div style={{ width: `${progressPercent}%`, height: "100%", background: isMinOrderReached ? "var(--accent-teal)" : "var(--accent-amber)", transition: "width 0.3s" }} />
                </div>
              </div>

              <button onClick={onOpenCart} className="btn btn-primary" style={{ padding: "6px 14px", borderRadius: "var(--radius-md)", gap: "6px" }}>
                <IconShoppingCart size={16} /> Pedido
                <span style={{ background: "#fff", color: "var(--primary)", borderRadius: "10px", padding: "1px 6px", fontSize: "0.75rem", fontWeight: 800 }}>
                  {cartCount}
                </span>
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            style={{
              background: "transparent",
              border: "1px solid var(--border-color)",
              padding: "6px 10px",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "0.85rem",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center"
            }}
          >
            {theme === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
          </button>

          {/* SaaS Avatar & User Dropdown Menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                padding: "4px 10px 4px 6px",
                borderRadius: "var(--radius-full)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary)", color: "#fff", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {username.charAt(0)}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {username}
              </span>
              <IconChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Floating Dropdown */}
            {isDropdownOpen && (
              <div
                className="card-clean"
                style={{
                  position: "absolute",
                  top: "120%",
                  right: 0,
                  width: "220px",
                  padding: "0.5rem",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 200
                }}
              >
                <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border-color)", marginBottom: "0.25rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{username}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{roleLabel}</div>
                </div>

                <button
                  onClick={() => { setIsDropdownOpen(false); onGoHome(); }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    background: "transparent",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <IconStore size={16} /> Ir a Página de Inicio
                </button>

                <button
                  onClick={() => { setIsDropdownOpen(false); onOpenSettings?.(); }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    background: "transparent",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <IconSettings size={16} /> Configuración
                </button>

                <button
                  onClick={() => { setIsDropdownOpen(false); onOpenHistory?.(); }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    background: "transparent",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <IconList size={16} /> Historial y Reportes
                </button>

                <button
                  onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    background: "transparent",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--danger)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <IconLogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
