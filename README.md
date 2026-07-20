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
