# Code Style

## Formatting

Prettier (`.prettierrc`) and ESLint (`eslint.config.mjs`) are the source of truth for all formatting and linting rules. Follow them strictly — do not fight or override their output. Read the config files for specifics when needed.

## Functions

- Use **function declarations** for all exported/public functions — components, services, utilities, hooks, etc.
- Arrow functions are only for **private/internal use**: event handlers, callbacks, inline functions inside a component or module.
- **Inside `useEffect`**: named functions must use function declarations, not arrow functions.
- **Naming**: Non-component functions use **camelCase** (`getProducts`, `handleClick`, `formatPrice`). Components use **PascalCase** (covered in the Components section below).

  ```tsx
  // Do — exported functions use function declarations
  export function getProducts() { ... }
  export function HeroSection() { ... }

  // Do — private functions inside a component use arrow functions
  const handleClick = () => { ... };
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  // Don't — exported functions should not be arrow functions
  export const getProducts = () => { ... };
  export const HeroSection = () => { ... };

  // Do — function declarations inside useEffect
  useEffect(() => {
    async function fetchData() { ... }
    fetchData();
  }, []);

  // Don't — arrow functions inside useEffect
  useEffect(() => {
    const fetchData = async () => { ... };
    fetchData();
  }, []);
  ```

## Components

- Always use **function declarations**, not arrow function variables (follows the rule above):

  ```tsx
  // Do
  function Card({ children }: CardProps) {}

  // Don't
  const Card = ({ children }: CardProps) => {};
  ```

- **Use named exports for components** — this is the repo-wide convention (`export function Header()`, `export function CartPage()`). `components/ui/` primitives are re-exported at the bottom of the file (`export { Button, buttonVariants }`). Private helper components in the same file stay unexported.

  ```tsx
  // Do
  export function CartSummary({ items }: CartSummaryProps) {
    return <div>...</div>;
  }

  // Don't — components do not use default export
  export default function CartSummary({ items }: CartSummaryProps) {}
  ```

- **Default export is only for framework-required files**: Next.js route files under `app/` (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`, …) and Storybook `*.stories.tsx` (the `meta` default export). Do not use default export for anything else.

## File & Folder Naming

There is **no `src/`** — `@/*` aliases the repo root (`tsconfig.json` → `"@/*": ["./*"]`). All paths below are written from the root.

### `docs/`

- kebab-case `.md` files: `homepage.md`, `product-detail.md`, `shop-all.md`.

### `components/`

- **`components/common/`** (Header, Footer, UserButton) and **`components/icons/`**: PascalCase `.tsx` files (`Header.tsx`, `UserButton.tsx`, `PetIcons.tsx`).
- **`components/features/<domain>/`**: the **domain folder is kebab-case** (`product-detail/`, `pet-care/`, `shop-all/`); component **`.tsx` files inside are PascalCase** (`HeroSection.tsx`, `CartPage.tsx`, `ProductImageGallery.tsx`); non-component data/helper **`.ts` files are kebab-case** (`cart-data.ts`).
- **`components/ui/`** (shadcn primitives): kebab-case for everything (`button.tsx`, `product-card.tsx`, `navigation-menu-content.tsx`), including their `*.stories.tsx`.

### `contexts/` and `hooks/`

- Context files are PascalCase (`UserContext.tsx`). Hook files are camelCase matching the hook name (`useSessionRefresh.ts`).

### `lib/` (api, services, types, utils, validators, constants, design-tokens, mock)

- kebab-case for both folders and files (`design-tokens/`, `auth.ts`, `products.ts`, `images.ts`).

### `app/`

- kebab-case plus Next.js routing conventions: `[slug]` dynamic segments, `(shop)` route groups, `route.ts` handlers, `page.tsx` / `layout.tsx`.

### `types/` (root)

- Ambient declaration files keep their required names (`next-auth.d.ts`).
