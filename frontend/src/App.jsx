import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomeView } from "./views/HomeView";
import { ShopView } from "./views/ShopView";
import { PDPView } from "./views/PDPView";
import { AccountView } from "./views/AccountView";
import { CheckoutView } from "./views/CheckoutView";
import { ContactView } from "./views/ContactView";
import { JournalView } from "./views/JournalView";
import { AdminView } from "./views/AdminView";
import { CartDrawer } from "./components/CartDrawer";
import { SearchOverlay } from "./components/SearchOverlay";
import { AuthModal } from "./components/AuthModal";
import { NotificationToast } from "./components/NotificationToast";

const AppContent = () => {
  const { view, selectedProduct } = useApp();

  const renderView = () => {
    if (selectedProduct) {
      return <PDPView />;
    }

    switch (view) {
      case "shop":
        return <ShopView />;
      case "account":
        return <AccountView />;
      case "checkout":
        return <CheckoutView />;
      case "contact":
        return <ContactView />;
      case "journal":
        return <JournalView />;
      case "admin":
        return <AdminView />;
      case "home":
      default:
        return <HomeView />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      <Header />
      <main style={{ flex: 1 }}>{renderView()}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <AuthModal />
      <NotificationToast />
    </div>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder-client-id";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}
