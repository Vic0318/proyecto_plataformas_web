"use client";

import React from "react";
import { IconShieldCheck, IconCheck } from "@/components/Icons";

export const AdminPanel: React.FC = () => {
  return (
    <div style={{ padding: "2rem 0 4rem" }}>
      {/* Top Banner */}
      <div
        className="card-clean"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <span className="badge-clean badge-clean-neutral" style={{ marginBottom: "0.5rem", gap: "6px" }}>
            <IconShieldCheck size={14} /> Administrador de la Plataforma ISBEN
          </span>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Monetización, Seguridad y Gestión de Usuarios</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Monitorea el rendimiento financiero de la plataforma, cobro de comisiones (2%) y suscripciones anuales.
          </p>
        </div>

        {/* Global Platform KPIs */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ background: "var(--bg-tertiary)", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Comisión Plataforma (2%)</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>
              $1,420.50 USD
            </div>
          </div>
          <div style={{ background: "var(--bg-tertiary)", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Empresas Suscritas</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent-teal)" }}>
              24 Activas
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Monetization & PCI-DSS Security */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        
        {/* Monetization Models (RF5.1) */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Monetización Interna de la Plataforma
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Modelo híbrido de ingresos para cobro a las empresas proveedoras.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ background: "var(--bg-tertiary)", padding: "0.9rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Comisión por Transacción (2%)</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cobro automático al procesar pedidos</div>
              </div>
              <span className="badge-clean badge-clean-success">Activo</span>
            </div>

            <div style={{ background: "var(--bg-tertiary)", padding: "0.9rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Suscripción Anual ($299/año)</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Acceso a perfiles calificados y analítica avanzadas</div>
              </div>
              <span className="badge-clean badge-clean-primary">24 Suscriptoras</span>
            </div>
          </div>
        </div>

        {/* Security & PCI-DSS (RNF3.1 / RNF3.2) */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Estado de Seguridad y Cifrado
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Certificación de seguridad en transacciones y hashing de credenciales.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ background: "rgba(13, 148, 136, 0.08)", border: "1px solid rgba(13, 148, 136, 0.2)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-teal)", display: "flex", alignItems: "center", gap: "6px" }}>
                <IconShieldCheck size={16} /> Cumplimiento PCI-DSS (Pasarela Stripe/Kushki)
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Encriptación SSL de 256 bits activa. Cobro por adelantado del 50% o 100%.
              </div>
            </div>

            <div style={{ background: "rgba(253, 77, 1, 0.08)", border: "1px solid rgba(253, 77, 1, 0.2)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <IconCheck size={16} /> Hashing de Contraseñas (PBKDF2 / Argon2)
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Ninguna clave se almacena en texto plano.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Permissions Matrix Table */}
      <div className="card-clean" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Matriz de Permisos por Rol en el Sistema
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Verificación del control de acceso basado en roles (RBAC).
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Módulo / Acción</th>
                <th style={{ padding: "0.75rem" }}>Empresa (Proveedor)</th>
                <th style={{ padding: "0.75rem" }}>Vendedor Freelance</th>
                <th style={{ padding: "0.75rem" }}>Tendero (Cliente)</th>
                <th style={{ padding: "0.75rem" }}>Admin Plataforma</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                <td style={{ padding: "0.75rem", textAlign: "left", fontWeight: 700 }}>Ver Catálogo Mayorista</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                <td style={{ padding: "0.75rem", textAlign: "left", fontWeight: 700 }}>Comprar / Hacer Pedido</td>
                <td style={{ padding: "0.75rem" }}>No</td>
                <td style={{ padding: "0.75rem" }}>Sí (A terceros)</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
                <td style={{ padding: "0.75rem" }}>No</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                <td style={{ padding: "0.75rem", textAlign: "left", fontWeight: 700 }}>Definir Monto Mínimo</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
                <td style={{ padding: "0.75rem" }}>No</td>
                <td style={{ padding: "0.75rem" }}>No</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                <td style={{ padding: "0.75rem", textAlign: "left", fontWeight: 700 }}>Exámenes de Calificación</td>
                <td style={{ padding: "0.75rem" }}>Crea Test</td>
                <td style={{ padding: "0.75rem" }}>Rinde Test</td>
                <td style={{ padding: "0.75rem" }}>No</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                <td style={{ padding: "0.75rem", textAlign: "left", fontWeight: 700 }}>Confirmar Entrega de Pedido</td>
                <td style={{ padding: "0.75rem" }}>Despachador</td>
                <td style={{ padding: "0.75rem" }}>No</td>
                <td style={{ padding: "0.75rem" }}>Sí</td>
                <td style={{ padding: "0.75rem" }}>No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
