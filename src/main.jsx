import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Box,
  Gamepad2,
  Instagram,
  PackageOpen,
  Plug,
  Search,
  Sparkles,
  Star,
  XCircle,
} from "lucide-react";
import "./styles.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzjqsBZbRejF0zZ9CIRnFD1pf_sng0SIsUwb0YkoasAcQC6-rGIPQlZbH8QDS9NqhHW/exec";

const mockProducts = [
  {
    No_Link: "01",
    Kategori: "Gadget & Setup",
    Nama_Produk: "Lampu Meja LED Monitor (Screenbar)",
    Deskripsi: "Biar mata ga cepat lelah dan pusing pas kerja malam di depan monitor.",
    Link_Affiliate: "https://s.id/LampuMonitorTGSH",
    Harga: "Rp 150.000",
    Status: "Tersedia",
  },
  {
    No_Link: "02",
    Kategori: "Kebutuhan Harian",
    Nama_Produk: "Sprei Kasur Anti-Geser Premium",
    Deskripsi: "Biar ga capek tiap bangun tidur harus ngerapihin ujung kasur terus.",
    Link_Affiliate: "https://s.id/SpreiAntiGeser",
    Harga: "Rp 75.000",
    Status: "Menipis",
  },
  {
    No_Link: "03",
    Kategori: "Hobi & Koleksi",
    Nama_Produk: "Mini Retro Game Console Handheld",
    Deskripsi: "Bisa main ribuan game jadul pas weekend buat healing.",
    Link_Affiliate: "https://s.id/RetroConsoleTGSH",
    Harga: "Rp 250.000",
    Status: "Habis",
  },
  {
    No_Link: "04",
    Kategori: "Gadget & Setup",
    Nama_Produk: "Phone Stand Lipat Aluminium",
    Deskripsi: "Biar streaming, nonton film, atau zoom meeting ga pegel megangin HP.",
    Link_Affiliate: "https://s.id/PhoneStandTGSH",
    Harga: "Rp 20.000",
    Status: "Tersedia",
  },
  {
    No_Link: "05",
    Kategori: "Kebutuhan Harian",
    Nama_Produk: "Organizer Laci Meja Akrilik",
    Deskripsi: "Meja berantakan bikin stress? Rapihin pake rak estetik transparan ini.",
    Link_Affiliate: "https://s.id/OrganizerMejaTGSH",
    Harga: "Rp 25.000",
    Status: "Proses",
  },
];

const defaultCategories = ["Gadget & Setup", "Kebutuhan Harian", "Hobi & Koleksi"];

function getStatus(statusText = "Tersedia") {
  const lower = statusText.toLowerCase();

  if (lower.includes("menipis") || lower.includes("low") || lower.includes("limit")) {
    return { className: "low", text: statusText.toUpperCase() };
  }
  if (lower.includes("habis") || lower.includes("empty") || lower.includes("sold")) {
    return { className: "empty", text: statusText.toUpperCase() };
  }
  if (lower.includes("proses") || lower.includes("pending") || lower.includes("po")) {
    return { className: "pending", text: statusText.toUpperCase() };
  }

  return { className: "ready", text: statusText.toUpperCase() };
}

function getCategoryIcon(category = "") {
  if (category.includes("Gadget")) return <Plug size={12} />;
  if (category.includes("Hobi")) return <Gamepad2 size={12} />;
  return <Box size={12} />;
}

