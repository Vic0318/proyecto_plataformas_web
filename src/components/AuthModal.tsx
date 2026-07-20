"use client";

import React, { useState } from "react";
import { IconStore, IconFactory, IconBriefcase, IconShieldCheck } from "@/components/Icons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: "tendero" | "empresa" | "freelance" | "admin", username: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [role, setRole] = useState<"tendero" | "empresa" | "freelance" | "admin">("tendero");
  const [email, setEmail] = useState("donpepe@tiendita.com");

  if (!isOpen) return null;

  const handleRoleSelect = (r: "tendero" | "empresa" | "freelance" | "admin") => {
    setRole(r);
    if (r === "tendero") setEmail("donpepe@tiendita.com");
    if (r === "empresa") setEmail("proveedor@isben.com");
    if (r === "freelance") setEmail("carlos.vendedor@freelance.com");
    if (r === "admin") setEmail("admin@isben.com");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let name = "Usuario ISBEN";
    if (role === "tendero") name = "Abarrotes Don Pepe";
    if (role === "empresa") name = "Distribuidora Mayorista ISBEN";
    if (role === "freelance") name = "Carlos Vendedor Freelance";
    if (role === "admin") name = "Administrador Sistema";

    onLoginSuccess(role, name);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
    >
      <div
        className="card-clean"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2rem",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          position: "relative"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            fontSize: "1.25rem",
            cursor: "pointer",
            color: "var(--text-muted)"
          }}
        >
          ✕
        </button>

        {/* Logo 1 Centered in Modal */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img src="/logos_1.png" alt="ISBEN Logo Centrado" style={{ height: "54px", objectFit: "contain", marginBottom: "0.5rem" }} onError={(e) => { (e.target as HTMLImageElement).src = "/logos_2.png"; }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Iniciar Sesión en ISBEN</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Selecciona tu rol e ingresa a tu panel</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <button
            type="button"
            onClick={() => handleRoleSelect("tendero")}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-md)",
              border: role === "tendero" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
              background: role === "tendero" ? "var(--primary-light)" : "var(--bg-tertiary)",
              color: role === "tendero" ? "var(--primary)" : "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <IconStore size={16} /> Tendero
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("empresa")}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-md)",
              border: role === "empresa" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
              background: role === "empresa" ? "var(--primary-light)" : "var(--bg-tertiary)",
              color: role === "empresa" ? "var(--primary)" : "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <IconFactory size={16} /> Empresa
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("freelance")}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-md)",
              border: role === "freelance" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
              background: role === "freelance" ? "var(--primary-light)" : "var(--bg-tertiary)",
              color: role === "freelance" ? "var(--primary)" : "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <IconBriefcase size={16} /> Freelancer
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("admin")}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-md)",
              border: role === "admin" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
              background: role === "admin" ? "var(--primary-light)" : "var(--bg-tertiary)",
              color: role === "admin" ? "var(--primary)" : "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <IconShieldCheck size={16} /> Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.65rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                marginTop: "0.2rem"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Contraseña</label>
            <input
              type="password"
              defaultValue="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.65rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                marginTop: "0.2rem"
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem" }}>
            Ingresar al Portal ({role})
          </button>
        </form>
      </div>
    </div>
  );
};
