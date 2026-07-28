"use client";

import React, { useState } from "react";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: "tendero" | "empresa" | "freelance" | "admin", username: string, token?: string) => void;
  onSwitchToRegister?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrorMsg(data.error || "Error de inicio de sesión.");
        return;
      }
      
      const mappedRole = data.rol === "freelancer" ? "freelance" : data.rol;
      onLoginSuccess(mappedRole as "tendero" | "empresa" | "freelance" | "admin", data.name, data.token);
      onClose();
    } catch (err) {
      setErrorMsg("No se pudo conectar con el servidor backend de Django.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`card-clean ${styles.modal}`}>
        {/* Close Button */}
        <button onClick={onClose} className={styles.closeBtn}>✕</button>

        {/* Logo Centered in Modal */}
        <div className={styles.logoArea}>
          <img
            src="/logos_2.png"
            alt="ISBEN Logo Centrado"
            className={styles.logo}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logos_1.png";
            }}
          />
          <h3 className={styles.title}>Iniciar Sesión en ISBEN</h3>
          <p className={styles.subtitle}>Ingresa tu correo y contraseña registrados</p>
        </div>

        {errorMsg && (
          <div className={styles.errorBox}>{errorMsg}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.fieldLabel}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
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
              placeholder="Contraseña"
              className={styles.inputField}
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Ingresar al Portal
          </button>
        </form>

        {/* Register Link */}
        {onSwitchToRegister && (
          <div className={styles.switchArea}>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => { onClose(); onSwitchToRegister(); }}
              className={styles.switchLink}
            >
              Crea tu cuenta gratis →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
