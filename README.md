# solvpath

An order-management dashboard with a multi-step returns flow, built as a frontend take-home against a fixed mock API contract.

- **Live demo**: https://solvpath.vercel.app/
- **Repo**: https://github.com/abdulrafayn001/solvpath

## Tech stack

- **React 19 + TypeScript**, built with **Vite**, routed with **react-router-dom v7**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, no `tailwind.config`) + **shadcn/ui** (`base-vega` style, `neutral` base color)
- **TanStack Query v5** for all server-state — fetching, mutations, and caching
- Node pinned to `24.18.0` via `.nvmrc`, enforced on install via `.npmrc`'s `engine-strict=true`

## Features

### Orders dashboard

- Responsive layout: a paginated table on desktop (`md:` breakpoint, 768px), an infinite-scrolling card list on mobile — same data source, two consumption patterns
- Search by order number or product name, status filtering, and pagination, all backed by the mock API's query params
- Expandable order rows/cards for a quick look at line items without leaving the dashboard
- Loading skeletons sized to match a real page of results, plus empty and error states

### Order detail

- Full order + line item view, with a return-eligibility check that gates access to the returns flow (only delivered, eligible orders can start a return)

### Returns flow

A 4-step wizard — **items → reason → resolution → review** — implemented as nested routes under `/orders/:orderId/return/*`:

1. **Items** — select which items (and quantities) to return
2. **Reason** — pick a return reason, with an optional comment
3. **Resolution** — choose refund, exchange, or store credit (store credit includes a +10% bonus)
4. **Review** — confirm the full return before submitting

Notes on behavior:

- **Step gating**: you can't skip ahead — visiting a step past the earliest incomplete one redirects you back
- **One resolution per return**: the mock API only accepts a single resolution per submission, so resolution is chosen for the whole return rather than per item (see [Decision Log](#decision-log))
- **Money math**: return values are computed in integer cents throughout (base value, +10% store-credit bonus with round-half-up) to avoid floating-point drift on repeating-decimal prices like `$19.99 x 3`
- Submission is guarded against double-clicks, since the mock API's `submitReturn` doesn't support request cancellation

## Getting started

```bash
git clone https://github.com/abdulrafayn001/solvpath.git
cd solvpath
nvm use        # or install Node 24.18.0 manually
npm install
npm run dev
```

The app runs entirely against an in-memory mock API (`src/api/mockApi.ts`) — there's no backend to configure or environment variables to set.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run typecheck` | Type-check only, no emit |
| `npm run lint` | Lint with ESLint (flat config: TS + react-hooks + react-refresh) |
| `npm run format` | Format with Prettier |
| `npm run preview` | Preview the production build locally |

## Project structure

```
src/
  api/            mock backend contract + a thin normalized-error service layer over it
  hooks/          TanStack Query hooks and small utility hooks (one per file)
  features/
    orders/         dashboard components (table + card variants, filters, pagination)
    returns/        return-flow components, reducer, and money calculations
  pages/          route-level components, incl. pages/return/ (one per wizard step)
  routes/         Routes.tsx — the route table
  components/     shared/layout components + components/ui (shadcn primitives)
  lib/            format.ts, status.ts, constants.ts, utils.ts (cn helper)
  styles/         brand-tokens.css, layered into index.css's shadcn CSS variables
```

Every component's props type lives in a sibling `ComponentName.types.ts` file rather than being inlined or declared alongside the component — followed consistently across `src/features/**`.

### API layer (`src/api/`)

- `mockApi.ts` is a **fixed contract**: it simulates a real backend, including artificial latency and randomized failure rates on list/submit. It's read-only from the app's perspective — nothing here wraps or changes its behavior.
- `order.service.ts` wraps the raw mock functions (`listOrders`, `getOrder`, `submitReturn`) with `withNormalizedError` (`errors.ts`) so every caller gets a consistent `AppError` shape.
- `returnsService.ts` is a thin returns-domain re-export of `order.service`'s `submitReturn`.
- `order.types.ts` re-exports `mockApi.ts`'s types (`Order`, `OrderStatus`, `Page`, etc.) rather than redeclaring them.
- Everything is barreled through `src/api/index.ts` — feature code imports from `@/api`, never the individual files.

### Data fetching (`src/hooks/`)

- `useOrders` / `useOrder` / `useSubmitReturn` wrap TanStack Query around the service layer, with query keys, `keepPreviousData`, debounced search (`useDebouncedValue`, 300ms), and `AbortSignal` passthrough.
- `useInfiniteOrders` powers the mobile card list (infinite scroll via `useIntersectionObserver`) as a separate hook from the desktop paginated table, over the same underlying fetch.

### Styling

- `src/styles/brand-tokens.css` (navy/teal) is layered onto shadcn's CSS variables in `src/index.css`. `--muted`/`--accent` collide in name but differ in meaning between the two files, so those specific shadcn slots use hardcoded hex values instead of `var()`-chaining.
- shadcn primitives live in `src/components/ui/` — add more via `npx shadcn@latest add <component>`, not by hand-rolling equivalents.

## Decision Log

### What I built

- Added `CLAUDE.md` documenting the codebase for LLM coding tools (Claude Code and similar), kept in sync as the project evolves, since it's now the primary onboarding doc for both AI assistants and future devs working alongside them.
- Locked the project's Node version via `.nvmrc` (24.18.0), `package.json`'s `engines.node`, and `.npmrc` (`engine-strict=true`) — so every contributor and CI run resolves to the same Node runtime instead of whatever is installed globally. This avoids "works on my machine" bugs from Node version drift (e.g. differing built-in fetch/test-runner behavior, engine warnings, or native module ABI mismatches across major versions).
- Configured ESLint (flat config, TS + React Hooks + React Refresh rules) and Prettier (with `prettier-plugin-tailwindcss` for class sorting), and set up the `@/` path alias in both `tsconfig.json` and `vite.config.ts` so imports resolve as `@/features/...` instead of relative `../../../` chains.
- Mapped `brand-tokens.css` (navy/teal) onto shadcn's CSS variables in `src/index.css`; `--muted`/`--accent` collide in name but differ in meaning between the two files, so the shadcn slots got literal hex values hardcoded rather than chained via `var()`, leaving brand-tokens.css's own `--muted`/`--accent` untouched for direct consumers like `StatusBadge`.
- `src/api/order.types.ts` re-exports `mockApi.ts`'s types (`Order`, `OrderStatus`, `Page`, etc.) instead of redeclaring them.
- Search (`SearchInput`) matches both order number and product name in one field, since `mockApi.ts`'s `listOrders` already filters on both — not a UI choice, just surfacing the fixed API contract.
- Added step-gating (`returnFlowGuard.ts`) that redirects to the earliest incomplete step, and an order-eligibility guard on `ReturnFlowPage` (extracted `isOrderReturnEligible`) that bounces non-delivered/ineligible orders back to the order detail page instead of into the return flow.

### What I deliberately skipped

- **Per-item mixed resolution.** One resolution applies to the whole return, not a different one per item (e.g. refund one item, exchange another). The mock API only accepts a single resolution per submission, so supporting this properly would mean splitting a return into multiple sub-requests with their own retry handling. Cut for time; a deliberate scope call, not an oversight.
