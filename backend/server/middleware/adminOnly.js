/**
 * Middleware: Restrict access to admin-role users only.
 * Must be used AFTER protectJWT middleware.
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Authentication required." });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Administrator privileges are required."
    });
  }
  next();
};
