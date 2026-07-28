"use client";

import React, { useState } from "react";

type RegisterRole = "EMPRESA" | "FREELANCER";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (
    role: "tendero" | "empresa" | "freelance" | "admin",
    username: string,
    token?: string
  ) => void;
  onSwitchToLogin: () => void;
}

type Step = "role" | "form" | "success";

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onSwitchToLogin,
}) => {
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null);

  // Form fields
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep("role");
    setSelectedRole(null);
    setNombre("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNombreEmpresa("");
    setErrorMsg("");
    setIsLoading(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRoleSelect = (role: RegisterRole) => {
    setSelectedRole(role);
    setErrorMsg("");
  };

  const handleNextStep = () => {
    if (!selectedRole) {
      setErrorMsg("Por favor selecciona un tipo de cuenta.");
      return;
    }
    setErrorMsg("");
    setStep("form");
  };

  const validateForm = (): boolean => {
    if (!nombre.trim()) { setErrorMsg("El nombre completo es requerido."); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Ingresa un correo electrónico válido.");
      return false;
    }
    if (password.length < 6) { setErrorMsg("La contraseña debe tener al menos 6 caracteres."); return false; }
    if (password !== confirmPassword) { setErrorMsg("Las contraseñas no coinciden."); return false; }
    if (selectedRole === "EMPRESA" && !nombreEmpresa.trim()) {
      setErrorMsg("El nombre de la empresa es requerido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload: Record<string, string> = {
        nombre: nombre.trim(),
        email: email.trim(),
        password,
        rol: selectedRole!,
      };
      if (selectedRole === "EMPRESA") {
        payload.nombre_empresa = nombreEmpresa.trim();
      }

      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Error al crear la cuenta.");
        setIsLoading(false);
        return;
      }

      // Éxito
      setStep("success");
      setTimeout(() => {
        const mappedRole = data.rol === "freelancer" ? "freelance" : data.rol as "tendero" | "empresa" | "freelance" | "admin";
        onRegisterSuccess(mappedRole, data.name, data.token);
        handleClose();
      }, 2000);

    } catch {
      setErrorMsg("No se pudo conectar con el servidor. Asegúrate que el backend esté corriendo.");
      setIsLoading(false);
    }
  };

  const roleConfig = {
    EMPRESA: {
      icon: "E",
      label: "Empresa Proveedora",
      description: "Registra tu empresa para vender productos al mayoreo a tenderos y freelancers.",
      color: "var(--accent)",
      glow: "rgba(234, 179, 8, 0.12)",
    },
    FREELANCER: {
      icon: "F",
      label: "Vendedor Freelance",
      description: "Regístrate como vendedor independiente y conecta empresas con tenderos locales.",
      color: "var(--primary)",
      glow: "var(--primary-glow)",
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spinAnim { to { transform: rotate(360deg); } }
        @keyframes successPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
        .reg-modal { animation: slideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .reg-role-btn { transition: all 0.18s ease; }
        .reg-role-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .reg-input:focus { outline: none; border-color: var(--primary) !important; box-shadow: 0 0 0 3px var(--primary-glow); }
        .reg-submit-btn { transition: all 0.18s ease; }
        .reg-submit-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.08); }
        .reg-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spinAnim 0.7s linear infinite; display: inline-block; }
        .success-icon { animation: successPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .step-dot { width: 8px; height: 8px; border-radius: 50%; transition: all 0.2s ease; }
      `}</style>

      <div
        className="card-clean reg-modal"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "2rem",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            cursor: "pointer",
            color: "var(--text-muted)",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Logo + Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src="/logos_2.png"
            alt="ISBEN Logo"
            style={{ height: "48px", objectFit: "contain", marginBottom: "0.6rem" }}
            onError={(e) => { (e.target as HTMLImageElement).src = "/logos_1.png"; }}
          />
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Crear Cuenta en ISBEN
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {step === "role" && "Elige el tipo de cuenta que deseas crear"}
            {step === "form" && `Completa tu perfil de ${selectedRole ? roleConfig[selectedRole].label : ""}`}
            {step === "success" && "¡Bienvenido a la plataforma!"}
          </p>
        </div>

        {/* Step Indicators */}
        {step !== "success" && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "1.5rem" }}>
            <div className="step-dot" style={{ background: "var(--primary)", transform: step === "role" ? "scale(1.4)" : "scale(1)" }} />
            <div className="step-dot" style={{ background: step === "form" ? "var(--primary)" : "var(--border-color)", transform: step === "form" ? "scale(1.4)" : "scale(1)" }} />
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "0.7rem 1rem",
            borderRadius: "var(--radius-md)",
            color: "var(--danger)",
            fontSize: "0.83rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
            {errorMsg}
          </div>
        )}

        {/* ── STEP 1: Role Selection ── */}
        {step === "role" && (
          <div>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tipo de cuenta
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {(["EMPRESA", "FREELANCER"] as RegisterRole[]).map((role) => {
                const cfg = roleConfig[role];
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    className="reg-role-btn"
                    onClick={() => handleRoleSelect(role)}
                    style={{
                      padding: "1rem 1.2rem",
                      borderRadius: "var(--radius-lg)",
                      border: isSelected ? `2px solid ${cfg.color}` : "1px solid var(--border-color)",
                      background: isSelected ? cfg.glow : "var(--bg-tertiary)",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <span style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: isSelected ? cfg.color : "var(--border-color)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}>{cfg.icon}</span>
                    <div>
                      <div style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: isSelected ? cfg.color : "var(--text-primary)",
                        marginBottom: "0.25rem",
                      }}>
                        {cfg.label}
                        {isSelected && (
                          <span style={{
                            marginLeft: "0.5rem",
                            fontSize: "0.7rem",
                            background: cfg.color,
                            color: "#fff",
                            padding: "1px 8px",
                            borderRadius: "100px",
                            verticalAlign: "middle",
                          }}>
                            Seleccionado
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {cfg.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="btn btn-primary reg-submit-btn"
              onClick={handleNextStep}
              style={{ width: "100%", padding: "0.85rem" }}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ── STEP 2: Registration Form ── */}
        {step === "form" && selectedRole && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

            {/* Nombre Completo */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                className="reg-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder={selectedRole === "EMPRESA" ? "Juan Pérez (representante)" : "Tu nombre completo"}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
              />
            </div>

            {/* Nombre Empresa — solo si es EMPRESA */}
            {selectedRole === "EMPRESA" && (
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  className="reg-input"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  required
                  placeholder="Ej: Distribuidora Los Andes S.A."
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                className="reg-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@empresa.com"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Contraseña * <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(mín. 6 caracteres)</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="reg-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Crea una contraseña segura"
                  style={{
                    width: "100%",
                    padding: "0.65rem 4.5rem 0.65rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.7rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    padding: 0,
                    fontWeight: 700,
                  }}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {/* Password strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: "0.4rem" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "0.2rem" }}>
                    {[1, 2, 3, 4].map((i) => {
                      const strength = Math.min(4, Math.floor(password.length / 3));
                      const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
                      return (
                        <div key={i} style={{
                          flex: 1, height: "3px", borderRadius: "2px",
                          background: i <= strength ? colors[strength - 1] : "var(--border-color)",
                          transition: "all 0.2s",
                        }} />
                      );
                    })}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {password.length < 6 ? "Muy corta" : password.length < 9 ? "Aceptable" : password.length < 12 ? "Buena" : "Excelente"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Confirmar Contraseña *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="reg-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${confirmPassword && confirmPassword !== password ? "var(--danger)" : "var(--border-color)"}`,
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
              />
              {confirmPassword && confirmPassword !== password && (
                <p style={{ fontSize: "0.75rem", color: "var(--danger)", marginTop: "0.25rem" }}>
                  Las contraseñas no coinciden
                </p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p style={{ fontSize: "0.75rem", color: "#22c55e", marginTop: "0.25rem" }}>
                  Las contraseñas coinciden
                </p>
              )}
            </div>

            {/* Terms note */}
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", margin: "0.25rem 0 0" }}>
              Al registrarte, aceptas los términos y condiciones de la plataforma ISBEN.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => { setStep("role"); setErrorMsg(""); }}
                style={{
                  flex: "0 0 auto",
                  padding: "0.8rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                ← Atrás
              </button>
              <button
                type="submit"
                className="btn btn-primary reg-submit-btn"
                disabled={isLoading}
                style={{ flex: 1, padding: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Creando cuenta...
                  </>
                ) : (
                  `Crear mi Cuenta de ${selectedRole === "EMPRESA" ? "Empresa" : "Freelancer"}`
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Success ── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div
              className="success-icon"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(34, 197, 94, 0.12)",
                border: "2px solid #22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                fontSize: "1.8rem",
                color: "#22c55e",
                fontWeight: 800,
              }}
            >
              &#10003;
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
              ¡Cuenta creada exitosamente!
            </h3>
            <p style={{ fontSize: "0.87rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Iniciando sesión automáticamente en tu portal...
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.82rem" }}>
              <span className="spinner" />
              Cargando tu portal
            </div>
          </div>
        )}

        {/* Footer — Switch to Login */}
        {step !== "success" && (
          <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => { handleClose(); onSwitchToLogin(); }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.82rem",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
