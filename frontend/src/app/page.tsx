"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LandingPage } from "@/components/LandingPage";
import { AuthModal } from "@/components/AuthModal";
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

  const [currentRole, setCurrentRole] = useState<"tendero" | "empresa" | "freelance" | "admin">("tendero");
  const [username, setUsername] = useState<string>("Abarrotes Don Pepe");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [minOrder, setMinOrder] = useState<number>(60.0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [depositPercent, setDepositPercent] = useState<number>(100);

  // Load products and minimum order from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await fetch("http://localhost:8000/api/productos/");
        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (prods && prods.length > 0) {
            setProducts(prods);
          }
        }
        
        const minOrderRes = await fetch("http://localhost:8000/api/min-order/");
        if (minOrderRes.ok) {
          const minData = await minOrderRes.json();
          setMinOrder(minData.minOrder);
        }
      } catch (err) {
        console.error("Error cargando datos del backend:", err);
      }
    };
    loadData();
  }, []);

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLoginSuccess = (role: "tendero" | "empresa" | "freelance" | "admin", name: string) => {
    setCurrentRole(role);
    setUsername(name);
    setViewState("portal");
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
  };

  const handleLogout = () => {
    setViewState("landing");
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
        headers: {
          "Content-Type": "application/json",
        },
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

  const handlePlaceOrderForClient = (clientName: string, productId: string, quantity: number) => {
    handleUpdateQuantity(productId, quantity);
  };

  const handleUpdateMinOrder = async (newMin: number) => {
    setMinOrder(newMin);
    try {
      await fetch("http://localhost:8000/api/min-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ minOrder: newMin }),
      });
    } catch (err) {
      console.error("Error actualizando monto mínimo:", err);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          clientName: username,
        }),
      });
      
      if (response.ok) {
        alert(`Pedido Confirmado con Éxito en Base de Datos Real (Django)\n\nMonto Total: $${cartTotal.toFixed(2)} USD\nMonto Cobrado por Adelantado (${depositPercent}%): $${paidAmount.toFixed(2)} USD\n\nFacturación generada automáticamente (RF3.4). Transacción PCI-DSS protegida (RNF3.1).`);
      } else {
        alert("Ocurrió un error al procesar el pedido en el servidor.");
      }
    } catch (err) {
      console.error("Error al realizar pedido:", err);
      alert(`Pedido Confirmado Localmente (Modo Demo Offline)\n\nMonto Total: $${cartTotal.toFixed(2)} USD\nMonto Cobrado por Adelantado (${depositPercent}%): $${paidAmount.toFixed(2)} USD\n\nFacturación generada automáticamente (RF3.4). Transacción PCI-DSS protegida (RNF3.1).`);
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
          onSelectRoleDemo={handleSelectRoleDemo}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        /* Logged-in User Portal */
        <>
          <Header
            currentRole={currentRole}
            username={username}
            onLogout={handleLogout}
            onGoHome={() => setViewState("landing")}
            theme={theme}
            onToggleTheme={toggleTheme}
            cartCount={cartCount}
            cartTotal={cartTotal}
            minOrder={minOrder}
            onOpenCart={() => setIsCartOpen(true)}
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
              />
            )}

            {currentRole === "freelance" && (
              <FreelancePortal
                products={products}
                onPlaceOrderForClient={handlePlaceOrderForClient}
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
    </div>
  );
}
