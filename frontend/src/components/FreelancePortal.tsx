"use client";

import React, { useState, useEffect } from "react";
import { Product } from "./TenderoView";
import {
  IconBriefcase,
  IconCheck,
  IconPackage,
  IconSearch,
  IconShoppingCart,
  IconPlus
} from "@/components/Icons";

interface FreelancePortalProps {
  products: Product[];
  onPlaceOrderForClient: (clientName: string, productId: string, quantity: number) => void;
  freelancerName?: string;
}

// Banco de preguntas por categoria tematica
const testQuestions = [
  {
    id: 1,
    question: "¿Cual es el rango de temperatura estandar para conservar vacunas y medicamentos termo-sensibles?",
    options: [
      { key: "A", text: "15 C a 25 C (Temperatura ambiente)" },
      { key: "B", text: "2 C a 8 C (Cadena de frio)" },
      { key: "C", text: "-10 C a 0 C (Congelacion)" }
    ],
    correctKey: "B"
  },
  {
    id: 2,
    question: "¿Cual es el protocolo correcto al recibir un lote de productos medicos con el sello de seguridad alterado?",
    options: [
      { key: "A", text: "Almacenarlo normalmente y reportarlo al final de la semana" },
      { key: "B", text: "Rechazar el lote inmediatamente y notificar al proveedor" },
      { key: "C", text: "Venderlo con descuento para liquidar el stock rapido" }
    ],
    correctKey: "B"
  },
  {
    id: 3,
    question: "¿Que documento es obligatorio presentar al distribuidor al momento de recibir un pedido mayorista?",
    options: [
      { key: "A", text: "Solo el recibo de pago digital" },
      { key: "B", text: "Nota de remision firmada por ambas partes" },
      { key: "C", text: "No se requiere ningun documento si el pago ya fue confirmado" }
    ],
    correctKey: "B"
  },
  {
    id: 4,
    question: "¿Cual es la comision retenida del freelance hasta que el tendero confirme la entrega en la plataforma ISBEN?",
    options: [
      { key: "A", text: "Se libera inmediatamente al confirmar el pedido" },
      { key: "B", text: "Se retiene hasta que el tendero confirme la entrega fisica del pedido" },
      { key: "C", text: "Se retiene hasta 30 dias calendario independientemente de la entrega" }
    ],
    correctKey: "B"
  },
  {
    id: 5,
    question: "¿Cual de las siguientes es una buena practica al gestionar el inventario de un cliente tendero?",
    options: [
      { key: "A", text: "Registrar los pedidos solo cuando el cliente pide un reporte" },
      { key: "B", text: "Monitorear el stock periodicamente y anticipar pedidos antes de que se agote" },
      { key: "C", text: "Pedir siempre el maximo de stock sin importar la demanda del tendero" }
    ],
    correctKey: "B"
  }
];


