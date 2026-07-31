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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleSelect = (role: "tendero" | "empresa" | "freelance" | "admin") => {
    setSelectedRole(role);
    setEmail("");
    setPassword("");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) localStorage.setItem("isben_token", data.token);
        
        onLogin(data.role || selectedRole, data.name || "Usuario ISBEN", data.token);
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorMsg(errData.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Error de conexión con el servidor");
    }
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

          {errorMsg && <div className={styles.errorText} style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "0.5rem", textAlign: "center" }}>{errorMsg}</div>}

          <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
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
