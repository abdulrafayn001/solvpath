# solvpath

A frontend take-home: an order-management dashboard with a multi-step returns flow, built against a fixed mock API contract.

## Stack

- React 19 + TypeScript, built with Vite, routed with `react-router-dom` v7
- Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config`) + shadcn/ui (`base-vega` style, `neutral` base color, see `components.json`)
- TanStack Query v5 for all server-state (fetching, mutations, caching)
- Vitest for unit tests
- Node pinned to `24.18.0` locally via `.nvmrc`; `package.json`'s `engines.node` is the looser `24.x` (Vercel only resolves a major Node version, so an exact patch pin there fails the build) with `engine-strict=true` in `.npmrc` still enforcing the major version on install

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — `tsc -b` then `vite build`
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint (flat config: TS + react-hooks + react-refresh)
- `npm run format` — Prettier over `**/*.{ts,tsx}`
- `npm run test` — `vitest run`

## Code style

- Prettier: no semicolons, double quotes, `es5` trailing commas, 80-char width, `prettier-plugin-tailwindcss` for class sorting (see `.prettierrc`). Some older files (e.g. `src/api/*`) still have semicolons from before this was settled — match the no-semicolon style in new code.
- Path alias `@/*` → `src/*` (defined in both `tsconfig.app.json` and `vite.config.ts`).
- **Every component's props type lives in a sibling `ComponentName.types.ts` file** — never inlined or declared in the same file as the component. This is followed consistently across `src/features/**`.
- Feature code is organized by domain under `src/features/<domain>/`, not by file type.

## Architecture

```
src/
  api/            mock backend contract + a thin service layer over it
  hooks/          TanStack Query hooks and small utility hooks (one per file)
  features/
    orders/        dashboard components (table + card variants, filters, pagination)
    returns/        return-flow components, reducer, calculations
  pages/          route-level components, incl. pages/return/ (one per wizard step)
  routes/         Routes.tsx — the route table
  components/     shared/layout components + components/ui (shadcn primitives)
  lib/            format.ts, status.ts, constants.ts, utils.ts (cn helper)
  styles/         brand-tokens.css, layered into index.css's shadcn CSS variables
```

### API layer (`src/api/`)

- `mockApi.ts` is a **fixed contract** — it simulates a real backend (artificial latency, randomized failure rates for list/submit, `ApiError`). Per its own header comment: read it, build against it, don't change its behavior.
- `order.service.ts` wraps the raw mock functions (`listOrders`, `getOrder`, `submitReturn`) with `withNormalizedError` (`errors.ts`) so callers always get a consistent `AppError` shape.
- `returnsService.ts` is a thin returns-domain re-export of `order.service`'s `submitReturn`.
- `order.types.ts` re-exports `mockApi.ts`'s types (`Order`, `OrderStatus`, `Page`, etc.) rather than redeclaring them — `mockApi.ts` is the source of truth for these shapes.
- Everything above is barreled through `src/api/index.ts`; feature code imports from `@/api`, not the individual files.

### Data fetching (`src/hooks/`)

- `useOrders` / `useOrder` / `useSubmitReturn` wrap TanStack Query around the service layer — query keys, `keepPreviousData`, debounced search (`useDebouncedValue`, 300ms), and `AbortSignal` passthrough for cancellation.
- `useSubmitReturn` adds its own `isPending` guard on top of React Query's, because `submitReturn` doesn't accept an `AbortSignal` — that guard (plus disabling the submit button) is what actually prevents a double-click firing two requests.
- `useInfiniteOrders` powers the mobile card list (infinite scroll) as a separate hook from the desktop paginated table — same underlying `fetchOrders`, different consumption pattern.

### Orders dashboard (`src/features/orders/`, `src/pages/DashboardPage.tsx`)

- Responsive split at the `md` breakpoint (768px), driven by `useMediaQuery` against `DESKTOP_QUERY` in `lib/constants.ts` — desktop gets `OrdersTable` (paginated), mobile gets `MobileOrdersInfiniteList` (infinite scroll via `useIntersectionObserver`). The same breakpoint value backs the CSS `md:` classes so JS and CSS never drift independently.
- `ORDERS_PAGE_SIZE` (4) is shared by both the real fetch and the loading skeletons, so skeleton row/card count always matches a real page.
- Single `SearchInput` matches both order number and product name — this isn't a UI choice, it's `mockApi.ts`'s `listOrders` already filtering on both fields.
- `useExpandedOrders` tracks which order rows are expanded.

### Returns flow (`src/features/returns/`, `src/pages/return/`)

- A 4-step wizard (`items` → `reason` → `resolution` → `review`), defined once in `returnFlowSteps.ts` (`RETURN_FLOW_STEPS`) and driven by nested routes under `/orders/:orderId/return/*`.
- State: `ReturnFlowContext` provides `{ state, dispatch, order }` (see `ReturnFlowContext.tsx`); `returnFlowReducer.ts` is a plain reducer (`SET_ITEMS`, `SET_REASON`, `SET_COMMENT`, `SET_RESOLUTION`, `RESET`) — no external state library.
- **Step gating**: `returnFlowGuard.ts`'s `getReturnFlowRedirectStep` finds the earliest incomplete step before the one being viewed and redirects there — you can't jump ahead to `review` without a resolution selected, etc.
- **Order eligibility guard**: `ReturnFlowPage` uses an extracted `isOrderReturnEligible` check to bounce non-delivered/ineligible orders back to the order detail page instead of into the flow.
- `returnCalculations.ts` computes return value in cents (base value, store-credit bonus at +10% with round-half-up, per-resolution totals) — deliberately integer-cents arithmetic throughout to avoid float drift (see `returnCalculations.test.ts` for the drift cases this guards against, e.g. `$19.99 x 3`).
- **Scope cut, deliberately**: one resolution applies to the whole return, not per-item (the mock API only accepts a single resolution per submission — see README's Decision Log).

### Styling

- `src/styles/brand-tokens.css` (navy/teal) is layered onto shadcn's CSS variables in `src/index.css`. `--muted`/`--accent` collide in name but differ in meaning between the two files, so those specific shadcn slots got literal hex values hardcoded instead of `var()`-chaining — `brand-tokens.css`'s own `--muted`/`--accent` are left untouched for direct consumers like `StatusBadge`. If you touch either file, re-check this collision before assuming `var()` chaining is safe.
- shadcn primitives live in `src/components/ui/` (currently: button, input, radio-group, select) — add more via `npx shadcn@latest add <component>`, not by hand-rolling equivalents.

#### Brand tokens (`src/styles/brand-tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--brand` | `#0E2C3E` | primary buttons & chrome; pair with white text |
| `--brand-hover` | `#17394E` | hover state for `--brand` |
| `--brand-soft` | `#E7F0F3` | soft brand background |
| `--accent` | `#28B0C8` | active states, focus, selection, highlights |
| `--accent-deep` | `#0C6E80` | teal text/links — contrast-safe on white, use over `--accent` for text |
| `--accent-soft` | `#E4F5F8` | soft accent background |
| `--ink` | `#0B2430` | body text |
| `--muted` | `#566671` | secondary text |
| `--line` | `#E2E8EB` | borders/dividers |
| `--canvas` | `#F4F7F9` | page background |
| `--surface` | `#FFFFFF` | cards |
| `--radius-card` | `16px` | card corner radius |
| `--font-sans` | `"Inter", system-ui, sans-serif` | default typeface |

Status pairs (text color + soft background), each tied to a specific order status — use the matching pair together, don't mix across statuses:

| Status | Text | Soft background | Order status |
|---|---|---|---|
| success | `#127A3B` | `#E7F7ED` | delivered |
| info | `#1D4ED8` | `#E7EEFF` | in transit / shipped |
| warning | `#B45309` | `#FBF0DE` | processing |
| danger | `#B91C1C` | `#FCEBEB` | cancelled |

`StatusBadge` (`src/components/StatusBadge.tsx`) is the intended single consumer of the status pairs — reuse it for any status-colored UI rather than re-deriving the mapping.

## Testing

- Vitest, `describe`/`it` from `"vitest"` directly (not globals).
- Existing coverage: `returnCalculations.test.ts` (pricing/rounding edge cases) and `returnFlowReducer.test.ts` (reducer transitions). Follow this same colocated `*.test.ts` next to the module it tests.

## Things to not "fix" without checking first

- Don't change `mockApi.ts` behavior (latency, failure rates, filtering) — it's the fixed grading contract.
- Don't collapse `order.service.ts` / `returnsService.ts` into `mockApi.ts` — the normalized-error wrapper (`withNormalizedError`) is the seam between the fixed mock and everything else.
- Don't merge shadcn's `--muted`/`--accent` with `brand-tokens.css`'s same-named variables via `var()` — they mean different things (see Styling above).
