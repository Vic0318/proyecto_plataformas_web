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

  // New product form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Abarrotes");
  const [price, setPrice] = useState(25.0);
  const [unitPack, setUnitPack] = useState("Paca de 12 unidades");
  const [stock, setStock] = useState(100);
  const [image, setImage] = useState("");

  // Edit product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Abarrotes");
  const [editPrice, setEditPrice] = useState(25.0);
  const [editUnitPack, setEditUnitPack] = useState("");
  const [editStock, setEditStock] = useState(100);
  const [editImage, setEditImage] = useState("");

  // Edit test states
  const [editingTest, setEditingTest] = useState<{ id: number; title: string } | null>(null);
  const [editTestTitle, setEditTestTitle] = useState("");

  const [tests, setTests] = useState([
    { id: 1, title: "Certificación Manejo de Cadena de Frío", company: "Lácteos del Sur", passScore: "80%" },
    { id: 2, title: "Test de Conocimiento de Productos Farmacéuticos", company: "FarmaGlobal", passScore: "90%" },
  ]);
  const [newTestTitle, setNewTestTitle] = useState("");

  // Helper: token de autenticacion
  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("isben_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Token ${token}`;
    return headers;
  };

  // Load tests from backend on mount
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
  };

  const handleSaveEditTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    try {
      const response = await fetch("http://localhost:8000/api/tests/", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: editingTest.id,
          title: editTestTitle
        })
      });
      if (response.ok) {
        const result = await response.json();
        setTests(prev => prev.map(t => t.id === result.id ? { ...t, title: result.title } : t));
      }
    } catch (err) {
      console.error("Error updating test:", err);
      setTests(prev => prev.map(t => t.id === editingTest.id ? { ...t, title: editTestTitle } : t));
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
          company: companyName,
          description: "Evaluacion creada desde el Panel de Empresa"
        }),
      });
      if (response.ok) {
        const createdTest = await response.json();
        setTests(prev => [...prev, { id: createdTest.id, title: createdTest.title, company: createdTest.company, passScore: "85%" }]);
      } else {
        setTests(prev => [...prev, { id: Date.now(), title: newTestTitle, company: companyName, passScore: "85%" }]);
      }
    } catch (err) {
      console.error("Error creating test in backend:", err);
      setTests(prev => [...prev, { id: Date.now(), title: newTestTitle, company: companyName, passScore: "85%" }]);
    }
    setNewTestTitle("");
  };

  const lowStockCount = products.filter((p) => p.stock < 20).length;

  return (
    <div style={{ padding: "2rem 0 4rem" }}>
      {/* Top Welcome & Summary Header */}
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
            <IconFactory size={14} /> Panel de Empresa y Proveedor
          </span>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Gestión de Inventarios y Perfiles Calificados</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Configura reglas comerciales, monitorea stock en tiempo real y certifica vendedores freelance.
          </p>
        </div>

        {/* Quick KPI Stats */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ background: "var(--bg-tertiary)", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Productos</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>{products.length}</div>
          </div>
          <div style={{ background: "var(--bg-tertiary)", padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Stock Bajo</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: lowStockCount > 0 ? "var(--danger)" : "var(--accent-teal)" }}>
              {lowStockCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        
        {/* Configuración de Monto Mínimo de Pedido */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Monto Mínimo de Compra
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Establece el límite mínimo en dólares que los tenderos deben alcanzar para procesar un pedido mayorista.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: "12px", top: "8px", fontWeight: 700, color: "var(--text-muted)" }}>$</span>
              <input
                type="number"
                value={minOrderInput}
                onChange={(e) => setMinOrderInput(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.55rem 0.55rem 2rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "1rem"
                }}
              />
            </div>
            <button onClick={handleSaveMinOrder} className="btn btn-primary">
              Guardar
            </button>
          </div>
          {saveSuccess && (
            <div style={{ fontSize: "0.8rem", color: "var(--accent-teal)", marginTop: "0.5rem", fontWeight: 600 }}>
              Monto minimo de compra actualizado con exito.
            </div>
          )}
        </div>

        {/* Conexión ERP / Sistema Contable */}
        <div className="card-clean" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Integración ERP y Sistema Contable
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Sincronización automática de inventario y facturas vía API REST con tu sistema externo (ej. SAP, QuickBooks).
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(13, 148, 136, 0.08)", border: "1px solid rgba(13, 148, 136, 0.2)", padding: "0.65rem 1rem", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-teal)", display: "flex", alignItems: "center", gap: "6px" }}>
              <IconCheck size={16} /> API REST Conectada (En línea)
            </span>
            <button className="btn btn-outline" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>Configurar API</button>
          </div>
        </div>

      </div>

      {/* Product Catalog Management */}
      <div className="card-clean" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Catálogo e Inventario Mayorista</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Supervisa las existencias y recibe alertas de stock bajo</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: "6px" }}>
            <IconPlus size={16} /> Nuevo Producto
          </button>
        </div>

        {/* Products Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                <th style={{ padding: "0.75rem" }}>Producto</th>
                <th style={{ padding: "0.75rem" }}>Categoría</th>
                <th style={{ padding: "0.75rem" }}>Presentación</th>
                <th style={{ padding: "0.75rem" }}>Precio Mayorista</th>
                <th style={{ padding: "0.75rem" }}>Stock Disponible</th>
                <th style={{ padding: "0.75rem" }}>Estado</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.9rem" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <img src={p.image} alt={p.name} style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                    {p.name}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{p.category}</td>
                  <td style={{ padding: "0.75rem" }}>{p.unitPackName}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>${p.pricePerUnit.toFixed(2)}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 700 }}>{p.stock} unidades</td>
                  <td style={{ padding: "0.75rem" }}>
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
                  <td style={{ padding: "0.75rem", textAlign: "right" }}>
                    <button onClick={() => startEdit(p)} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", marginRight: "0.5rem" }}>Editar</button>
                    <button onClick={() => onDeleteProduct(p.id)} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", color: "var(--primary)", borderColor: "var(--primary)" }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module: Certification Tests for Freelancers */}
      <div className="card-clean" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Evaluación de Perfiles Calificados para Freelancers
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          Las empresas que requieren perfiles certificados pueden crear evaluaciones obligatorias aquí.
        </p>

        <form onSubmit={handleCreateTest} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Título de la nueva prueba o curso de certificación..."
            value={newTestTitle}
            onChange={(e) => setNewTestTitle(e.target.value)}
            style={{
              flex: 1,
              padding: "0.6rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              fontSize: "0.9rem"
            }}
          />
          <button type="submit" className="btn btn-outline">Crear Evaluación</button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {tests.map((test) => (
            <div key={test.id} style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: "0.25rem", fontSize: "0.9rem" }}>{test.title}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Puntaje mínimo requerido: {test.passScore}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                <span className="badge-clean badge-clean-primary">Activo</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => startEditTest(test)} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Editar</button>
                  <button onClick={() => handleDeleteTest(test.id)} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "var(--primary)", borderColor: "var(--primary)" }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div className="card-clean" style={{ width: "90%", maxWidth: "480px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>Agregar Producto Mayorista</h3>
            <form onSubmit={handleCreateProduct} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Nombre del Producto</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  <option value="Abarrotes">Abarrotes</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Cuidado Personal">Cuidado Personal</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Precio ($ USD)</label>
                  <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Stock Inicial</label>
                  <input required type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Presentación de Paca/Caja</label>
                <input required type="text" value={unitPack} onChange={(e) => setUnitPack(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Imagen del Producto (URL o ruta local, opcional)</label>
                <input type="text" placeholder="https://ejemplo.com/imagen.jpg o ruta local" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div className="card-clean" style={{ width: "90%", maxWidth: "480px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>Editar Producto Mayorista</h3>
            <form onSubmit={handleSaveEditProduct} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Nombre del Producto</label>
                <input required type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Categoría</label>
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  <option value="Abarrotes">Abarrotes</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Cuidado Personal">Cuidado Personal</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Precio ($ USD)</label>
                  <input required type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Stock Disponible</label>
                  <input required type="number" value={editStock} onChange={(e) => setEditStock(Number(e.target.value))} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Presentación de Paca/Caja</label>
                <input required type="text" value={editUnitPack} onChange={(e) => setEditUnitPack(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Imagen del Producto (URL o ruta local)</label>
                <input type="text" value={editImage} onChange={(e) => setEditImage(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Test Modal */}
      {editingTest && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 210 }}>
          <div className="card-clean" style={{ width: "90%", maxWidth: "440px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>Editar Evaluación / Certificación</h3>
            <form onSubmit={handleSaveEditTest} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Título de la Evaluación</label>
                <input required type="text" value={editTestTitle} onChange={(e) => setEditTestTitle(e.target.value)} style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setEditingTest(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
