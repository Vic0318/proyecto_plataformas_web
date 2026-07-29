"use client";

import React, { useState } from "react";
import { Product } from "./TenderoView";
import {
  IconFactory,
  IconPlus,
  IconAlertTriangle,
  IconCheck,
  IconPackage
} from "@/components/Icons";
import styles from "./EmpresaDashboard.module.css";

interface EmpresaDashboardProps {
  products: Product[];
  minOrder: number;
  onUpdateMinOrder: (newMin: number) => void;
  onAddProduct: (newProd: Omit<Product, "id">) => void;
  onEditProduct: (updatedProd: Product) => void;
  onDeleteProduct: (id: string) => void;
  companyName?: string;
}

export const EmpresaDashboard: React.FC<EmpresaDashboardProps> = ({
  products,
  minOrder,
  onUpdateMinOrder,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  companyName = "Distribuidora Mayorista ISBEN",
}) => {
  const [minOrderInput, setMinOrderInput] = useState<number>(minOrder);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Abarrotes");
  const [price, setPrice] = useState(25.0);
  const [unitPack, setUnitPack] = useState("Paca de 12 unidades");
  const [stock, setStock] = useState(100);
  const [image, setImage] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Abarrotes");
  const [editPrice, setEditPrice] = useState(25.0);
  const [editUnitPack, setEditUnitPack] = useState("");
  const [editStock, setEditStock] = useState(100);
  const [editingTest, setEditingTest] = useState<{ id: number; title: string; passScore: string; questions?: string } | null>(null);
  const [editTestTitle, setEditTestTitle] = useState("");
  const [editTestPassScore, setEditTestPassScore] = useState("80%");
  const [editTestQuestions, setEditTestQuestions] = useState("");
  const [editTestFile, setEditTestFile] = useState<File | null>(null);

  const [showAddTestModal, setShowAddTestModal] = useState<boolean>(false);
  const [newTestPassScore, setNewTestPassScore] = useState("80%");
  const [newTestQuestions, setNewTestQuestions] = useState("");
  const [newTestFile, setNewTestFile] = useState<File | null>(null);

  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product | null>(null);
  const [confirmDeleteTest, setConfirmDeleteTest] = useState<{ id: number; title: string } | null>(null);

  const [tests, setTests] = useState<{ id: number; title: string; company: string; passScore: string }[]>([
    { id: 1, title: "Certificación en Manejo de Alimentos", company: "Proveedores Andinos S.A.", passScore: "80%" },
    { id: 2, title: "Test de Calidad de Productos de Limpieza", company: "Distribuidora del Pacífico", passScore: "90%" },
  ]);
  const [newTestTitle, setNewTestTitle] = useState("");

  const [retryRequests, setRetryRequests] = useState<{ id: number; testId: number; testTitle: string; freelancer: string; date: string; status: string }[]>([]);

  const handleApproveRetry = (reqId: number) => {
    setRetryRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "Aprobado" } : r));
  };

  const handleRejectRetry = (reqId: number) => {
    setRetryRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "Rechazado" } : r));
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("isben_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Token ${token}`;
    return headers;
  };

  React.useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/tests/", { headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mapped = data.map((t: any) => ({
              id: t.id,
              title: t.title,
              company: t.company,
              passScore: "85%"
            }));
            setTests(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading tests:", err);
      }
    };
    fetchTests();
  }, []);

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditCategory(p.category);
    setEditPrice(p.pricePerUnit);
    setEditUnitPack(p.unitPackName);
    setEditStock(p.stock);
    setEditImage(p.image);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onEditProduct({
      id: editingProduct.id,
      name: editName,
      category: editCategory,
      pricePerUnit: Number(editPrice),
      unitPackName: editUnitPack,
      stock: Number(editStock),
      image: editImage.trim(),
      companyName: editingProduct.companyName
    });
    setEditingProduct(null);
  };

  const startEditTest = (t: any) => {
    setEditingTest(t);
    setEditTestTitle(t.title);
    setEditTestPassScore(t.passScore || "80%");
    setEditTestQuestions(t.questions || "");
    setEditTestFile(null);
  };

  const handleSaveEditTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    try {
      const response = await fetch("http://localhost:8000/api/tests/", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: editingTest.id, title: editTestTitle, passScore: editTestPassScore })
      });
      if (response.ok) {
        const result = await response.json();
        setTests(prev => prev.map(t => t.id === result.id ? { ...t, title: result.title, passScore: result.passScore || editTestPassScore } : t));
      }
    } catch (err) {
      console.error("Error updating test:", err);
      setTests(prev => prev.map(t => t.id === editingTest.id ? { ...t, title: editTestTitle, passScore: editTestPassScore } : t));
    }
    setEditingTest(null);
  };

  const handleDeleteTest = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tests/?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setTests(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error("Error deleting test:", err);
      setTests(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveMinOrder = () => {
    onUpdateMinOrder(minOrderInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      name,
      category,
      pricePerUnit: Number(price),
      unitPackName: unitPack,
      stock: Number(stock),
      image: image.trim(),
      companyName: "Distribuidora Mayorista ISBEN",
    });
    setShowAddModal(false);
    setName("");
    setImage("");
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle) return;
    try {
      const response = await fetch("http://localhost:8000/api/tests/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newTestTitle,
          passScore: newTestPassScore,
          company: companyName,
          description: "Evaluacion creada desde el Panel de Empresa"
        }),
      });
      if (response.ok) {
        const createdTest = await response.json();
        setTests(prev => [...prev, { id: createdTest.id, title: createdTest.title, company: createdTest.company, passScore: createdTest.passScore || newTestPassScore }]);
      } else {
        setTests(prev => [...prev, { id: Date.now(), title: newTestTitle, company: companyName, passScore: newTestPassScore }]);
      }
    } catch (err) {
      console.error("Error creating test in backend:", err);
      setTests(prev => [...prev, { id: Date.now(), title: newTestTitle, company: companyName, passScore: newTestPassScore }]);
    }
    setShowAddTestModal(false);
    setNewTestTitle("");
    setNewTestPassScore("80%");
    setNewTestQuestions("");
    setNewTestFile(null);
  };

  const lowStockCount = products.filter((p) => p.stock < 20).length;

  return (
    <div className={styles.wrapper}>
      {/* Top Welcome & Summary Header */}
      <div className={`card-clean ${styles.topBanner}`}>
        <div>
          <span className="badge-clean badge-clean-neutral" style={{ marginBottom: "0.5rem", gap: "6px" }}>
            <IconFactory size={14} /> Panel de Empresa y Proveedor
          </span>
          <h2 className={styles.bannerTitle}>Gestión de Inventarios y Perfiles Calificados</h2>
          <p className={styles.bannerSubtitle}>
            Configura reglas comerciales, monitorea stock en tiempo real y certifica vendedores freelance.
          </p>
        </div>

        {/* Quick KPI Stats */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiBox}>
            <div className={styles.kpiLabel}>Total Productos</div>
            <div className={styles.kpiValuePrimary}>{products.length}</div>
          </div>
          <div className={styles.kpiBox}>
            <div className={styles.kpiLabel}>Stock Bajo</div>
            <div className={lowStockCount > 0 ? styles.kpiValueDanger : styles.kpiValueTeal}>
              {lowStockCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className={styles.twoColGrid}>
        
        {/* Min Order Config */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 className={styles.cardTitle}>Monto Mínimo de Compra</h3>
          <p className={styles.cardSubtitle}>
            Establece el límite mínimo en dólares que los tenderos deben alcanzar para procesar un pedido mayorista.
          </p>
          <div className={styles.minOrderRow}>
            <div className={styles.minOrderInputWrapper}>
              <span className={styles.dollarSign}>$</span>
              <input
                type="number"
                value={minOrderInput}
                onChange={(e) => setMinOrderInput(Number(e.target.value))}
                className={styles.minOrderInput}
              />
            </div>
            <button onClick={handleSaveMinOrder} className="btn btn-primary">Guardar</button>
          </div>
          {saveSuccess && (
            <div className={styles.saveSuccess}>Monto minimo de compra actualizado con exito.</div>
          )}
        </div>

        {/* ERP Integration */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 className={styles.cardTitle}>Integración ERP y Sistema Contable</h3>
          <p className={styles.cardSubtitle}>
            Sincronización automática de inventario y facturas vía API REST con tu sistema externo (ej. SAP, QuickBooks).
          </p>
          <div className={styles.erpRow}>
            <span className={styles.erpLabel}>
              <IconCheck size={16} /> API REST Conectada (En línea)
            </span>
            <button className="btn btn-outline" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>Configurar API</button>
          </div>
        </div>

      </div>

      {/* Product Catalog Management */}
      <div className={`card-clean ${styles.catalogCard}`}>
        <div className={styles.catalogHeader}>
          <div>
            <h3 className={styles.catalogTitle}>Catálogo e Inventario Mayorista</h3>
            <p className={styles.catalogSubtitle}>Supervisa las existencias y recibe alertas de stock bajo</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: "6px" }}>
            <IconPlus size={16} /> Nuevo Producto
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Presentación</th>
                <th>Precio Mayorista</th>
                <th>Stock Disponible</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className={styles.tdProductName}>
                    <img src={p.image} alt={p.name} className={styles.productThumb} />
                    {p.name}
                  </td>
                  <td>{p.category}</td>
                  <td>{p.unitPackName}</td>
                  <td className={styles.tdPrice}>${p.pricePerUnit.toFixed(2)}</td>
                  <td className={styles.tdStock}>{p.stock} unidades</td>
                  <td>
                    {p.stock < 20 ? (
                      <span className="badge-clean badge-clean-primary" style={{ gap: "4px" }}>
                        <IconAlertTriangle size={14} /> Stock Bajo
                      </span>
                    ) : (
                      <span className="badge-clean badge-clean-success" style={{ gap: "4px" }}>
                        <IconCheck size={14} /> Óptimo
                      </span>
                    )}
                  </td>
                  <td className={styles.tdActions}>
                    <button onClick={() => startEdit(p)} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", marginRight: "0.5rem" }}>Editar</button>
                    <button onClick={() => setConfirmDeleteProduct(p)} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", color: "var(--primary)", borderColor: "var(--primary)" }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certification Tests */}
      <div className={`card-clean ${styles.testsCard}`}>
        <h3 className={styles.testsTitle}>Evaluación de Perfiles Calificados para Freelancers</h3>
        <p className={styles.testsSubtitle}>
          Las empresas que requieren perfiles certificados pueden crear evaluaciones obligatorias aquí.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
          <button onClick={() => setShowAddTestModal(true)} className="btn btn-outline" style={{ gap: "6px" }}>
            <IconPlus size={16} /> Crear Evaluación
          </button>
        </div>

        <div className={styles.testsGrid}>
          {tests.map((test) => (
            <div key={test.id} className={styles.testItem}>
              <div>
                <div className={styles.testItemTitle}>{test.title}</div>
                <div className={styles.testItemScore}>Puntaje mínimo requerido: {test.passScore}</div>
              </div>
              <div className={styles.testItemFooter}>
                <span className="badge-clean badge-clean-primary">Activo</span>
                <div className={styles.testItemBtns}>
                  <button onClick={() => startEditTest(test)} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Editar</button>
                  <button onClick={() => setConfirmDeleteTest(test)} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "var(--primary)", borderColor: "var(--primary)" }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retry Requests */}
      <div className={`card-clean ${styles.retryCard}`}>
        <h3 className={styles.testsTitle}>Solicitudes de Reintento de Examen</h3>
        <p className={styles.testsSubtitle}>
          Revisa y aprueba las solicitudes de freelancers que reprobaron y desean volver a intentar la evaluacion.
        </p>

        {retryRequests.length === 0 ? (
          <div className={styles.noRequests}>No hay solicitudes pendientes en este momento.</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Freelancer</th>
                  <th>Examen</th>
                  <th>Fecha Solicitud</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Accion</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {retryRequests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 700 }}>{req.freelancer}</td>
                    <td>{req.testTitle}</td>
                    <td style={{ color: "var(--text-muted)" }}>{req.date}</td>
                    <td>
                      <span className={`badge-clean ${
                        req.status === "Aprobado" ? "badge-clean-success" :
                        req.status === "Rechazado" ? "badge-clean-neutral" :
                        "badge-clean-primary"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className={styles.tdRetryActions}>
                      {req.status === "Pendiente" && (
                        <>
                          <button onClick={() => handleRejectRetry(req.id)} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", marginRight: "0.5rem" }}>
                            Rechazar
                          </button>
                          <button onClick={() => handleApproveRetry(req.id)} className="btn btn-primary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
                            Aprobar Intento
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={`card-clean ${styles.modalCard}`}>
            <h3 className={styles.modalTitle}>Agregar Producto Mayorista</h3>
            <form onSubmit={handleCreateProduct} className={styles.modalForm}>
              <div>
                <label className={styles.fieldLabel}>Nombre del Producto</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.fieldSelect}>
                  <option value="Abarrotes">Abarrotes</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Cuidado Personal">Cuidado Personal</option>
                </select>
              </div>
              <div className={styles.twoInputRow}>
                <div className={styles.inputFlex}>
                  <label className={styles.fieldLabel}>Precio ($ USD)</label>
                  <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={styles.fieldInput} />
                </div>
                <div className={styles.inputFlex}>
                  <label className={styles.fieldLabel}>Stock Inicial</label>
                  <input required type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className={styles.fieldInput} />
                </div>
              </div>
              <div>
                <label className={styles.fieldLabel}>Presentación de Paca/Caja</label>
                <input required type="text" value={unitPack} onChange={(e) => setUnitPack(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Imagen del Producto (URL o ruta local, opcional)</label>
                <input type="text" placeholder="https://ejemplo.com/imagen.jpg" value={image} onChange={(e) => setImage(e.target.value)} className={styles.fieldInput} />
              </div>
              <div className={styles.modalBtnRow}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className={styles.modalOverlay}>
          <div className={`card-clean ${styles.modalCard}`}>
            <h3 className={styles.modalTitle}>Editar Producto Mayorista</h3>
            <form onSubmit={handleSaveEditProduct} className={styles.modalForm}>
              <div>
                <label className={styles.fieldLabel}>Nombre del Producto</label>
                <input required type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Categoría</label>
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className={styles.fieldSelect}>
                  <option value="Abarrotes">Abarrotes</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Cuidado Personal">Cuidado Personal</option>
                </select>
              </div>
              <div className={styles.twoInputRow}>
                <div className={styles.inputFlex}>
                  <label className={styles.fieldLabel}>Precio ($ USD)</label>
                  <input required type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className={styles.fieldInput} />
                </div>
                <div className={styles.inputFlex}>
                  <label className={styles.fieldLabel}>Stock Disponible</label>
                  <input required type="number" value={editStock} onChange={(e) => setEditStock(Number(e.target.value))} className={styles.fieldInput} />
                </div>
              </div>
              <div>
                <label className={styles.fieldLabel}>Presentación de Paca/Caja</label>
                <input required type="text" value={editUnitPack} onChange={(e) => setEditUnitPack(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Imagen del Producto (URL o ruta local)</label>
                <input type="text" value={editImage} onChange={(e) => setEditImage(e.target.value)} className={styles.fieldInput} />
              </div>
              <div className={styles.modalBtnRow}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Test Modal */}
      {showAddTestModal && (
        <div className={styles.modalOverlay}>
          <div className="card-clean" style={{ width: "90%", maxWidth: "500px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 className={styles.modalTitle}>Crear Nueva Evaluación</h3>
            <form onSubmit={handleCreateTest} className={styles.modalForm}>
              <div>
                <label className={styles.fieldLabel}>Título de la Evaluación</label>
                <input required type="text" value={newTestTitle} onChange={(e) => setNewTestTitle(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Puntaje mínimo requerido</label>
                <input required type="text" value={newTestPassScore} onChange={(e) => setNewTestPassScore(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Preguntas de la Evaluación (Opcional, una por línea)</label>
                <textarea
                  rows={4}
                  value={newTestQuestions}
                  onChange={(e) => setNewTestQuestions(e.target.value)}
                  className={styles.fieldInput}
                  style={{ resize: "vertical" }}
                  placeholder="Ej: ¿Cuál es la temperatura ideal de conservación?..."
                />
              </div>
              <div>
                <label className={styles.fieldLabel}>O subir formato de prueba (PDF/DOCX)</label>
                <input
                  type="file"
                  onChange={(e) => setNewTestFile(e.target.files ? e.target.files[0] : null)}
                  className={styles.fieldInput}
                  accept=".pdf,.doc,.docx"
                  style={{ padding: "0.5rem" }}
                />
              </div>
              <div className={styles.modalBtnRow}>
                <button type="button" onClick={() => setShowAddTestModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Crear Evaluación</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Test Modal */}
      {editingTest && (
        <div className={styles.modalOverlay}>
          <div className="card-clean" style={{ width: "90%", maxWidth: "500px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 className={styles.modalTitle}>Editar Evaluación / Certificación</h3>
            <form onSubmit={handleSaveEditTest} className={styles.modalForm}>
              <div>
                <label className={styles.fieldLabel}>Título de la Evaluación</label>
                <input required type="text" value={editTestTitle} onChange={(e) => setEditTestTitle(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Puntaje mínimo requerido</label>
                <input required type="text" value={editTestPassScore} onChange={(e) => setEditTestPassScore(e.target.value)} className={styles.fieldInput} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Preguntas de la Evaluación</label>
                <textarea
                  rows={4}
                  value={editTestQuestions}
                  onChange={(e) => setEditTestQuestions(e.target.value)}
                  className={styles.fieldInput}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div>
                <label className={styles.fieldLabel}>Actualizar formato de prueba (PDF/DOCX)</label>
                <input
                  type="file"
                  onChange={(e) => setEditTestFile(e.target.files ? e.target.files[0] : null)}
                  className={styles.fieldInput}
                  accept=".pdf,.doc,.docx"
                  style={{ padding: "0.5rem" }}
                />
              </div>
              <div className={styles.modalBtnRow}>
                <button type="button" onClick={() => setEditingTest(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Product Modal */}
      {confirmDeleteProduct && (
        <div className={styles.confirmOverlay}>
          <div className={`card-clean ${styles.confirmCard}`}>
            <div className={styles.confirmIcon}>&#9888;</div>
            <h3 className={styles.confirmTitle}>Confirmar Eliminacion</h3>
            <p className={styles.confirmText}>Estas a punto de eliminar el siguiente producto del catalogo:</p>
            <div className={styles.confirmProductRow}>
              <img src={confirmDeleteProduct.image} alt={confirmDeleteProduct.name} className={styles.confirmProductThumb} />
              <div>
                <div className={styles.confirmProductName}>{confirmDeleteProduct.name}</div>
                <div className={styles.confirmProductMeta}>{confirmDeleteProduct.category} &mdash; ${confirmDeleteProduct.pricePerUnit.toFixed(2)} USD</div>
              </div>
            </div>
            <p className={styles.confirmWarning}>Esta accion no se puede deshacer. El producto sera eliminado permanentemente.</p>
            <div className={styles.confirmBtnRow}>
              <button onClick={() => setConfirmDeleteProduct(null)} className="btn btn-outline" style={{ flex: 1, padding: "0.75rem" }}>Cancelar</button>
              <button
                onClick={() => { onDeleteProduct(confirmDeleteProduct.id); setConfirmDeleteProduct(null); }}
                className="btn btn-primary"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                Si, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Test Modal */}
      {confirmDeleteTest && (
        <div className={styles.confirmOverlay}>
          <div className={`card-clean ${styles.confirmCard}`}>
            <div className={styles.confirmIcon}>&#9888;</div>
            <h3 className={styles.confirmTitle}>Confirmar Eliminacion</h3>
            <p className={styles.confirmText}>Estas a punto de eliminar la siguiente evaluacion de certificacion:</p>
            <div className={styles.confirmTestRow}>
              <div className={styles.confirmTestTitle}>{confirmDeleteTest.title}</div>
            </div>
            <p className={styles.confirmWarning}>Esta accion no se puede deshacer. Los resultados de los freelancers asociados tambien se perderan.</p>
            <div className={styles.confirmBtnRow}>
              <button onClick={() => setConfirmDeleteTest(null)} className="btn btn-outline" style={{ flex: 1, padding: "0.75rem" }}>Cancelar</button>
              <button
                onClick={() => { handleDeleteTest(confirmDeleteTest.id); setConfirmDeleteTest(null); }}
                className="btn btn-primary"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                Si, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
