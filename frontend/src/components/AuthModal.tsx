"use client";

import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: "tendero" | "empresa" | "freelance" | "admin", username: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const lowerEmail = email.trim().toLowerCase();
    
    if (lowerEmail === "donpepe@tiendita.com" && password === "tenderopassword123") {
      onLoginSuccess("tendero", "Abarrotes Don Pepe");
      onClose();
    } else if (lowerEmail === "proveedor@isben.com" && password === "empresapassword123") {
      onLoginSuccess("empresa", "Distribuidora Mayorista ISBEN");
      onClose();
    } else if (lowerEmail === "carlos.vendedor@freelance.com" && password === "freelancepassword123") {
      onLoginSuccess("freelance", "Carlos Vendedor Freelance");
      onClose();
    } else if (lowerEmail === "admin@isben.com" && password === "adminpassword123") {
      onLoginSuccess("admin", "Administrador Sistema");
      onClose();
    } else {
      setErrorMsg("Correo o contraseña incorrectos. Revisa las credenciales.");
    }
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

        {/* Logo 2 Centered in Modal */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img 
            src="/logos_2.png" 
            alt="ISBEN Logo Centrado" 
            style={{ height: "54px", objectFit: "contain", marginBottom: "0.5rem" }} 
            onError={(e) => { 
              (e.target as HTMLImageElement).src = "/logos_1.png"; 
            }} 
          />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Iniciar Sesión en ISBEN</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Ingresa tu correo y contraseña registrados</p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              color: "var(--danger)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
              textAlign: "center"
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
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
            Ingresar al Portal
          </button>
        </form>
      </div>
    </div>
  );
};
