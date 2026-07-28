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
import styles from "./Header.module.css";

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
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        
        {/* Brand & Logo */}
        <div className={styles.brandArea}>
          <button onClick={onGoHome} className={styles.logoBtn}>
            <img
              src="/logos_2.png"
              alt="ISBEN Logo"
              className={styles.logo}
              style={{ filter: theme === "dark" ? "brightness(1.2)" : "none" }}
              onError={(e) => { (e.target as HTMLImageElement).src = "/logos_1.png"; }}
            />
          </button>
          <span className="badge-clean badge-clean-neutral" style={{ fontSize: "0.75rem" }}>
            {roleLabel}
          </span>
        </div>

        {/* Right Navigation & User Dropdown */}
        <div className={styles.navRight}>
          
          {/* Tendero Cart Button */}
          {currentRole === "tendero" && (
            <div className={styles.cartSection}>
              <div className={styles.cartProgress}>
                <span className={`${styles.cartProgressLabel} ${isMinOrderReached ? styles.reached : styles.notReached}`}>
                  {isMinOrderReached ? "Mínimo alcanzado" : `Faltan $${Math.max(0, minOrder - cartTotal)}`}
                </span>
                <div className={styles.progressBarTrack}>
                  <div
                    className={`${styles.progressBarFill} ${isMinOrderReached ? styles.reached : styles.notReached}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button onClick={onOpenCart} className={`btn btn-primary ${styles.cartBtn}`} style={{ padding: "6px 14px", borderRadius: "var(--radius-md)", gap: "6px" }}>
                <IconShoppingCart size={16} /> Pedido
                <span className={styles.cartBadge}>{cartCount}</span>
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button onClick={onToggleTheme} className={styles.themeBtn}>
            {theme === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
          </button>

          {/* SaaS Avatar & User Dropdown Menu */}
          <div className={styles.avatarWrapper}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={styles.avatarBtn}
            >
              <div className={styles.avatarInitial}>
                {username.charAt(0)}
              </div>
              <span className={styles.avatarName}>{username}</span>
              <IconChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Floating Dropdown */}
            {isDropdownOpen && (
              <div className={`card-clean ${styles.dropdown}`}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownUserName}>{username}</div>
                  <div className={styles.dropdownRole}>{roleLabel}</div>
                </div>

                <button
                  onClick={() => { setIsDropdownOpen(false); onGoHome(); }}
                  className={styles.dropdownItem}
                >
                  <IconStore size={16} /> Ir a Página de Inicio
                </button>

                <button
                  onClick={() => { setIsDropdownOpen(false); onOpenSettings?.(); }}
                  className={styles.dropdownItem}
                >
                  <IconSettings size={16} /> Configuración
                </button>

                <button
                  onClick={() => { setIsDropdownOpen(false); onOpenHistory?.(); }}
                  className={styles.dropdownItem}
                >
                  <IconList size={16} /> Historial y Reportes
                </button>

                <button
                  onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                  className={styles.dropdownItemDanger}
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
