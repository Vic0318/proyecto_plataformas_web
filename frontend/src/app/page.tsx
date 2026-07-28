"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LandingPage } from "@/components/LandingPage";
import { AuthModal } from "@/components/AuthModal";
import { RegisterModal } from "@/components/RegisterModal";
import { TenderoView, Product } from "@/components/TenderoView";
import { EmpresaDashboard } from "@/components/EmpresaDashboard";
import { FreelancePortal } from "@/components/FreelancePortal";
import { AdminPanel } from "@/components/AdminPanel";
import { IconShoppingCart, IconShieldCheck, IconPackage } from "@/components/Icons";

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Aceite Vegetal D'Oliva 1L",
    category: "Abarrotes",
    pricePerUnit: 34.50,
    unitPackName: "Paca de 12 botellas (1L c/u)",
    stock: 85,
    image: "/groceries_pack.png",
    companyName: "Distribuidora Mayorista ISBEN",
  },
  {
    id: "prod-2",
    name: "Arroz Grano Largo Superior",
    category: "Abarrotes",
    pricePerUnit: 28.00,
    unitPackName: "Saco de 50 kg",
    stock: 12,
    image: "/groceries_pack.png",
    companyName: "Distribuidora Mayorista ISBEN",
    isLowStock: true,
  },
  {
    id: "prod-3",
    name: "Pack Jugos Frutales Surtidos",
    category: "Bebidas",
    pricePerUnit: 18.50,
    unitPackName: "Paca termoencogible x 24 unidades",
    stock: 150,
    image: "/beverages_pack.png",
    companyName: "Bebidas del Ecuador S.A.",
  },
  {
    id: "prod-4",
    name: "Agua Mineral Natural 500ml",
    category: "Bebidas",
    pricePerUnit: 12.00,
    unitPackName: "Paca x 24 botellas",
    stock: 200,
    image: "/beverages_pack.png",
    companyName: "Bebidas del Ecuador S.A.",
  },
  {
    id: "prod-5",
    name: "Detergente Líquido Multiusos",
    category: "Limpieza",
    pricePerUnit: 42.00,
    unitPackName: "Caja de 6 galones (3.78L)",
    stock: 40,
    image: "/cleaning_pack.png",
    companyName: "Limpieza & Hogar Pro",
  },
  {
    id: "prod-6",
    name: "Jabón Desinfectante Antibacterial",
    category: "Limpieza",
    pricePerUnit: 22.50,
    unitPackName: "Caja x 36 pastillas",
    stock: 8,
    image: "/cleaning_pack.png",
    companyName: "Limpieza & Hogar Pro",
    isLowStock: true,
  },
];

