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
import styles from "./FreelancePortal.module.css";

interface FreelancePortalProps {
  products: Product[];
  onPlaceOrderForClient: (clientName: string, productId: string, quantity: number) => void;
  freelancerName?: string;
}

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
    { id: "ORD-9921", client: "Minimarket La Esquina", product: "Aceite Vegetal Superior - Paca x 12", total: 76.00, commission: 7.60, status: "Pendiente Confirmación Entrega", isDelivered: false },
    { id: "ORD-9844", client: "Bodega Santa Rosa", product: "Paca de Jugos Naturales x 24", total: 104.00, commission: 10.40, status: "Entregado y Liberado", isDelivered: true },
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
        o.id === orderId ? { ...o, status: "Entregado y Liberado", isDelivered: true } : o
      )
    );
  };

  const totalCommissionsEarned = freelanceOrders.filter((o) => o.isDelivered).reduce((acc, curr) => acc + curr.commission, 0);
  const pendingCommissions = freelanceOrders.filter((o) => !o.isDelivered).reduce((acc, curr) => acc + curr.commission, 0);

  return (
    <div className={styles.wrapper}>
      {/* Top Header */}
      <div className={`card-clean ${styles.topBanner}`}>
        <div>
          <span className="badge-clean badge-clean-neutral" style={{ marginBottom: "0.5rem", gap: "6px" }}>
            <IconBriefcase size={14} /> Portal del Vendedor Freelance
          </span>
          <h2 className={styles.bannerTitle}>Catálogo Mayorista y Gestión de Ventas</h2>
          <p className={styles.bannerSubtitle}>
            Explora productos, registra ventas a nombre de tenderos y gestiona tus comisiones.
          </p>
        </div>

        <div className={styles.kpiRow}>
          <div className={styles.kpiBox}>
            <div className={styles.kpiLabel}>Comisiones Retenidas</div>
            <div className={styles.kpiValueAmber}>${pendingCommissions.toFixed(2)}</div>
            <span className={styles.kpiSubAmber}>Hasta confirmación entrega</span>
          </div>
          <div className={styles.kpiBox}>
            <div className={styles.kpiLabel}>Comisiones Liberadas</div>
            <div className={styles.kpiValueTeal}>${totalCommissionsEarned.toFixed(2)}</div>
            <span className={styles.kpiSubTeal}>Listas para retiro</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className={styles.tabNav}>
        {(["catalogo", "pedido", "comisiones", "tests"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? styles.tabBtnActive : styles.tabBtn}
          >
            {tab === "catalogo" && <><IconPackage size={16} /> Catálogo Mayorista Completo</>}
            {tab === "pedido" && <><IconShoppingCart size={16} /> Registrar Pedido a Cliente</>}
            {tab === "comisiones" && "Mis Comisiones"}
            {tab === "tests" && "Certificaciones"}
          </button>
        ))}
      </div>

      {/* Tab 1: Full Catalog */}
      {activeTab === "catalogo" && (
        <div>
          <div className={styles.filterBar}>
            <div className={styles.pillsRow}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? styles.pillActive : styles.pill}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>
                <IconSearch size={16} color="var(--text-muted)" />
              </span>
              <input
                type="text"
                placeholder="Buscar productos mayoristas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className="grid-cards">
            {filteredProducts.map((product) => {
              const estimatedCommission = product.pricePerUnit * 0.1;
              return (
                <div key={product.id} className={`card-clean ${styles.productCard}`}>
                  <div>
                    <div className={styles.productTopRow}>
                      <span className={styles.productCompany}>{product.companyName}</span>
                      <span className="badge-clean badge-clean-success">Stock: {product.stock}</span>
                    </div>
                    <div className={styles.productImageBox}>
                      <img src={product.image} alt={product.name} className={styles.productImage} />
                    </div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPack}>📦 {product.unitPackName}</p>
                  </div>
                  <div>
                    <div className={styles.priceCommRow}>
                      <div className={styles.priceCol}>
                        <span className={styles.priceMiniLabel}>Precio Venta</span>
                        <span className={styles.priceValue}>${product.pricePerUnit.toFixed(2)}</span>
                      </div>
                      <div className={styles.commCol}>
                        <span className={styles.commLabel}>Tu Comisión (10%)</span>
                        <span className={styles.commValue}>+${estimatedCommission.toFixed(2)}</span>
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

      {/* Tab 2: Register Order */}
      {activeTab === "pedido" && (
        <div className={`card-clean ${styles.orderCard}`}>
          <h3 className={styles.orderTitle}>Registrar Pedido a Nombre del Tendero</h3>
          <p className={styles.orderSubtitle}>Ingresa la venta realizada a nombre de tu cliente. La comisión se calculará automáticamente.</p>

          <form onSubmit={handleOrderSubmit} className={styles.orderForm}>
            <div>
              <label className={styles.fieldLabel}>Seleccionar Cliente / Tendero</label>
              <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className={styles.fieldSelect}>
                <option value="Abarrotes Don Pepe (Quito)">Abarrotes Don Pepe (Quito)</option>
                <option value="Minimarket La Esquina (Guayaquil)">Minimarket La Esquina (Guayaquil)</option>
                <option value="Bodega Santa Rosa (Cuenca)">Bodega Santa Rosa (Cuenca)</option>
              </select>
            </div>
            <div>
              <label className={styles.fieldLabel}>Producto Mayorista</label>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className={styles.fieldSelect}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${p.pricePerUnit.toFixed(2)} USD (Comisión: ${(p.pricePerUnit * 0.1).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.fieldLabel}>Cantidad de Pacas / Cajas</label>
              <input type="number" min="1" max="50" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={styles.fieldInput} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem", padding: "0.8rem" }}>
              Confirmar Pedido a Nombre del Cliente
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Commissions */}
      {activeTab === "comisiones" && (
        <div className={`card-clean ${styles.commissionsCard}`}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Historial de Pedidos y Retención de Comisiones</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            La comisión permanece retenida hasta que el cliente o el despachador confirme la entrega física.
          </p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Cliente / Tendero</th>
                  <th>Producto</th>
                  <th>Monto Pedido</th>
                  <th>Comisión (10%)</th>
                  <th>Estado Pago</th>
                  <th>Acción Simulación</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {freelanceOrders.map((o) => (
                  <tr key={o.id}>
                    <td className={styles.tdBold}>{o.id}</td>
                    <td>{o.client}</td>
                    <td>{o.product}</td>
                    <td className={styles.tdBold}>${o.total.toFixed(2)}</td>
                    <td className={styles.tdCommission}>${o.commission.toFixed(2)}</td>
                    <td>
                      <span className={`badge-clean ${o.isDelivered ? "badge-clean-success" : "badge-clean-neutral"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
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

      {/* Tab 4: Certifications */}
      {activeTab === "tests" && (
        <div className={`card-clean ${styles.testsCard}`}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>Certificaciones y Perfiles Calificados</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Rinde exámenes exigidos por empresas farmacéuticas o especializadas para vender sus líneas de productos.
          </p>
          <div className={styles.testsList}>
            {tests.map((t) => (
              <div key={t.id} className={styles.testItem}>
                <div className={styles.testItemInfo}>
                  <div className={styles.testItemTitle}>{t.title}</div>
                  <div className={styles.testItemCompany}>{t.company}</div>
                </div>
                <div className={styles.testItemActions}>
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
        <div className={styles.modalOverlay}>
          <div className={`card-clean ${styles.successModal}`}>
            <div className={styles.successIcon}><IconCheck size={36} /></div>
            <h3 className={styles.successTitle}>Pedido Registrado</h3>
            <p className={styles.successMsg}>{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="btn btn-primary" style={{ width: "100%", padding: "0.8rem" }}>Aceptar</button>
          </div>
        </div>
      )}

      {/* Certification Test Modal — Question by Question */}
      {takingTestId !== null && !testResult && (() => {
        const currentQ = testQuestions[currentQuestionIndex];
        const answered = testAnswers[currentQ.id];
        const progressPct = ((currentQuestionIndex) / testQuestions.length) * 100;
        return (
          <div className={styles.testModalOverlay}>
            <div className={`card-clean ${styles.testModal}`}>
              <div className={styles.testModalHeader}>
                <div>
                  <div className={styles.testModalMeta}>Evaluacion de Certificacion</div>
                  <h3 className={styles.testModalTitle}>{tests.find(t => t.id === takingTestId)?.title}</h3>
                </div>
                <button
                  onClick={() => { setTakingTestId(null); setTestAnswers({}); setCurrentQuestionIndex(0); }}
                  className={styles.testModalCloseBtn}
                >
                  ✕
                </button>
              </div>

              {/* Progress bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Pregunta {currentQuestionIndex + 1} de {testQuestions.length}</span>
                  <span className={styles.progressPercent}>{Math.round(progressPct)}% completado</span>
                </div>
                <div className={styles.progressTrack}>
                  {/* Width is dynamic — kept as inline style */}
                  <div style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, var(--primary) 0%, var(--accent-amber) 100%)",
                    borderRadius: "999px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              <p className={styles.questionText}>{currentQ.question}</p>

              <div className={styles.optionsList}>
                {currentQ.options.map((opt) => {
                  const isSelected = answered === opt.key;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => setTestAnswers({ ...testAnswers, [currentQ.id]: opt.key })}
                      className={isSelected ? styles.optionLabelSelected : styles.optionLabel}
                    >
                      <span className={isSelected ? styles.optionBulletSelected : styles.optionBullet}>
                        {isSelected && <span className={styles.optionBulletDot} />}
                      </span>
                      <span className={styles.optionKey}>{opt.key}.</span>
                      {opt.text}
                    </label>
                  );
                })}
              </div>

              <div className={styles.navBtns}>
                {currentQuestionIndex > 0 && (
                  <button onClick={() => setCurrentQuestionIndex(i => i - 1)} className="btn btn-outline" style={{ flex: 1, padding: "0.75rem" }}>
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
                      const passed = score === testQuestions.length;
                      if (passed) {
                        fetch("http://localhost:8000/api/tests/take/", {
                          method: "POST",
                          headers: getAuthHeaders(),
                          body: JSON.stringify({ testId: takingTestId, freelancer: freelancerName, aprobado: true })
                        }).catch(err => console.error("Error saving test result:", err));
                        setTests(prev => prev.map(t => t.id === takingTestId ? { ...t, status: "Aprobado" } : t));
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
              {testError && <p className={styles.testError}>{testError}</p>}
            </div>
          </div>
        );
      })()}

      {/* Result Screen */}
      {testResult && (
        <div className={styles.resultOverlay}>
          <div className={`card-clean ${styles.resultModal}`}>
            <div className={styles.resultCenter}>
              <div className={`${styles.resultBadge} ${testResult.passed ? styles.resultBadgePassed : styles.resultBadgeFailed}`}>
                {testResult.passed ? "✓" : "✗"}
              </div>
              <h3 className={`${styles.resultTitle} ${testResult.passed ? styles.resultTitlePassed : styles.resultTitleFailed}`}>
                {testResult.passed ? "Examen Aprobado" : "Examen No Aprobado"}
              </h3>
              <p className={styles.resultSubtitle}>
                {testResult.passed
                  ? "Certificacion agregada a tu perfil exitosamente."
                  : `Obtuviste ${testResult.score} de ${testResult.total} respuestas correctas. Necesitas el 100% para aprobar.`}
              </p>
              <div className={styles.scorePill}>
                <span className={testResult.passed ? styles.scorePassed : styles.scoreFailed}>
                  {testResult.score}/{testResult.total}
                </span>
                <span className={styles.scoreLabel}>respuestas correctas</span>
              </div>
            </div>

            <div className={styles.detailSection}>
              <p className={styles.detailHeader}>Detalle de Respuestas</p>
              <div className={styles.detailList}>
                {testResult.details.map((d, i) => (
                  <div key={i} className={d.correct ? styles.detailItemCorrect : styles.detailItemWrong}>
                    <div className={styles.detailQuestion}>{i + 1}. {d.question}</div>
                    {!d.correct && <div className={styles.detailYourAnswer}>Tu respuesta: {d.yourAnswer}</div>}
                    <div className={d.correct ? styles.detailCorrect : styles.detailCorrectNeutral}>
                      {d.correct ? "Correcta: " : "Respuesta correcta: "}{d.correctAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.resultBtns}>
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