function App() {
  const tabListRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [sourceMessage, setSourceMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const rows = Array.isArray(data) ? data : data?.products || data?.data;
        if (!Array.isArray(rows)) throw new Error("Format response tidak dikenali");
        setProducts(rows);
        setSourceMessage("Data live dari Google Sheet.");
      } catch (error) {
        setProducts(mockProducts);
        setSourceMessage(
          "Mode preview: memakai data contoh. Untuk data live, deploy Apps Script sebagai Web App dan gunakan URL /exec."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return products.filter((product) => {
      const status = String(product.Status || "").toLowerCase();
      const category = String(product.Kategori || "");
      const matchesCategory =
        activeCategory === "Semua" ||
        (activeCategory === "Hot"
          ? status.includes("hot")
          : category.toLowerCase() === activeCategory.toLowerCase());

      const searchable = [
        product.No_Link,
        product.Nama_Produk,
        product.Deskripsi,
        product.Kategori,
        product.Harga,
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, products, query]);

  const categoryTabs = useMemo(() => {
    const categoryNames = new Set(defaultCategories);
    products.forEach((product) => {
      const category = String(product.Kategori || "").trim();
      if (category) categoryNames.add(category);
    });

    return [
      { key: "Semua", label: "Semua", icon: Sparkles },
      { key: "Hot", label: "Hot Items", icon: Star },
      ...Array.from(categoryNames).map((category) => ({
        key: category,
        label: category,
        icon: category.includes("Gadget")
          ? Plug
          : category.includes("Hobi")
            ? Gamepad2
            : Box,
      })),
    ];
  }, [products]);

  function scrollTabs(direction) {
    tabListRef.current?.scrollBy({
      left: direction * 180,
      behavior: "smooth",
    });
  }

  return (
    <div className="app-shell">
      <main className="page">
        <header className="profile">
          <div className="logo" aria-label="TGSH.ID">
            <span>TGSH.ID</span>
          </div>
          <div className="profile-title">
            <h1>@tgsh.id</h1>
            <BadgeCheck size={18} className="verified" />
          </div>
          <p>
            Rekomendasi barang unik, solutif, dan estetik untuk setup kerja, hobi,
            dan kebutuhan harianmu.
          </p>
          <a
            className="social-link"
            href="https://www.instagram.com/tgsh.id/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram TGSH.ID"
          >
            <Instagram size={20} />
          </a>
        </header>

        <section className="filters" aria-label="Cari dan filter produk">
          <div className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nomor link atau barang..."
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Bersihkan pencarian">
                <XCircle size={18} />
              </button>
            )}
          </div>

          <div className="category-control">
            <button
              type="button"
              className="tab-arrow"
              onClick={() => scrollTabs(-1)}
              aria-label="Geser filter ke kiri"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="category-tabs" ref={tabListRef}>
              {categoryTabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={activeCategory === key ? "active" : ""}
                  onClick={() => setActiveCategory(key)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="tab-arrow"
              onClick={() => scrollTabs(1)}
              aria-label="Geser filter ke kanan"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {sourceMessage && <p className="source-message">{sourceMessage}</p>}
        </section>

        {isLoading ? (
          <section className="loading">
            <div />
            <p>Memuat katalog TGSH.ID...</p>
          </section>
        ) : filteredProducts.length > 0 ? (
          <section className="product-list" aria-label="Daftar produk">
            {filteredProducts.map((product) => (
              <ProductCard key={`${product.No_Link}-${product.Nama_Produk}`} product={product} />
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <PackageOpen size={56} />
            <h2>Barang tidak ditemukan</h2>
            <p>Coba cari dengan nomor link lain atau kata kunci yang berbeda.</p>
          </section>
        )}
      </main>

      <footer>
        <p>© 2026 TGSH.ID. All Rights Reserved.</p>
        <p>Powered by Google Sheets</p>
      </footer>
    </div>
  );
}

function ProductCard({ product }) {
  const status = getStatus(product.Status);
  const number = String(product.No_Link || "").padStart(2, "0");

  return (
    <article className="product-card">
      <div className="product-main">
        <div className="link-number">
          <span>LINK</span>
          <strong>{number}</strong>
        </div>
        <div className="product-copy">
          <span className="category-badge">
            {getCategoryIcon(product.Kategori)}
            {product.Kategori || "Lainnya"}
          </span>
          <h2>{product.Nama_Produk || "Produk TGSH.ID"}</h2>
          <p>{product.Deskripsi || ""}</p>
        </div>
      </div>

      <div className="product-actions">
        <div>
          <span className={`status ${status.className}`}>{status.text}</span>
          <strong>{product.Harga || "Hubungi Admin"}</strong>
        </div>
        <a href={product.Link_Affiliate || "#"} target="_blank" rel="noreferrer">
          Check Barang
          <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
