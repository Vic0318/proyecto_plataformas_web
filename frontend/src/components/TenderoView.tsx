"use client";

import React, { useState } from "react";
import {
  IconShoppingCart,
  IconSearch,
  IconPlus,
  IconMinus,
  IconPackage,
  IconArrowRight
} from "@/components/Icons";

export interface Product {
  id: string;
  name: string;
  category: string;
  pricePerUnit: number;
  unitPackName: string;
  stock: number;
  image: string;
  companyName: string;
  isLowStock?: boolean;
}

interface TenderoViewProps {
  products: Product[];
  cart: { [productId: string]: number };
  onUpdateQuantity: (productId: string, delta: number) => void;
  cartTotal: number;
  minOrder: number;
  onCheckout: () => void;
}

export const TenderoView: React.FC<TenderoViewProps> = ({
  products,
  cart,
  onUpdateQuantity,
  cartTotal,
  minOrder,
  onCheckout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = ["Todos", "Abarrotes", "Bebidas", "Limpieza", "Cuidado Personal"];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const isMinOrderReached = cartTotal >= minOrder;

  return (
    <div style={{ padding: "2rem 0 4rem" }}>
      {/* Clean Catalog Header & Cart Summary Bar */}
      <div
        className="card-clean"
        style={{
          padding: "1.5rem 2rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <span className="badge-clean badge-clean-primary" style={{ marginBottom: "0.5rem", gap: "6px" }}>
            <IconShoppingCart size={14} /> Catálogo Mayorista Directo
          </span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Pacas y Cajas con Precio de Fábrica</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Monto mínimo de compra configurado por las empresas: <strong>${minOrder} USD</strong>.
          </p>
        </div>

        {/* Minimalist Cart Status Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Total de tu Pedido</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: isMinOrderReached ? "var(--accent-teal)" : "var(--primary)" }}>
              ${cartTotal.toFixed(2)} USD
            </div>
          </div>
          <button
            onClick={onCheckout}
            disabled={!isMinOrderReached || cartTotal === 0}
            className="btn btn-primary"
            style={{
              padding: "0.75rem 1.5rem",
              opacity: isMinOrderReached ? 1 : 0.5,
              cursor: isMinOrderReached ? "pointer" : "not-allowed"
            }}
          >
            {isMinOrderReached ? (
              <>
                Confirmar Pedido <IconArrowRight size={16} />
              </>
            ) : (
              `Faltan $${(minOrder - cartTotal).toFixed(2)}`
            )}
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-color)",
                fontWeight: selectedCategory === cat ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                backgroundColor: selectedCategory === cat ? "var(--secondary)" : "var(--bg-secondary)",
                color: selectedCategory === cat ? "#ffffff" : "var(--text-primary)",
                transition: "all 0.15s"
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
            placeholder="Buscar producto o marca..."
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

      {/* Grid of Clean Product Cards */}
      <div className="grid-cards">
        {filteredProducts.map((product) => {
          const qty = cart[product.id] || 0;
          return (
            <div key={product.id} className="card-clean" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>{product.companyName}</span>
                  {product.stock < 15 && (
                    <span className="badge-clean badge-clean-primary" style={{ padding: "2px 8px", fontSize: "0.7rem", fontWeight: 800 }}>
                      Stock Bajo
                    </span>
                  )}
                </div>

                <div style={{ width: "100%", height: "160px", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-tertiary)", marginBottom: "1rem" }}>
                  <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.2rem" }}>{product.name}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <IconPackage size={14} /> {product.unitPackName}
                </p>

                {/* Expanded Stock Level Block */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", marginBottom: "1.25rem", padding: "0.5rem 0.75rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700 }}>
                    <span style={{ color: product.stock < 15 ? "var(--primary)" : "var(--accent-teal)" }}>
                      {product.stock < 15 ? `Stock bajo: ${product.stock} pacas` : `Stock disponible: ${product.stock} pacas`}
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>{product.stock} disp.</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "3px", overflow: "hidden", marginTop: "2px" }}>
                    <div 
                      style={{ 
                        width: `${Math.min(100, (product.stock / 100) * 100)}%`, 
                        height: "100%", 
                        background: product.stock < 15 ? "linear-gradient(90deg, var(--primary) 0%, #ff7849 100%)" : "linear-gradient(90deg, var(--accent-teal) 0%, #2dd4bf 100%)",
                        transition: "width 0.4s ease" 
                      }} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1rem" }}>
                  ${product.pricePerUnit.toFixed(2)} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>/ paca</span>
                </div>

                {/* Elegant Quantity Selector */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", padding: "4px" }}>
                  <button
                    onClick={() => onUpdateQuantity(product.id, -1)}
                    disabled={qty === 0}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: qty === 0 ? "transparent" : "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      cursor: qty === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <IconMinus size={16} />
                  </button>

                  <span style={{ fontSize: "1rem", fontWeight: 800, color: qty > 0 ? "var(--primary)" : "var(--text-muted)" }}>
                    {qty}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: "var(--primary)",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <IconPlus size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
