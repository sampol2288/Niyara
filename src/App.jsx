import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { AuthModal } from "./components/AuthModal";
import { SearchOverlay } from "./components/SearchOverlay";
import { NotificationToast } from "./components/NotificationToast";

import { HomeView } from "./views/HomeView";
import { ShopView } from "./views/ShopView";
import { PDPView } from "./views/PDPView";
import { CheckoutView } from "./views/CheckoutView";
import { AccountView } from "./views/AccountView";
import { ContactView } from "./views/ContactView";
import { JournalView } from "./views/JournalView";
import { AdminView } from "./views/AdminView";
import { AuthView } from "./views/AuthView";

const MainLayout = () => {
  const { view, setView, isAdminAuthenticated } = useApp();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setView((prev) => (prev === "admin" ? "home" : "admin"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setView]);

  // Full standalone operational terminal when unlocked
  if (view === "admin" && isAdminAuthenticated) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <AdminView />
        <NotificationToast />
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case "home":
        return <HomeView />;
      case "shop":
        return <ShopView />;
      case "pdp":
        return <PDPView />;
      case "checkout":
        return <CheckoutView />;
      case "account":
        return <AccountView defaultTab="orders" />;
      case "wishlist":
        return <AccountView defaultTab="wishlist" />;
      case "contact":
        return <ContactView />;
      case "journal":
        return <JournalView />;
      case "auth":
      case "login":
        return <AuthView initialTab="login" />;
      case "signup":
        return <AuthView initialTab="signup" />;
      case "admin":
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>{renderView()}</main>
      <Footer />
      <CartDrawer />
      <AuthModal />
      <SearchOverlay />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
