/**
 * Utility functions for client-side JWT handling and decoding.
 */

// Helper to base64url decode strings
const base64UrlDecode = (str) => {
  try {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    return null;
  }
};

// Decode complete JWT (Header, Payload, Signature)
export const decodeJWT = (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const headerStr = base64UrlDecode(parts[0]);
    const payloadStr = base64UrlDecode(parts[1]);

    const header = headerStr ? JSON.parse(headerStr) : null;
    const payload = payloadStr ? JSON.parse(payloadStr) : null;

    return {
      header,
      payload,
      signature: parts[2]
    };
  } catch (e) {
    return null;
  }
};

// Check if JWT is expired
export const isJWTExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.payload.exp < currentTime;
};

// Calculate time remaining before JWT expires (formatted as mm:ss)
export const getJWTTimeRemaining = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) return "N/A";

  const diffSec = decoded.payload.exp - Math.floor(Date.now() / 1000);
  if (diffSec <= 0) return "EXPIRED";

  const days = Math.floor(diffSec / (3600 * 24));
  const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

// Get Bearer Auth Header Object
export const getJWTBearerHeader = (token) => {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

// Client-side Fallback Token Generator (Base64Url HMAC structure)
export const createMockJWTToken = (userPayload, expiresInMinutes = 60 * 24 * 7) => {
  const header = { alg: "HS256", typ: "JWT" };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInMinutes * 60;

  const payload = {
    sub: userPayload.email || "user_id",
    name: userPayload.name || "Member User",
    email: userPayload.email,
    role: userPayload.role || "member",
    iat,
    exp,
    jti: `jwt_${Math.random().toString(36).substring(2, 11)}`,
    iss: "niyara-auth-service"
  };

  const encode = (obj) => {
    const jsonStr = JSON.stringify(obj);
    const base64 = btoa(jsonStr);
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };

  const encodedHeader = encode(header);
  const encodedPayload = encode(payload);
  const mockSig = btoa(`sig_${payload.jti}`).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${mockSig}`;
};