export const FreelancePortal: React.FC<FreelancePortalProps> = ({
  products,
  onPlaceOrderForClient,
  freelancerName = "Carlos Vendedor Freelance",
}) => {
  const [activeTab, setActiveTab] = useState<"catalogo" | "pedido" | "comisiones" | "tests">("catalogo");

  const [selectedClient, setSelectedClient] = useState("Abarrotes Don Pepe (Quito)");
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || "");
  const [quantity, setQuantity] = useState(2);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const categories = ["Todos", "Abarrotes", "Bebidas", "Limpieza", "Cuidado Personal"];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const [freelanceOrders, setFreelanceOrders] = useState([
    {
      id: "ORD-9921",
      client: "Minimarket La Esquina",
      product: "Aceite Vegetal Superior - Paca x 12",
      total: 76.00,
      commission: 7.60,
      status: "Pendiente Confirmación Entrega",
      isDelivered: false,
    },
    {
      id: "ORD-9844",
      client: "Bodega Santa Rosa",
      product: "Paca de Jugos Naturales x 24",
      total: 104.00,
      commission: 10.40,
      status: "Entregado y Liberado",
      isDelivered: true,
    },
  ]);

  const [tests, setTests] = useState([
    { id: 1, title: "Certificación Manejo de Cadena de Frío", company: "Lácteos del Sur", status: "Aprobado" },
    { id: 2, title: "Test de Conocimiento de Productos Farmacéuticos", company: "FarmaGlobal", status: "Pendiente" },
  ]);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("isben_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Token ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/tests/?freelancer=${encodeURIComponent(freelancerName)}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setTests(data);
          }
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
      }
    };
    fetchTests();
  }, [freelancerName]);

  const [takingTestId, setTakingTestId] = useState<number | null>(null);
  const [testAnswers, setTestAnswers] = useState<{ [qId: number]: string }>({});
  const [testError, setTestError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    score: number;
    total: number;
    details: { question: string; yourAnswer: string; correctAnswer: string; correct: boolean }[];
  } | null>(null);

  const handleQuickOrderClick = (productId: string) => {
    setSelectedProduct(productId);
    setActiveTab("pedido");
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProduct);
    if (!prod) return;

    const totalOrder = prod.pricePerUnit * quantity;
    const commissionCalc = totalOrder * 0.1;

    onPlaceOrderForClient(selectedClient, selectedProduct, quantity);

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      client: selectedClient,
      product: prod.name,
      total: totalOrder,
      commission: commissionCalc,
      status: "Pendiente Confirmación Entrega (Retenido)",
      isDelivered: false,
    };

    setFreelanceOrders([newOrder, ...freelanceOrders]);
    setSuccessMessage(`Pedido registrado exitosamente a nombre de "${selectedClient}". Comision estimada: $${commissionCalc.toFixed(2)} USD (Retenida hasta entrega)`);
  };

  const handleSimulateDelivery = (orderId: string) => {
    setFreelanceOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "Entregado y Liberado", isDelivered: true }
          : o
      )
    );
  };

  const totalCommissionsEarned = freelanceOrders
    .filter((o) => o.isDelivered)
    .reduce((acc, curr) => acc + curr.commission, 0);

  const pendingCommissions = freelanceOrders
    .filter((o) => !o.isDelivered)
    .reduce((acc, curr) => acc + curr.commission, 0);

  return (
    <div style={{ padding: "2rem 0 4rem" }}>
      {/* Top Header */}
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
            <IconBriefcase size={14} /> Portal del Vendedor Freelance
          </span>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Catálogo Mayorista y Gestión de Ventas</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Explora productos, registra ventas a nombre de tenderos y gestiona tus comisiones.
          </p>
        </div>

        {/* Financial Commission Counters */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ background: "var(--bg-tertiary)", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Comisiones Retenidas</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent-amber)" }}>
              ${pendingCommissions.toFixed(2)}
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Hasta confirmación entrega</span>
          </div>

          <div style={{ background: "var(--bg-tertiary)", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Comisiones Liberadas</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent-teal)" }}>
              ${totalCommissionsEarned.toFixed(2)}
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-teal)" }}>Listas para retiro</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Freelancer */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("catalogo")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: activeTab === "catalogo" ? 700 : 500,
            fontSize: "0.9rem",
            cursor: "pointer",
            background: activeTab === "catalogo" ? "var(--primary)" : "var(--bg-tertiary)",
            color: activeTab === "catalogo" ? "#ffffff" : "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <IconPackage size={16} /> Catálogo Mayorista Completo
        </button>

        <button
          onClick={() => setActiveTab("pedido")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: activeTab === "pedido" ? 700 : 500,
            fontSize: "0.9rem",
            cursor: "pointer",
            background: activeTab === "pedido" ? "var(--primary)" : "var(--bg-tertiary)",
            color: activeTab === "pedido" ? "#ffffff" : "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <IconShoppingCart size={16} /> Registrar Pedido a Cliente
        </button>

        <button
          onClick={() => setActiveTab("comisiones")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: activeTab === "comisiones" ? 700 : 500,
            fontSize: "0.9rem",
            cursor: "pointer",
            background: activeTab === "comisiones" ? "var(--primary)" : "var(--bg-tertiary)",
            color: activeTab === "comisiones" ? "#ffffff" : "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          Mis Comisiones
        </button>

        <button
          onClick={() => setActiveTab("tests")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: activeTab === "tests" ? 700 : 500,
            fontSize: "0.9rem",
            cursor: "pointer",
            background: activeTab === "tests" ? "var(--primary)" : "var(--bg-tertiary)",
            color: activeTab === "tests" ? "#ffffff" : "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          Certificaciones
        </button>
      </div>

      {/* Tab 1: FULL B2B CATALOG FOR FREELANCERS (RF2.1) */}
      {activeTab === "catalogo" && (
        <div>
          {/* Category Filter & Search Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--border-color)",
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    backgroundColor: selectedCategory === cat ? "var(--secondary)" : "var(--bg-secondary)",
                    color: selectedCategory === cat ? "#ffffff" : "var(--text-primary)"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <IconSearch size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px" }} />
              <input
                type="text"
                placeholder="Buscar productos mayoristas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "0.6rem 1rem 0.6rem 2.2rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  minWidth: "260px"
                }}
              />
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid-cards">
            {filteredProducts.map((product) => {
              const estimatedCommission = product.pricePerUnit * 0.1; // 10% commission
              return (
                <div key={product.id} className="card-clean" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{product.companyName}</span>
                      <span className="badge-clean badge-clean-success">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div style={{ width: "100%", height: "150px", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-tertiary)", marginBottom: "1rem" }}>
                      <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.2rem" }}>{product.name}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>📦 {product.unitPackName}</p>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem", background: "var(--bg-tertiary)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
                      <div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Precio Venta</span>
                        <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>${product.pricePerUnit.toFixed(2)}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--accent-teal)", fontWeight: 700, display: "block" }}>Tu Comisión (10%)</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-teal)" }}>+${estimatedCommission.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickOrderClick(product.id)}
                      className="btn btn-primary"
                      style={{ width: "100%", padding: "0.6rem", fontSize: "0.85rem", gap: "6px" }}
                    >
                      <IconPlus size={16} /> Vender a un Tendero
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: REGISTER ORDER FOR CLIENT (RF3.2) */}
      {activeTab === "pedido" && (
        <div className="card-clean" style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Registrar Pedido a Nombre del Tendero
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Ingresa la venta realizada a nombre de tu cliente. La comisión se calculará automáticamente.
          </p>

          <form onSubmit={handleOrderSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Seleccionar Cliente / Tendero</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                style={{ width: "100%", padding: "0.7rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                <option value="Abarrotes Don Pepe (Quito)">Abarrotes Don Pepe (Quito)</option>
                <option value="Minimarket La Esquina (Guayaquil)">Minimarket La Esquina (Guayaquil)</option>
                <option value="Bodega Santa Rosa (Cuenca)">Bodega Santa Rosa (Cuenca)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Producto Mayorista</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={{ width: "100%", padding: "0.7rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${p.pricePerUnit.toFixed(2)} USD (Comisión: ${(p.pricePerUnit * 0.1).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Cantidad de Pacas / Cajas</label>
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: "100%", padding: "0.7rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem", padding: "0.8rem" }}>
              Confirmar Pedido a Nombre del Cliente
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: COMMISSIONS TABLE (RF4.3) */}
      {activeTab === "comisiones" && (
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Historial de Pedidos y Retención de Comisiones
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            La comisión permanece retenida hasta que el cliente o el despachador confirme la entrega física.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  <th style={{ padding: "0.75rem" }}>Nº Pedido</th>
                  <th style={{ padding: "0.75rem" }}>Cliente / Tendero</th>
                  <th style={{ padding: "0.75rem" }}>Producto</th>
                  <th style={{ padding: "0.75rem" }}>Monto Pedido</th>
                  <th style={{ padding: "0.75rem" }}>Comisión (10%)</th>
                  <th style={{ padding: "0.75rem" }}>Estado Pago</th>
                  <th style={{ padding: "0.75rem" }}>Acción Simulación</th>
                </tr>
              </thead>
              <tbody>
                {freelanceOrders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 700 }}>{o.id}</td>
                    <td style={{ padding: "0.75rem" }}>{o.client}</td>
                    <td style={{ padding: "0.75rem" }}>{o.product}</td>
                    <td style={{ padding: "0.75rem", fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                    <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>${o.commission.toFixed(2)}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`badge-clean ${o.isDelivered ? "badge-clean-success" : "badge-clean-neutral"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {!o.isDelivered && (
                        <button
                          onClick={() => handleSimulateDelivery(o.id)}
                          className="btn btn-outline"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        >
                          Simular Confirmación Entrega
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: CERTIFICATIONS (RF1.3) */}
      {activeTab === "tests" && (
        <div className="card-clean" style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Certificaciones y Perfiles Calificados
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Rinde exámenes exigidos por empresas farmacéuticas o especializadas para vender sus líneas de productos.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {tests.map((t) => (
              <div key={t.id} style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{t.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t.company}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className={`badge-clean ${
                    t.status === "Aprobado" ? "badge-clean-success" : 
                    t.status === "Reintento Solicitado" ? "badge-clean-primary" : 
                    "badge-clean-neutral"
                  }`}>
                    {t.status === "Aprobado" ? <><IconCheck size={14} /> Aprobado</> : 
                     t.status === "Reintento Solicitado" ? "Reintento Solicitado" : 
                     "Pendiente"}
                  </span>
                  {t.status === "Pendiente" && (
                    <button
                      onClick={() => { setTakingTestId(t.id); setTestAnswers({}); setTestError(null); }}
                      className="btn btn-outline"
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                    >
                      Rendir Examen
                    </button>
                  )}
                  {t.status === "Reintento Solicitado" && (
                    <button
                      className="btn btn-outline"
                      disabled
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", opacity: 0.6, cursor: "not-allowed" }}
                    >
                      En Revisión
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "1rem" }}>
          <div className="card-clean" style={{ width: "100%", maxWidth: "450px", padding: "2rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(13, 148, 136, 0.1)", color: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <IconCheck size={36} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.75rem" }}>Pedido Registrado</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              {successMessage}
            </p>
            <button onClick={() => setSuccessMessage(null)} className="btn btn-primary" style={{ width: "100%", padding: "0.8rem" }}>
              Aceptar
            </button>
          </div>
        </div>
      )}
      {/* Certification Test Modal — Pregunta por Pregunta */}
      {takingTestId !== null && !testResult && (() => {
        const currentQ = testQuestions[currentQuestionIndex];
        const answered = testAnswers[currentQ.id];
        const progressPct = ((currentQuestionIndex) / testQuestions.length) * 100;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "1rem" }}>
            <div className="card-clean" style={{ width: "100%", maxWidth: "560px", padding: "2rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)" }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                    Evaluacion de Certificacion
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, lineClamp: 2 }}>
                    {tests.find(t => t.id === takingTestId)?.title}
                  </h3>
                </div>
                <button onClick={() => { setTakingTestId(null); setTestAnswers({}); setCurrentQuestionIndex(0); }} style={{ background: "transparent", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--text-muted)", flexShrink: 0, marginLeft: "1rem" }}>✕</button>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                  <span>Pregunta {currentQuestionIndex + 1} de {testQuestions.length}</span>
                  <span style={{ color: "var(--accent-teal)", fontWeight: 700 }}>{Math.round(progressPct)}% completado</span>
                </div>
                <div style={{ height: "6px", background: "var(--bg-tertiary)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, var(--primary) 0%, var(--accent-amber) 100%)", borderRadius: "999px", transition: "width 0.3s ease" }} />
                </div>
              </div>

              {/* Question */}
              <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", lineHeight: 1.5, color: "var(--text-primary)" }}>
                {currentQ.question}
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem" }}>
                {currentQ.options.map((opt) => {
                  const isSelected = answered === opt.key;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => setTestAnswers({ ...testAnswers, [currentQ.id]: opt.key })}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md)",
                        border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                        background: isSelected ? "rgba(253,77,1,0.06)" : "var(--bg-tertiary)",
                        cursor: "pointer", fontSize: "0.9rem", transition: "all 0.15s",
                        fontWeight: isSelected ? 600 : 400
                      }}
                    >
                      <span style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                        border: isSelected ? "2px solid var(--primary)" : "2px solid var(--border-color)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s"
                      }}>
                        {isSelected && <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--primary)" }} />}
                      </span>
                      <span style={{ color: "var(--text-muted)", fontWeight: 800, minWidth: "18px" }}>{opt.key}.</span>
                      {opt.text}
                    </label>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={() => setCurrentQuestionIndex(i => i - 1)}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: "0.75rem" }}
                  >
                    Anterior
                  </button>
                )}
                {currentQuestionIndex < testQuestions.length - 1 ? (
                  <button
                    onClick={() => {
                      if (!answered) { setTestError("Selecciona una respuesta antes de continuar."); return; }
                      setTestError(null);
                      setCurrentQuestionIndex(i => i + 1);
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "0.75rem" }}
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!answered) { setTestError("Selecciona una respuesta para finalizar."); return; }
                      setTestError(null);
                      // Calcular resultado
                      const details = testQuestions.map(q => {
                        const chosen = testAnswers[q.id] || "";
                        const correct = chosen === q.correctKey;
                        const chosenOpt = q.options.find(o => o.key === chosen);
                        const correctOpt = q.options.find(o => o.key === q.correctKey);
                        return {
                          question: q.question,
                          yourAnswer: chosenOpt ? `${chosen}. ${chosenOpt.text}` : "Sin respuesta",
                          correctAnswer: correctOpt ? `${q.correctKey}. ${correctOpt.text}` : "",
                          correct
                        };
                      });
                      const score = details.filter(d => d.correct).length;
                      const passed = score === testQuestions.length; // aprobado con 100%
                      if (passed) {
                        fetch("http://localhost:8000/api/tests/take/", {
                          method: "POST",
                          headers: getAuthHeaders(),
                          body: JSON.stringify({ testId: takingTestId, freelancer: freelancerName, aprobado: true })
                        }).catch(err => console.error("Error saving test result:", err));
                        setTests(prev => prev.map(t => t.id === takingTestId ? { ...t, status: "Aprobado" } : t));
                      } else {
                        // En caso de reprobar, se mantiene pendiente pero se le obligará a solicitar reintento
                        // No cambiamos el status aquí aún, se cambiará cuando presione "Solicitar Nuevo Intento"
                      }
                      setTestResult({ passed, score, total: testQuestions.length, details });
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "0.75rem" }}
                  >
                    Finalizar Examen
                  </button>
                )}
              </div>
              {testError && (
                <p style={{ fontSize: "0.82rem", color: "var(--danger)", marginTop: "0.75rem", fontWeight: 600, textAlign: "center" }}>{testError}</p>
              )}
            </div>
          </div>
        );
      })()}

      {/* Result Screen */}
      {testResult && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "1rem", overflowY: "auto" }}>
          <div className="card-clean" style={{ width: "100%", maxWidth: "560px", padding: "2rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", margin: "auto" }}>

            {/* Result badge */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 1rem",
                background: testResult.passed ? "rgba(13,148,136,0.12)" : "rgba(239,68,68,0.1)",
                border: `2px solid ${testResult.passed ? "rgba(13,148,136,0.4)" : "rgba(239,68,68,0.3)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"
              }}>
                {testResult.passed ? "✓" : "✗"}
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.25rem", color: testResult.passed ? "var(--accent-teal)" : "var(--danger)" }}>
                {testResult.passed ? "Examen Aprobado" : "Examen No Aprobado"}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                {testResult.passed
                  ? "Certificacion agregada a tu perfil exitosamente."
                  : `Obtuviste ${testResult.score} de ${testResult.total} respuestas correctas. Necesitas el 100% para aprobar.`}
              </p>

              {/* Score ring */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: "999px", padding: "0.4rem 1rem", fontSize: "0.9rem", fontWeight: 800 }}>
                <span style={{ color: testResult.passed ? "var(--accent-teal)" : "var(--danger)" }}>
                  {testResult.score}/{testResult.total}
                </span>
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>respuestas correctas</span>
              </div>
            </div>

            {/* Detail breakdown */}
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                Detalle de Respuestas
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {testResult.details.map((d, i) => (
                  <div key={i} style={{
                    background: d.correct ? "rgba(13,148,136,0.05)" : "rgba(239,68,68,0.05)",
                    border: `1px solid ${d.correct ? "rgba(13,148,136,0.2)" : "rgba(239,68,68,0.2)"}`,
                    borderRadius: "var(--radius-md)", padding: "0.75rem 1rem"
                  }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem", color: "var(--text-primary)" }}>
                      {i + 1}. {d.question}
                    </div>
                    {!d.correct && (
                      <div style={{ fontSize: "0.78rem", color: "var(--danger)", marginBottom: "0.2rem" }}>
                        Tu respuesta: {d.yourAnswer}
                      </div>
                    )}
                    <div style={{ fontSize: "0.78rem", color: d.correct ? "var(--accent-teal)" : "var(--text-secondary)", fontWeight: d.correct ? 700 : 400 }}>
                      {d.correct ? "Correcta: " : "Respuesta correcta: "}{d.correctAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              {!testResult.passed && (
                <button
                  onClick={() => { 
                    setTests(prev => prev.map(t => t.id === takingTestId ? { ...t, status: "Reintento Solicitado" } : t));
                    setTestResult(null); 
                    setTestAnswers({}); 
                    setCurrentQuestionIndex(0); 
                    setTestError(null); 
                    setTakingTestId(null);
                    setSuccessMessage("Se ha enviado tu solicitud para intentar el examen nuevamente. Un distribuidor debe aprobarla.");
                  }}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: "0.75rem" }}
                >
                  Solicitar Nuevo Intento
                </button>
              )}
              <button
                onClick={() => { setTestResult(null); setTakingTestId(null); setTestAnswers({}); setCurrentQuestionIndex(0); setTestError(null); }}
                className="btn btn-primary"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                {testResult.passed ? "Aceptar" : "Cerrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
