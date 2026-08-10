# NIYARA — Production Readiness Task List

## Security Hardening
- [x] Remove hardcoded PIN bypass (`"8890" || "admin123"`) from AdminContext.jsx
- [x] Remove plaintext admin passwords from AppContext.jsx (frontend)
- [x] Remove `pin === "admin123"` bypass from authenticateAdmin in AppContext.jsx
- [x] Add production password warning to ensureDefaultAdminAccount in auth.js

## Environment Configuration
- [x] Create backend/.env.example
- [x] Create frontend/.env.example
- [x] Create admin/.env.example
- [x] Add `engines` field to backend/package.json
- [x] Add production start script to backend/package.json

## Build Optimization
- [x] Optimize frontend/vite.config.js (chunk splitting, no sourcemaps in prod)
- [x] Optimize admin/vite.config.js (chunk splitting, no sourcemaps in prod)

## SEO & HTML Meta
- [x] Update frontend/index.html (meta description, OG tags, theme-color, canonical favicon)
- [x] Update admin/index.html (meta noindex, description, theme-color)
- [x] Create frontend/public/robots.txt

## Docs & Git
- [x] Update README.md (correct GitHub URL, production checklist, security notes)
- [x] Update .gitignore completeness (all .env variants, keep .env.example)

## Verification
- [x] All files verified as correctly modified
- [x] Backend API confirmed live at niyara.onrender.com
- [x] MongoDB disconnection identified as Render env var issue (user action required)
- [ ] Build test pending (shell NUL access issue prevents running npm in this environment)
- [ ] Git push pending (user must run: git add -A && git commit -m "feat: production readiness" && git push)
