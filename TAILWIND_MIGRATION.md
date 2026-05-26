# Tailwind CSS migration — complete

## Status

- **MUI + Emotion removed** from `package.json` and all source files.
- **UI kit:** `src/components/ui/tw/` (Modal, Button, Badge, PageShell, Drawer, Dropdown, Field, Spinner).
- **Dialogs:** Tailwind + `dialogLayout.jsx`; `AppDialog` wraps `tw/Modal`.
- **Tables:** `CommonTable` + `useAdminTableData` (no MUI Table).
- **Theme:** legacy `src/theme/theme.js` / `themeSx.js` deleted; tokens in `src/index.css` `@theme` and `src/theme/tokens.js`.

## Conventions

1. Use `className` + `cn()` from `src/lib/cn.js`.
2. Shared utilities: `page-gradient`, `glass-panel`, `btn-primary`, `btn-outline`, `input-field` in `index.css`.
3. Icons: `lucide-react` (not `@mui/icons-material`).

## Commands

```bash
cd my-grammy-frontend
npm run dev
npm run build
npm run analyze
```
