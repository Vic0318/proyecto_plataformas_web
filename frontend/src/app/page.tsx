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
import styles from "./page.module.css";

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

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("isben_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Token ${token}`;
    return headers;
  };

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

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("isben_token");
      if (!token) return;
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
        const created: Product = { ...newProd, id: `prod-${Date.now()}` };
        setProducts((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error("Error al crear producto en backend:", err);
      const created: Product = { ...newProd, id: `prod-${Date.now()}` };
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
        body: JSON.stringify({ cart, clientName: username }),
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
        setCheckoutResult({ success: true, isRealDb: true, total: cartTotal, paidAmount, depositPercent });
      } else {
        setCheckoutResult({ success: false, errorMsg: "Ocurrio un error al procesar el pedido en el servidor." });
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
      setCheckoutResult({ success: true, isRealDb: false, total: cartTotal, paidAmount, depositPercent });
    }
    
    setCart({});
    setIsCartOpen(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {viewState === "landing" ? (
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

          <main className={`container ${styles.mainContent}`}>
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

      {/* Auth Modal */}
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
        <div className={styles.cartOverlay}>
          <div className={`card-clean ${styles.cartDrawer}`}>
            <div>
              <div className={styles.cartHeader}>
                <h3 className={styles.cartTitle}>
                  <IconShoppingCart size={20} /> Tu Pedido Mayorista
                </h3>
                <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}>✕</button>
              </div>

              {cartCount === 0 ? (
                <div className={styles.cartEmpty}>
                  <div className={styles.cartEmptyIcon}><IconPackage size={42} /></div>
                  <p>Tu carrito está vacío.</p>
                </div>
              ) : (
                <div className={styles.cartItems}>
                  {Object.entries(cart).map(([pId, qty]) => {
                    const p = products.find((prod) => prod.id === pId);
                    if (!p) return null;
                    return (
                      <div key={pId} className={styles.cartItem}>
                        <div>
                          <div className={styles.cartItemName}>{p.name}</div>
                          <div className={styles.cartItemQty}>{qty} x ${p.pricePerUnit.toFixed(2)} USD</div>
                        </div>
                        <div className={styles.cartItemTotal}>
                          ${(p.pricePerUnit * qty).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cartCount > 0 && (
              <div className={styles.cartFooter}>
                {!isMinOrderReached ? (
                  <div className={styles.cartMinAlert}>
                    Faltan ${(minOrder - cartTotal).toFixed(2)} USD para el mínimo (${minOrder} USD).
                  </div>
                ) : (
                  <>
                    <div className={styles.depositSection}>
                      <label className={styles.depositLabel}>
                        <IconShieldCheck size={16} /> Depósito Adelantado (PCI-DSS)
                      </label>
                      <div className={styles.depositBtns}>
                        <button
                          onClick={() => setDepositPercent(50)}
                          className={depositPercent === 50 ? styles.depositBtnActive : styles.depositBtn}
                        >
                          50% (${(cartTotal * 0.5).toFixed(2)})
                        </button>
                        <button
                          onClick={() => setDepositPercent(100)}
                          className={depositPercent === 100 ? styles.depositBtnActive : styles.depositBtn}
                        >
                          100% (${cartTotal.toFixed(2)})
                        </button>
                      </div>
                    </div>

                    <div className={styles.cartTotalRow}>
                      <span>Total Pedido:</span>
                      <span className={styles.cartTotalAmt}>${cartTotal.toFixed(2)} USD</span>
                    </div>

                    <button
                      onClick={handleCompletePayment}
                      className={`btn btn-primary ${styles.fullWidthBtn}`}
                      style={{ gap: "8px" }}
                    >
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
        <div className={styles.settingsOverlay}>
          <div className={`card-clean ${styles.settingsModal}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Configuracion de Usuario</h3>
              <button onClick={() => setIsSettingsOpen(false)} className={styles.closeBtn}>✕</button>
            </div>
            
            <div className={styles.settingsFields}>
              <div>
                <label className={styles.fieldLabel}>Idioma de la Interfaz</label>
                <select className={styles.fieldSelect}>
                  <option>Espanol (America Latina)</option>
                  <option>English (US)</option>
                </select>
              </div>
              <div>
                <label className={styles.fieldLabel}>Moneda de Transaccion</label>
                <select className={styles.fieldSelect}>
                  <option>USD - Dolares Americanos</option>
                  <option>EUR - Euros</option>
                </select>
              </div>
              <div>
                <label className={styles.fieldLabel}>Notificaciones del Sistema</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked className={styles.checkboxInput} />
                    Alertas de stock bajo de productos
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked className={styles.checkboxInput} />
                    Confirmaciones de entrega de pedidos
                  </label>
                </div>
              </div>
            </div>

            <button onClick={() => setIsSettingsOpen(false)} className={`btn btn-primary ${styles.fullWidthBtn}`}>
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryOpen && (
        <div className={styles.historyOverlay}>
          <div className={`card-clean ${styles.historyModal}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Historial de Transacciones</h3>
              <button onClick={() => setIsHistoryOpen(false)} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.historyTableWrapper}>
              <table className={styles.historyTable}>
                <thead className={styles.historyThead}>
                  <tr>
                    <th>Pedido</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody className={styles.historyTbody}>
                  {historyOrders.map((o) => (
                    <tr key={o.id}>
                      <td className={styles.tdOrderId}>{o.id}</td>
                      <td>{o.date}</td>
                      <td>
                        <span className={styles.statusBadge}>{o.status}</span>
                      </td>
                      <td className={styles.tdTotal}>${o.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => setIsHistoryOpen(false)} className={`btn btn-primary ${styles.fullWidthBtn}`}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Checkout Success / Result Modal */}
      {checkoutResult && (
        <div className={styles.checkoutOverlay}>
          <div className={`card-clean ${styles.checkoutModal}`}>
            {checkoutResult.success ? (
              <>
                <div className={styles.successIconBadge}>
                  <IconShieldCheck size={36} />
                </div>
                <h3 className={styles.checkoutTitle}>Pedido Confirmado con Exito</h3>
                <p className={styles.checkoutSubtitle}>
                  {checkoutResult.isRealDb
                    ? "Transaccion registrada en la base de datos real."
                    : "Transaccion guardada localmente de manera exitosa."}
                </p>
                <div className={styles.receiptBox}>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptRowLabel}>Monto Total:</span>
                    <span className={styles.receiptRowValue}>${checkoutResult.total?.toFixed(2)} USD</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptRowLabel}>Cobro Adelantado ({checkoutResult.depositPercent}%):</span>
                    <span className={styles.receiptRowValueTeal}>${checkoutResult.paidAmount?.toFixed(2)} USD</span>
                  </div>
                  <div className={styles.receiptNote}>
                    Facturacion generada automaticamente. Transaccion protegida de acuerdo a normativas de seguridad de datos.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.errorIconBadge}>✕</div>
                <h3 className={styles.checkoutTitle}>Error al Procesar Pedido</h3>
                <p className={styles.checkoutErrorMsg}>{checkoutResult.errorMsg}</p>
              </>
            )}

            <button onClick={() => setCheckoutResult(null)} className={`btn btn-primary ${styles.fullWidthBtn}`}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
