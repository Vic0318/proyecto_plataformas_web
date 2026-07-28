"use client";

import React, { useState } from "react";
import styles from "./RegisterModal.module.css";

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

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");

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
    <div className={styles.overlay}>
      <div className={`card-clean ${styles.modal}`}>
        {/* Close Button */}
        <button onClick={handleClose} className={styles.closeBtn}>✕</button>

        {/* Logo + Header */}
        <div className={styles.logoArea}>
          <img
            src="/logos_2.png"
            alt="ISBEN Logo"
            className={styles.logo}
            onError={(e) => { (e.target as HTMLImageElement).src = "/logos_1.png"; }}
          />
          <h2 className={styles.modalTitle}>Crear Cuenta en ISBEN</h2>
          <p className={styles.modalSubtitle}>
            {step === "role" && "Elige el tipo de cuenta que deseas crear"}
            {step === "form" && `Completa tu perfil de ${selectedRole ? roleConfig[selectedRole].label : ""}`}
            {step === "success" && "¡Bienvenido a la plataforma!"}
          </p>
        </div>

        {/* Step Indicators */}
        {step !== "success" && (
          <div className={styles.stepDots}>
            <div className={`${styles.stepDot} ${step === "role" ? styles.stepDotActive : styles.stepDotInactive}`} />
            <div className={`${styles.stepDot} ${step === "form" ? styles.stepDotActive : styles.stepDotInactive}`} />
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className={styles.errorBanner}>{errorMsg}</div>
        )}

        {/* ── STEP 1: Role Selection ── */}
        {step === "role" && (
          <div>
            <p className={styles.roleTypeLabel}>Tipo de cuenta</p>
            <div className={styles.roleList}>
              {(["EMPRESA", "FREELANCER"] as RegisterRole[]).map((role) => {
                const cfg = roleConfig[role];
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    className={styles.roleBtn}
                    onClick={() => handleRoleSelect(role)}
                    style={{
                      border: isSelected ? `2px solid ${cfg.color}` : "1px solid var(--border-color)",
                      background: isSelected ? cfg.glow : "var(--bg-tertiary)",
                    }}
                  >
                    <span
                      className={styles.roleIconBox}
                      style={{ background: isSelected ? cfg.color : "var(--border-color)" }}
                    >
                      {cfg.icon}
                    </span>
                    <div>
                      <div
                        className={styles.roleName}
                        style={{ color: isSelected ? cfg.color : "var(--text-primary)" }}
                      >
                        {cfg.label}
                        {isSelected && (
                          <span
                            className={styles.selectedBadge}
                            style={{ background: cfg.color }}
                          >
                            Seleccionado
                          </span>
                        )}
                      </div>
                      <div className={styles.roleDesc}>{cfg.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={`btn btn-primary ${styles.submitBtn}`}
              onClick={handleNextStep}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ── STEP 2: Registration Form ── */}
        {step === "form" && selectedRole && (
          <form onSubmit={handleSubmit} className={styles.regForm}>

            {/* Nombre Completo */}
            <div>
              <label className={styles.fieldLabel}>
                Nombre Completo *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder={selectedRole === "EMPRESA" ? "Juan Pérez (representante)" : "Tu nombre completo"}
                className={styles.inputField}
              />
            </div>

            {/* Nombre Empresa — solo si es EMPRESA */}
            {selectedRole === "EMPRESA" && (
              <div>
                <label className={styles.fieldLabel}>Nombre de la Empresa *</label>
                <input
                  type="text"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  required
                  placeholder="Ej: Distribuidora Los Andes S.A."
                  className={styles.inputField}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className={styles.fieldLabel}>Correo Electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@empresa.com"
                className={styles.inputField}
              />
            </div>

            {/* Password */}
            <div>
              <label className={styles.fieldLabel}>
                Contraseña * <span className={styles.fieldLabelLight}>(mín. 6 caracteres)</span>
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Crea una contraseña segura"
                  className={styles.inputFieldPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.showPasswordBtn}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {/* Password strength bar */}
              {password.length > 0 && (
                <div>
                  <div className={styles.strengthBars}>
                    {[1, 2, 3, 4].map((i) => {
                      const strength = Math.min(4, Math.floor(password.length / 3));
                      const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
                      return (
                        <div
                          key={i}
                          className={styles.strengthBar}
                          style={{
                            background: i <= strength ? colors[strength - 1] : "var(--border-color)",
                          }}
                        />
                      );
                    })}
                  </div>
                  <span className={styles.strengthLabel}>
                    {password.length < 6 ? "Muy corta" : password.length < 9 ? "Aceptable" : password.length < 12 ? "Buena" : "Excelente"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={styles.fieldLabel}>Confirmar Contraseña *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
                className={confirmPassword && confirmPassword !== password ? styles.inputFieldError : styles.inputField}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className={styles.validationError}>Las contraseñas no coinciden</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p className={styles.validationOk}>Las contraseñas coinciden</p>
              )}
            </div>

            {/* Terms note */}
            <p className={styles.termsNote}>
              Al registrarte, aceptas los términos y condiciones de la plataforma ISBEN.
            </p>

            {/* Buttons */}
            <div className={styles.formBtnRow}>
              <button
                type="button"
                onClick={() => { setStep("role"); setErrorMsg(""); }}
                className={styles.backBtn}
              >
                ← Atrás
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
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
          <div className={styles.successArea}>
            <div className={`${styles.successIcon}`}>&#10003;</div>
            <h3 className={styles.successTitle}>¡Cuenta creada exitosamente!</h3>
            <p className={styles.successSubtitle}>Iniciando sesión automáticamente en tu portal...</p>
            <div className={styles.loadingRow}>
              <span className={styles.spinner} />
              Cargando tu portal
            </div>
          </div>
        )}

        {/* Footer — Switch to Login */}
        {step !== "success" && (
          <div className={styles.footerSwitch}>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => { handleClose(); onSwitchToLogin(); }}
              className={styles.switchLink}
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
