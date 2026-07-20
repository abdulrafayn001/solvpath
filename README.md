# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Decision Log

### What I built
- Locked the project's Node version via `.nvmrc` (24.18.0), `package.json` `engines.node`, and `.npmrc` (`engine-strict=true`) — so every contributor and CI run resolves to the same Node runtime instead of whatever is installed globally. This avoids "works on my machine" bugs from Node version drift (e.g. differing built-in fetch/test-runner behavior, engine warnings, or native module ABI mismatches across major versions).
- Configured ESLint (flat config, TS + React Hooks + React Refresh rules) and Prettier (with `prettier-plugin-tailwindcss` for class sorting), and set up the `@/` path alias in both `tsconfig.json` and `vite.config.ts` so imports resolve as `@/features/...` instead of relative `../../../` chains.
- Mapped `brand-tokens.css` (navy/teal) onto shadcn's CSS variables in `src/index.css`; `--muted`/`--accent` collide in name but differ in meaning between the two files, so the shadcn slots got literal hex values hardcoded rather than chained via `var()`, leaving brand-tokens.css's own `--muted`/`--accent` untouched for direct consumers like `StatusBadge`.
- `src/api/order.types.ts` re-exports `mockApi.ts`'s types (`Order`, `OrderStatus`, `Page`, etc.) instead of redeclaring them
- Search (`SearchInput`) matches both order number and product name in one field, since `mockApi.ts`'s `listOrders` already filters on both — not a UI choice, just surfacing the fixed API contract.
- Added step-gating (`returnFlowGuard.ts`) that redirects to the earliest incomplete step, and an order-eligibility guard on `ReturnFlowPage` (extracted `isOrderReturnEligible`) that bounces non-delivered/ineligible orders back to the order detail page instead of into the return flow.

### What I deliberately skipped

- **Per-item mixed resolution.** One resolution applies to the whole return, not a different one per item (e.g. refund one item, exchange another), the mock API only accepts a single resolution per submission, so supporting this properly would mean splitting a return into multiple sub-requests with their own retry handling. Cut for time; a deliberate scope call, not an oversight.
