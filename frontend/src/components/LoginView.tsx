"use client";

import React, { useState } from "react";
import styles from "./LoginView.module.css";

interface LoginViewProps {
  onLogin: (role: "tendero" | "empresa" | "freelance" | "admin", username: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenRegister?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, theme, onToggleTheme, onOpenRegister }) => {
  const [selectedRole, setSelectedRole] = useState<"tendero" | "empresa" | "freelance" | "admin">("tendero");
  const [email, setEmail] = useState("tendero@isben.com");
  const [password, setPassword] = useState("••••••••");

  const handleRoleSelect = (role: "tendero" | "empresa" | "freelance" | "admin") => {
    setSelectedRole(role);
    if (role === "tendero") setEmail("donpepe@tiendita.com");
    if (role === "empresa") setEmail("contacto@isbenproveedores.com");
    if (role === "freelance") setEmail("carlos.vendedor@freelance.com");
    if (role === "admin") setEmail("admin@isbenplatform.com");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let name = "Usuario ISBEN";
    if (selectedRole === "tendero") name = "Abarrotes Don Pepe";
    if (selectedRole === "empresa") name = "Distribuidora Mayorista ISBEN";
    if (selectedRole === "freelance") name = "Carlos Vendedor Freelance";
    if (selectedRole === "admin") name = "Administrador Sistema";

    onLogin(selectedRole, name);
  };

  return (
    <div className={styles.wrapper}>
      <div className={`glass-panel ${styles.panel}`}>
        {/* Theme Toggle Top Corner */}
        <button onClick={onToggleTheme} className={styles.themeToggle}>
          {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
        </button>

        {/* Company Official Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoCentered}>
            <img
              src="/logos_1.png"
              alt="ISBEN Logo Oficial"
              className={styles.logo}
              style={{ filter: theme === "dark" ? "brightness(1.2)" : "none" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/iso_perfil.png";
              }}
            />
          </div>
          <h1 className={styles.title}>Portal de Acceso Unificado</h1>
          <p className={styles.subtitle}>Ingresa a tu portal exclusivo según el rol de tu cuenta</p>
        </div>

        {/* Role Selection Tabs */}
        <div className={styles.roleSection}>
          <label className={styles.roleLabel}>1. Selecciona tu Tipo de Cuenta / Rol:</label>
          <div className={styles.roleGrid}>
            {(["tendero", "empresa", "freelance", "admin"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={selectedRole === role ? styles.roleBtnActive : styles.roleBtn}
              >
                {role === "tendero" && "🏪 Tendero (Cliente)"}
                {role === "empresa" && "🏭 Empresa (Proveedor)"}
                {role === "freelance" && "💼 Vendedor Freelance"}
                {role === "admin" && "⚡ Administrador"}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.fieldLabel}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div>
            <label className={styles.fieldLabel}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            🔑 Ingresar a Mi Portal ({selectedRole === "tendero" ? "Tendero" : selectedRole === "empresa" ? "Empresa" : selectedRole === "freelance" ? "Freelancer" : "Admin"})
          </button>
        </form>

        {/* Footer Note */}
        <div className={styles.footerNote}>
          🔒 Conexión Segura Encriptada | Autenticación RBAC Django
        </div>

        {/* Register CTA */}
        {onOpenRegister && (
          <div className={styles.registerCta}>
            <p className={styles.registerCtaText}>Quieres vender en ISBEN?</p>
            <button type="button" onClick={onOpenRegister} className={`btn ${styles.registerCtaBtn}`}>
              Registrar Empresa o Cuenta Freelance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
