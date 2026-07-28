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
import styles from "./TenderoView.module.css";

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
    <div className={styles.wrapper}>
      {/* Clean Catalog Header & Cart Summary Bar */}
      <div className={`card-clean ${styles.catalogHeader}`}>
        <div>
          <span className={`badge-clean badge-clean-primary ${styles.catalogBadge}`}>
            <IconShoppingCart size={14} /> Catálogo Mayorista Directo
          </span>
          <h2 className={styles.catalogTitle}>Pacas y Cajas con Precio de Fábrica</h2>
          <p className={styles.catalogSubtitle}>
            Monto mínimo de compra configurado por las empresas: <strong>${minOrder} USD</strong>.
          </p>
        </div>

        {/* Minimalist Cart Status Pill */}
        <div className={styles.cartStatus}>
          <div className={styles.cartTotalArea}>
            <div className={styles.cartTotalLabel}>Total de tu Pedido</div>
            <div className={`${styles.cartTotalValue} ${isMinOrderReached ? styles.reached : styles.notReached}`}>
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
              <>Confirmar Pedido <IconArrowRight size={16} /></>
            ) : (
              `Faltan $${(minOrder - cartTotal).toFixed(2)}`
            )}
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
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
            placeholder="Buscar producto o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Grid of Clean Product Cards */}
      <div className="grid-cards">
        {filteredProducts.map((product) => {
          const qty = cart[product.id] || 0;
          return (
            <div key={product.id} className={`card-clean ${styles.productCard}`}>
              <div>
                <div className={styles.productTopRow}>
                  <span className={styles.productCompany}>{product.companyName}</span>
                  {product.stock < 15 && (
                    <span className="badge-clean badge-clean-primary" style={{ padding: "2px 8px", fontSize: "0.7rem", fontWeight: 800 }}>
                      Stock Bajo
                    </span>
                  )}
                </div>

                <div className={styles.productImageBox}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                </div>

                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPack}>
                  <IconPackage size={14} /> {product.unitPackName}
                </p>

                {/* Stock Level Block */}
                <div className={styles.stockBlock}>
                  <div className={styles.stockRow}>
                    <span className={product.stock < 15 ? styles.stockLabelLow : styles.stockLabelOk}>
                      {product.stock < 15 ? `Stock bajo: ${product.stock} pacas` : `Stock disponible: ${product.stock} pacas`}
                    </span>
                    <span className={styles.stockCount}>{product.stock} disp.</span>
                  </div>
                  <div className={styles.stockBarTrack}>
                    <div
                      style={{
                        width: `${Math.min(100, (product.stock / 100) * 100)}%`,
                        height: "100%",
                        background: product.stock < 15
                          ? "linear-gradient(90deg, var(--primary) 0%, #ff7849 100%)"
                          : "linear-gradient(90deg, var(--accent-teal) 0%, #2dd4bf 100%)",
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.priceRow}>
                  ${product.pricePerUnit.toFixed(2)} <span className={styles.priceUnit}>/ paca</span>
                </div>

                {/* Quantity Selector */}
                <div className={styles.qtySelector}>
                  <button
                    onClick={() => onUpdateQuantity(product.id, -1)}
                    disabled={qty === 0}
                    className={`${styles.qtyBtnBase} ${qty === 0 ? styles.qtyBtnMinusDisabled : styles.qtyBtnMinus}`}
                  >
                    <IconMinus size={16} />
                  </button>

                  <span className={`${styles.qtyValue} ${qty > 0 ? styles.qtyValueActive : styles.qtyValueZero}`}>
                    {qty}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    className={`${styles.qtyBtnBase} ${styles.qtyBtnPlus}`}
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
