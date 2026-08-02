import React from "react";
import { useApp } from "../context/AppContext";
import { ArrowRight } from "lucide-react";

export const JournalView = () => {
  const { setView } = useApp();

  const articles = [
    {
      id: 1,
      tag: "ARCHITECTURAL INSPIRATION",
      date: "OCTOBER 2024",
      title: "Monolithic Geometry: The Roots of Scandi-Minimalism",
      excerpt: "Exploring how brutalist architecture and clean Nordic lines shape our latest outerwear collection.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      tag: "MATERIALS & PROVENANCE",
      date: "SEPTEMBER 2024",
      title: "Inside the Biella Wool Mills of Northern Italy",
      excerpt: "A journey through the historic alpine mills producing our 100% extra-fine Merino wool wrap coats.",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 3,
      tag: "SUSTAINABILITY MANIFESTO",
      date: "AUGUST 2024",
      title: "Designing for Permanence: Why We Make 0% Disposable Garments",
      excerpt: "Our commitment to carbon-neutral dispatches, circular fiber sourcing, and lifetime durability guarantees.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1440px", margin: "0 auto", padding: "4rem 2rem 6rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>THE JOURNAL</span>
        <h1 style={{ fontSize: "3.5rem", color: "var(--text-primary)", margin: "0.5rem 0 1rem" }}>
          Archival Perspectives
        </h1>
        <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
          Essays on architectural form, textile engineering, and the philosophy of essentialism.
        </p>
      </div>

      {/* Featured Main Article */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem", marginBottom: "6rem", background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
        <div className="image-zoom-container" style={{ aspectRatio: "16/10" }}>
          <img src={articles[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "3rem 2.5rem 3rem 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", marginBottom: "0.5rem" }}>
            {articles[0].tag} • {articles[0].date}
          </span>
          <h2 style={{ fontSize: "2.25rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
            {articles[0].title}
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
            {articles[0].excerpt}
          </p>
          <button className="btn-secondary" style={{ width: "fit-content" }}>
            READ ESSAY <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid of Articles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "3rem" }}>
        {articles.slice(1).map((art) => (
          <div key={art.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
            <div className="image-zoom-container" style={{ aspectRatio: "4/3" }}>
              <img src={art.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--accent-camel)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                {art.tag}
              </span>
              <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>{art.title}</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>{art.excerpt}</p>
              <button className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.7rem" }}>READ ESSAY</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
