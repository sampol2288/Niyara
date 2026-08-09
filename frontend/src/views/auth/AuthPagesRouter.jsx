import React, { useState } from "react";
import { SignInPage } from "./SignInPage";
import { SignUpPage } from "./SignUpPage";
import { ResetPasswordPage } from "./ResetPasswordPage";
import { OtpVerificationPage } from "./OtpVerificationPage";
import { GetUserPage } from "./GetUserPage";
import { UpdateUserPage } from "./UpdateUserPage";
import { GenerateOtpPage } from "./GenerateOtpPage";
import { SendMailPage } from "./SendMailPage";
import {
  LogIn, UserPlus, KeyRound, ShieldCheck,
  User, UserCog, Zap, Send, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { id: "signin",            label: "Sign In",           icon: LogIn,       group: "Auth" },
  { id: "signup",            label: "Sign Up",           icon: UserPlus,    group: "Auth" },
  { id: "reset-password",    label: "Reset Password",    icon: KeyRound,    group: "Auth" },
  { id: "otp-verification",  label: "OTP Verification",  icon: ShieldCheck, group: "Auth" },
  { id: "get-user",          label: "Get User",          icon: User,        group: "Admin" },
  { id: "update-user",       label: "Update User",       icon: UserCog,     group: "Admin" },
  { id: "generate-otp",      label: "Generate OTP",      icon: Zap,         group: "Admin" },
  { id: "send-mail",         label: "Send Mail",         icon: Send,        group: "Admin" },
];

const PAGES = {
  "signin":           SignInPage,
  "signup":           SignUpPage,
  "reset-password":   ResetPasswordPage,
  "otp-verification": OtpVerificationPage,
  "get-user":         GetUserPage,
  "update-user":      UpdateUserPage,
  "generate-otp":     GenerateOtpPage,
  "send-mail":        SendMailPage,
};

export const AuthPagesRouter = () => {
  const [activePage, setActivePage] = useState("signin");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const ActiveComponent = PAGES[activePage] || SignInPage;
  const groups = [...new Set(NAV_ITEMS.map(n => n.group))];

  return (
    <div className="auth-router-layout animate-fade-in">
      {/* Sidebar */}
      <aside className={`auth-router-sidebar ${sidebarOpen ? "auth-sidebar-open" : "auth-sidebar-closed"}`}>
        {/* Brand */}
        <div className="auth-sidebar-brand">
          <span className="auth-sidebar-logo">NIYARA</span>
          <button
            className="auth-sidebar-toggle"
            onClick={() => setSidebarOpen(p => !p)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronRight size={16} style={{ transform: sidebarOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
          </button>
        </div>

        {/* Nav Groups */}
        {groups.map(group => (
          <div key={group} className="auth-sidebar-group">
            {sidebarOpen && (
              <p className="auth-sidebar-group-label">{group.toUpperCase()}</p>
            )}
            {NAV_ITEMS.filter(n => n.group === group).map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`auth-sidebar-item ${isActive ? "auth-sidebar-item-active" : ""}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon size={17} className="auth-sidebar-item-icon" />
                  {sidebarOpen && <span className="auth-sidebar-item-label">{item.label}</span>}
                  {sidebarOpen && isActive && (
                    <span className="auth-sidebar-active-dot" />
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Footer */}
        {sidebarOpen && (
          <div className="auth-sidebar-footer">
            <p>Auth Portal</p>
            <p>NIYARA v1.0</p>
          </div>
        )}
      </aside>

      {/* Content Area */}
      <main className="auth-router-content">
        {/* Breadcrumb */}
        <div className="auth-router-breadcrumb">
          <span>Auth Pages</span>
          <ChevronRight size={13} />
          <span className="auth-breadcrumb-active">
            {NAV_ITEMS.find(n => n.id === activePage)?.label || activePage}
          </span>
        </div>

        <ActiveComponent onNavigate={setActivePage} />
      </main>
    </div>
  );
};
