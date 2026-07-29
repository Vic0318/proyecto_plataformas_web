"use client";

import React from "react";
import { IconShieldCheck, IconCheck } from "@/components/Icons";
import styles from "./AdminPanel.module.css";

export const AdminPanel: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Top Banner */}
      <div className={`card-clean ${styles.topBanner}`}>
        <div>
          <span className="badge-clean badge-clean-neutral" style={{ marginBottom: "0.5rem", gap: "6px" }}>
            <IconShieldCheck size={14} /> Administrador de la Plataforma ISBEN
          </span>
          <h2 className={styles.bannerTitle}>Monetización, Seguridad y Gestión de Usuarios</h2>
          <p className={styles.bannerSubtitle}>
            Monitorea el rendimiento financiero de la plataforma, cobro de comisiones (2%) y suscripciones anuales.
          </p>
        </div>

        {/* Global Platform KPIs */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiBox}>
            <div className={styles.kpiLabel}>Comisión Plataforma (2%)</div>
            <div className={styles.kpiValuePrimary}>$0.00 USD</div>
          </div>
          <div className={styles.kpiBox}>
            <div className={styles.kpiLabel}>Empresas Suscritas</div>
            <div className={styles.kpiValueTeal}>0 Activas</div>
          </div>
        </div>
      </div>

      {/* Grid: Monetization & PCI-DSS Security */}
      <div className={styles.mainGrid}>
        
        {/* Monetization Models (RF5.1) */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 className={styles.cardTitle}>Monetización Interna de la Plataforma</h3>
          <p className={styles.cardSubtitle}>
            Modelo híbrido de ingresos para cobro a las empresas proveedoras.
          </p>

          <div className={styles.itemList}>
            <div className={styles.itemRow}>
              <div>
                <div className={styles.itemTitle}>Comisión por Transacción (2%)</div>
                <div className={styles.itemDesc}>Cobro automático al procesar pedidos</div>
              </div>
              <span className="badge-clean badge-clean-success">Activo</span>
            </div>

            <div className={styles.itemRow}>
              <div>
                <div className={styles.itemTitle}>Suscripción Anual ($299/año)</div>
                <div className={styles.itemDesc}>Acceso a perfiles calificados y analítica avanzadas</div>
              </div>
              <span className="badge-clean badge-clean-primary">0 Suscriptoras</span>
            </div>
          </div>
        </div>

        {/* Security & PCI-DSS (RNF3.1 / RNF3.2) */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 className={styles.cardTitle}>Estado de Seguridad y Cifrado</h3>
          <p className={styles.cardSubtitle}>
            Certificación de seguridad en transacciones y hashing de credenciales.
          </p>

          <div className={styles.itemList}>
            <div className={styles.securityBoxTeal}>
              <div className={styles.securityLabelTeal}>
                <IconShieldCheck size={16} /> Cumplimiento PCI-DSS (Pasarela Stripe/Kushki)
              </div>
              <div className={styles.securityDesc}>
                Encriptación SSL de 256 bits activa. Cobro por adelantado del 50% o 100%.
              </div>
            </div>

            <div className={styles.securityBoxOrange}>
              <div className={styles.securityLabelOrange}>
                <IconCheck size={16} /> Hashing de Contraseñas (PBKDF2 / Argon2)
              </div>
              <div className={styles.securityDesc}>
                Ninguna clave se almacena en texto plano.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Permissions Matrix Table */}
      <div className={`card-clean ${styles.permissionsCard}`}>
        <h3 className={styles.permissionsTitle}>Matriz de Permisos por Rol en el Sistema</h3>
        <p className={styles.permissionsSubtitle}>
          Verificación del control de acceso basado en roles (RBAC).
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Módulo / Acción</th>
                <th>Empresa (Proveedor)</th>
                <th>Vendedor Freelance</th>
                <th>Tendero (Cliente)</th>
                <th>Admin Plataforma</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              <tr>
                <td>Ver Catálogo Mayorista</td>
                <td>Sí</td><td>Sí</td><td>Sí</td><td>Sí</td>
              </tr>
              <tr>
                <td>Comprar / Hacer Pedido</td>
                <td>No</td><td>Sí (A terceros)</td><td>Sí</td><td>No</td>
              </tr>
              <tr>
                <td>Definir Monto Mínimo</td>
                <td>Sí</td><td>No</td><td>No</td><td>Sí</td>
              </tr>
              <tr>
                <td>Exámenes de Calificación</td>
                <td>Crea Test</td><td>Rinde Test</td><td>No</td><td>Sí</td>
              </tr>
              <tr>
                <td>Confirmar Entrega de Pedido</td>
                <td>Despachador</td><td>No</td><td>Sí</td><td>No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
