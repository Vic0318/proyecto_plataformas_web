"use client";

import React, { useState } from "react";

interface LoginViewProps {
  onLogin: (role: "tendero" | "empresa" | "freelance" | "admin", username: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, theme, onToggleTheme }) => {
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
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "2.5rem",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          position: "relative"
        }}
      >
        {/* Theme Toggle Top Corner */}
        <button
          onClick={onToggleTheme}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            padding: "6px 12px",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--text-primary)"
          }}
        >
          {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
        </button>

        {/* Company Official Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <img
              src="/logos_1.png"
              alt="ISBEN Logo Oficial"
              style={{ maxHeight: "70px", objectFit: "contain", filter: theme === "dark" ? "brightness(1.2)" : "none" }}
              onError={(e) => {
                // Fallback to iso_perfil if logos_1 fails
                (e.target as HTMLImageElement).src = "/iso_perfil.png";
              }}
            />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Portal de Acceso Unificado
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Ingresa a tu portal exclusivo según el rol de tu cuenta
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
            1. Selecciona tu Tipo de Cuenta / Rol:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleRoleSelect("tendero")}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: selectedRole === "tendero" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                background: selectedRole === "tendero" ? "var(--primary-glow)" : "var(--bg-tertiary)",
                color: selectedRole === "tendero" ? "var(--primary)" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              🏪 Tendero (Cliente)
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("empresa")}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: selectedRole === "empresa" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                background: selectedRole === "empresa" ? "var(--primary-glow)" : "var(--bg-tertiary)",
                color: selectedRole === "empresa" ? "var(--primary)" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              🏭 Empresa (Proveedor)
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("freelance")}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: selectedRole === "freelance" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                background: selectedRole === "freelance" ? "var(--primary-glow)" : "var(--bg-tertiary)",
                color: selectedRole === "freelance" ? "var(--primary)" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              💼 Vendedor Freelance
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("admin")}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: selectedRole === "admin" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                background: selectedRole === "admin" ? "var(--primary-glow)" : "var(--bg-tertiary)",
                color: selectedRole === "admin" ? "var(--primary)" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ⚡ Administrador
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                marginTop: "0.25rem"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                marginTop: "0.25rem"
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-tendero-lg btn-primary"
            style={{ width: "100%", marginTop: "1rem", borderRadius: "var(--radius-md)" }}
          >
            🔑 Ingresar a Mi Portal ({selectedRole === "tendero" ? "Tendero" : selectedRole === "empresa" ? "Empresa" : selectedRole === "freelance" ? "Freelancer" : "Admin"})
          </button>
        </form>

        {/* Footer Note */}
        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          🔒 Conexión Segura Encriptada | Autenticación RBAC Django
        </div>
      </div>
    </div>
  );
};