export default function Home() {
  const [viewState, setViewState] = useState<"landing" | "portal">("landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  const [currentRole, setCurrentRole] = useState<"tendero" | "empresa" | "freelance" | "admin">("tendero");
  const [username, setUsername] = useState<string>("Abarrotes Don Pepe");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [minOrder, setMinOrder] = useState<number>(60.0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [depositPercent, setDepositPercent] = useState<number>(100);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyOrders, setHistoryOrders] = useState<Array<{ id: string; date: string; status: string; total: number }>>([
    { id: "#1024", date: "26/07/2026", status: "Pagado", total: 74.00 },
    { id: "#1023", date: "25/07/2026", status: "Entregado", total: 128.50 },
    { id: "#1022", date: "24/07/2026", status: "Entregado", total: 60.00 }
  ]);
  const [checkoutResult, setCheckoutResult] = useState<{
    success: boolean;
    isRealDb?: boolean;
    total?: number;
    paidAmount?: number;
    depositPercent?: number;
    errorMsg?: string;
  } | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("isben_role");
    const savedUser = localStorage.getItem("isben_username");
    const savedViewState = localStorage.getItem("isben_viewState");
    const savedTheme = localStorage.getItem("isben_theme");
    
    if (savedRole && savedUser && savedViewState) {
      setCurrentRole(savedRole as "tendero" | "empresa" | "freelance" | "admin");
      setUsername(savedUser);
      setViewState(savedViewState as "landing" | "portal");
      setIsSessionActive(true);
    }
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
    }
  }, []);

  // Helper: devuelve los headers con el token de autenticacion si existe
  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("isben_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Token ${token}`;
    return headers;
  };

  // Load user order history from backend when history modal opens
  useEffect(() => {
    if (isHistoryOpen && isSessionActive) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/pedidos/?clientName=${encodeURIComponent(username)}`, {
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setHistoryOrders(data);
            }
          }
        } catch (err) {
          console.error("Error fetching order history:", err);
        }
      };
      fetchHistory();
    }
  }, [isHistoryOpen, isSessionActive, username]);

  // Load products and minimum order from API on mount
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("isben_token");
      if (!token) return; // Solo carga si hay sesion activa con token
      try {
        const authHeaders = getAuthHeaders();
        const prodRes = await fetch("http://localhost:8000/api/productos/", { headers: authHeaders });
        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (prods && prods.length > 0) {
            setProducts(prods);
          }
        }
        
        const minOrderRes = await fetch("http://localhost:8000/api/min-order/", { headers: authHeaders });
        if (minOrderRes.ok) {
          const minData = await minOrderRes.json();
          setMinOrder(minData.minOrder);
        }
      } catch (err) {
        console.error("Error cargando datos del backend:", err);
      }
    };
    loadData();
  }, [isSessionActive]);

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("isben_theme", nextTheme);
  };

  const handleLoginSuccess = (role: "tendero" | "empresa" | "freelance" | "admin", name: string, token?: string) => {
    setCurrentRole(role);
    setUsername(name);
    setViewState("portal");
    setIsSessionActive(true);
    localStorage.setItem("isben_role", role);
    localStorage.setItem("isben_username", name);
    localStorage.setItem("isben_viewState", "portal");
    if (token) localStorage.setItem("isben_token", token);
  };

  const handleSelectRoleDemo = (role: "tendero" | "empresa" | "freelance" | "admin") => {
    let name = "Usuario ISBEN";
    if (role === "tendero") name = "Abarrotes Don Pepe";
    if (role === "empresa") name = "Distribuidora Mayorista ISBEN";
    if (role === "freelance") name = "Carlos Vendedor Freelance";
    if (role === "admin") name = "Administrador Sistema";

    setCurrentRole(role);
    setUsername(name);
    setViewState("portal");
    setIsSessionActive(true);
    localStorage.setItem("isben_role", role);
    localStorage.setItem("isben_username", name);
    localStorage.setItem("isben_viewState", "portal");
  };

  const handleLogout = () => {
    setViewState("landing");
    setIsSessionActive(false);
    localStorage.removeItem("isben_role");
    localStorage.removeItem("isben_username");
    localStorage.removeItem("isben_viewState");
    localStorage.removeItem("isben_token");
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      const nextQty = Math.max(0, currentQty + delta);
      if (nextQty === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: nextQty };
    });
  };

  const handleAddProduct = async (newProd: Omit<Product, "id">) => {
    try {
      const response = await fetch("http://localhost:8000/api/productos/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newProd),
      });
      if (response.ok) {
        const createdProd = await response.json();
        setProducts((prev) => [createdProd, ...prev]);
      } else {
        const created: Product = {
          ...newProd,
          id: `prod-${Date.now()}`,
        };
        setProducts((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error("Error al crear producto en backend:", err);
      const created: Product = {
        ...newProd,
        id: `prod-${Date.now()}`,
      };
      setProducts((prev) => [created, ...prev]);
    }
  };

  const handleEditProduct = async (updated: Product) => {
    try {
      const response = await fetch("http://localhost:8000/api/productos/", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: updated.id,
          name: updated.name,
          pricePerUnit: updated.pricePerUnit,
          stock: updated.stock,
          unitPackName: updated.unitPackName,
          image: updated.image
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setProducts(prev => prev.map(p => p.id === result.id ? { ...p, ...result } : p));
      }
    } catch (err) {
      console.error("Error editing product:", err);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/productos/?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handlePlaceOrderForClient = (clientName: string, productId: string, quantity: number) => {
    handleUpdateQuantity(productId, quantity);
  };

  const handleUpdateMinOrder = async (newMin: number) => {
    setMinOrder(newMin);
    try {
      await fetch("http://localhost:8000/api/min-order/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ minOrder: newMin }),
      });
    } catch (err) {
      console.error("Error actualizando monto minimo:", err);
    }
  };

  // Calculations
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const p = products.find((prod) => prod.id === pId);
    return sum + (p ? p.pricePerUnit * qty : 0);
  }, 0);

  const isMinOrderReached = cartTotal >= minOrder;

  const handleCompletePayment = async () => {
    const paidAmount = (cartTotal * depositPercent) / 100;
    
    try {
      const response = await fetch("http://localhost:8000/api/pedidos/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cart,
          clientName: username,
        }),
      });
      
      if (response.ok) {
        const resData = await response.json();
        const orderIdDisplay = resData.orderIds && resData.orderIds.length > 0 
          ? `#${1000 + resData.orderIds[0]}` 
          : `#${Math.floor(1000 + Math.random() * 9000)}`;

        const newTx = {
          id: orderIdDisplay,
          date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }),
          status: "Pagado",
          total: cartTotal
        };
        setHistoryOrders(prev => [newTx, ...prev]);

        setCheckoutResult({
          success: true,
          isRealDb: true,
          total: cartTotal,
          paidAmount: paidAmount,
          depositPercent: depositPercent
        });
      } else {
        setCheckoutResult({
          success: false,
          errorMsg: "Ocurrio un error al procesar el pedido en el servidor."
        });
      }
    } catch (err) {
      console.error("Error al realizar pedido:", err);
      const newTx = {
        id: `#${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }),
        status: "Pagado",
        total: cartTotal
      };
      setHistoryOrders(prev => [newTx, ...prev]);

      setCheckoutResult({
        success: true,
        isRealDb: false,
        total: cartTotal,
        paidAmount: paidAmount,
        depositPercent: depositPercent
      });
    }
    
    setCart({});
    setIsCartOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {viewState === "landing" ? (
        /* Public Landing Page */
        <LandingPage
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onOpenRegister={() => setIsRegisterModalOpen(true)}
          onSelectRoleDemo={handleSelectRoleDemo}
          theme={theme}
          onToggleTheme={toggleTheme}
          isLoggedIn={isSessionActive}
          onGoToPortal={() => {
            setViewState("portal");
            localStorage.setItem("isben_viewState", "portal");
          }}
        />
      ) : (
        /* Logged-in User Portal */
        <>
          <Header
            currentRole={currentRole}
            username={username}
            onLogout={handleLogout}
            onGoHome={() => {
              setViewState("landing");
              localStorage.setItem("isben_viewState", "landing");
            }}
            theme={theme}
            onToggleTheme={toggleTheme}
            cartCount={cartCount}
            cartTotal={cartTotal}
            minOrder={minOrder}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />

          <main className="container" style={{ flex: 1 }}>
            {currentRole === "tendero" && (
              <TenderoView
                products={products}
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                cartTotal={cartTotal}
                minOrder={minOrder}
                onCheckout={() => setIsCartOpen(true)}
              />
            )}

            {currentRole === "empresa" && (
              <EmpresaDashboard
                products={products}
                minOrder={minOrder}
                onUpdateMinOrder={handleUpdateMinOrder}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                companyName={username}
              />
            )}

            {currentRole === "freelance" && (
              <FreelancePortal
                products={products}
                onPlaceOrderForClient={handlePlaceOrderForClient}
                freelancerName={username}
              />
            )}

            {currentRole === "admin" && <AdminPanel />}
          </main>
        </>
      )}

      {/* Floating Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleLoginSuccess}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Cart & Checkout Drawer */}
      {viewState === "portal" && isCartOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end", zIndex: 200 }}>
          <div
            className="card-clean"
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "100%",
              borderRadius: 0,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconShoppingCart size={20} /> Tu Pedido Mayorista
                </h3>
                <button onClick={() => setIsCartOpen(false)} style={{ background: "transparent", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--text-primary)" }}>✕</button>
              </div>

              {cartCount === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
                  <IconPackage size={42} style={{ marginBottom: "0.5rem" }} />
                  <p>Tu carrito está vacío.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {Object.entries(cart).map(([pId, qty]) => {
                    const p = products.find((prod) => prod.id === pId);
                    if (!p) return null;
                    return (
                      <div key={pId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-tertiary)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{p.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{qty} x ${p.pricePerUnit.toFixed(2)} USD</div>
                        </div>
                        <div style={{ fontWeight: 800, color: "var(--primary)" }}>
                          ${(p.pricePerUnit * qty).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cartCount > 0 && (
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
                {!isMinOrderReached ? (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1rem", textAlign: "center", color: "var(--danger)", fontSize: "0.85rem" }}>
                    Faltan ${(minOrder - cartTotal).toFixed(2)} USD para el mínimo (${minOrder} USD).
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <IconShieldCheck size={16} /> Depósito Adelantado (PCI-DSS)
                      </label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setDepositPercent(50)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                            background: depositPercent === 50 ? "var(--primary)" : "var(--bg-tertiary)",
                            color: depositPercent === 50 ? "#fff" : "var(--text-primary)",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          50% (${(cartTotal * 0.5).toFixed(2)})
                        </button>
                        <button
                          onClick={() => setDepositPercent(100)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                            background: depositPercent === 100 ? "var(--primary)" : "var(--bg-tertiary)",
                            color: depositPercent === 100 ? "#fff" : "var(--text-primary)",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          100% (${cartTotal.toFixed(2)})
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem" }}>
                      <span>Total Pedido:</span>
                      <span style={{ color: "var(--primary)" }}>${cartTotal.toFixed(2)} USD</span>
                    </div>

                    <button onClick={handleCompletePayment} className="btn btn-primary" style={{ width: "100%", padding: "0.8rem", gap: "8px" }}>
                      <IconShieldCheck size={18} /> Pagar con Tarjeta (PCI-DSS)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "1rem" }}>
          <div className="card-clean" style={{ width: "100%", maxWidth: "500px", padding: "2rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Configuracion de Usuario</h3>
              <button onClick={() => setIsSettingsOpen(false)} style={{ background: "transparent", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--text-primary)" }}>✕</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Idioma de la Interfaz</label>
                <select style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  <option>Espanol (America Latina)</option>
                  <option>English (US)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Moneda de Transaccion</label>
                <select style={{ width: "100%", padding: "0.6rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  <option>USD - Dolares Americanos</option>
                  <option>EUR - Euros</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Notificaciones del Sistema</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ width: "16px", height: "16px" }} />
                    Alertas de stock bajo de productos
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ width: "16px", height: "16px" }} />
                    Confirmaciones de entrega de pedidos
                  </label>
                </div>
              </div>
            </div>

            <button onClick={() => setIsSettingsOpen(false)} className="btn btn-primary" style={{ width: "100%", padding: "0.8rem" }}>
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "1rem" }}>
          <div className="card-clean" style={{ width: "100%", maxWidth: "600px", padding: "2rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Historial de Transacciones</h3>
              <button onClick={() => setIsHistoryOpen(false)} style={{ background: "transparent", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--text-primary)" }}>✕</button>
            </div>

            <div style={{ maxHeight: "320px", overflowY: "auto", marginBottom: "1.5rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "0.5rem" }}>Pedido</th>
                    <th style={{ padding: "0.5rem" }}>Fecha</th>
                    <th style={{ padding: "0.5rem" }}>Estado</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {historyOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "0.75rem 0.5rem", fontWeight: 700 }}>{o.id}</td>
                      <td style={{ padding: "0.75rem 0.5rem" }}>{o.date}</td>
                      <td style={{ padding: "0.75rem 0.5rem" }}>
                        <span style={{ 
                          background: o.status === "Pagado" ? "rgba(13, 148, 136, 0.15)" : "rgba(16,185,129,0.15)", 
                          color: "var(--accent-teal)", 
                          padding: "2px 8px", 
                          borderRadius: "var(--radius-sm)", 
                          fontSize: "0.75rem", 
                          fontWeight: 700 
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 0.5rem", textAlign: "right", fontWeight: 800 }}>${o.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => setIsHistoryOpen(false)} className="btn btn-primary" style={{ width: "100%", padding: "0.8rem" }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Checkout Success / Result Modal */}
      {checkoutResult && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 350, padding: "1rem" }}>
          <div className="card-clean" style={{ width: "100%", maxWidth: "480px", padding: "2rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", textAlign: "center" }}>
            
            {checkoutResult.success ? (
              <>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(13, 148, 136, 0.1)", color: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <IconShieldCheck size={36} />
                </div>
                
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  Pedido Confirmado con Exito
                </h3>
                
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  {checkoutResult.isRealDb 
                    ? "Transaccion registrada en la base de datos real." 
                    : "Transaccion guardada localmente de manera exitosa."}
                </p>
                
                <div style={{ background: "var(--bg-tertiary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Monto Total:</span>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>${checkoutResult.total?.toFixed(2)} USD</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Cobro Adelantado ({checkoutResult.depositPercent}%):</span>
                    <span style={{ fontWeight: 700, color: "var(--accent-teal)" }}>${checkoutResult.paidAmount?.toFixed(2)} USD</span>
                  </div>
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    Facturacion generada automaticamente. Transaccion protegida de acuerdo a normativas de seguridad de datos.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  ✕
                </div>
                
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  Error al Procesar Pedido
                </h3>
                
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  {checkoutResult.errorMsg}
                </p>
              </>
            )}
            
            <button onClick={() => setCheckoutResult(null)} className="btn btn-primary" style={{ width: "100%", padding: "0.8rem" }}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
