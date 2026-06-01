# Lessons Learned

Anti-patterns and practices learned from past mistakes. Follow these to avoid repeating errors.

## Only Implement What Is Requested

**Problem**: Over-engineering by adding extra features, props, abstractions, or "improvements" that were not asked for.

**Solution**: Stick strictly to the requirements given. Do not anticipate future needs or add "nice-to-have" features.

**Examples of over-engineering to avoid**:

- Adding customizable props when hardcoded values are sufficient
- Creating configuration options that weren't requested
- Adding error handling for scenarios that won't happen
- Building abstractions for one-time use cases
- Adding callbacks like `onClose`, `onClick` when not needed
- Making components "flexible" when they serve a single purpose

**Key points**:

- Ask yourself: "Did the user ask for this?" - if no, don't add it
- Simple, focused code is easier to maintain than flexible, complex code
- Extra features create extra maintenance burden
- If flexibility is needed later, it can be added then

## Always Reuse Existing Components Before Writing Custom Styles

**Problem**: Writing custom inline CSS/Tailwind classes for UI elements that already exist as components.

**Solution**: Before styling any UI element, check `components/ui/` and `components/common/` for existing components that can be composed together.

**Example** - Instead of a hand-rolled pill button:

```tsx
// DON'T do this — custom button styling
<Link
  href="/shop"
  className="inline-flex shrink-0 rounded-full bg-[#050451] px-5 py-1.5 text-xs uppercase tracking-wider text-white transition-colors hover:bg-[#405aab]"
>
  Shop all
</Link>

// DO this — compose the existing Button primitive
<Button asChild>
  <Link href="/shop">Shop all</Link>
</Button>
```

**Key points**:

- Check `components/ui/button.tsx` for available variants (`default`, `outline`, `secondary`, `ghost`, `link`) and sizes (`sm`, `lg`, `icon`) before styling anything
- Use the `asChild` prop (Radix Slot pattern) when wrapping a `Link`
- Composing components ensures consistency and maintainability
- Changes to the design system automatically propagate everywhere

## Ask for Clarification Instead of Assuming

**Problem**: Making assumptions about ambiguous terms or requests instead of asking the user for clarification.

**Solution**: When a term or request is ambiguous, ask a clarifying question before proceeding. This is especially important when:

- The conversation has a clear context that the interpretation might break
- The term could reasonably mean multiple things
- Your interpretation would be a shift in topic

**Example** - When asked about "workspace configuration" during a conversation about Claude instructions:

```
// DON'T do this
Assume "workspace configuration" means project config files (package.json, tsconfig, etc.)
and proceed to list them without confirming.

// DO this
Ask: "By workspace configuration, do you mean project config files (package.json, tsconfig, etc.)
or Claude-specific local settings (CLAUDE.local.md)?"
```

**Key points**:

- Stay in the context of the conversation flow
- Don't jump to conclusions based on common interpretations
- A quick clarifying question prevents wasted effort and frustration
- When uncertain, ask - don't guess

## Gather Context Yourself — Don't Ask the User About Code

**Problem**: Asking the user to confirm things about the codebase that can be answered by reading the code directly. Examples: "Want me to check whether this is cached?", "Is this function used elsewhere?", "Does this depend on X?". This offloads work to the user that should be done by reading files, grepping, and following the call graph.

**Solution**: When curious about how a function works, whether it's cached, who calls it, what it returns, or any other question with a definitive answer in the code — open the file and read it. Use Grep/Glob to find usages. Follow imports until you have the answer. Only ask the user when the question is about **intent, priorities, or genuinely ambiguous requirements** — not facts that exist in the codebase.

**Example**:

```
// DON'T do this
"Quick question before I touch it: is getProducts() cached?
 Want me to check whether that's set up?"

// DO this
1. Read lib/services/products.ts — getProducts() calls apiClient.get("/api/products")
2. Follow to lib/api/client.ts — apiFetch is a plain fetch wrapper, no cache layer
3. Check app/api/products/route.ts — the BFF route forwards to the external backend
4. Report findings: "Checked — getProducts() is NOT cached. It calls
   apiClient.get('/api/products') → app/api/products/route.ts → the external
   backend on every call; there is no unstable_cache / React cache() wrapper.
   Here's the implication for your decision..."
```

**Key points**:

- Curiosity about code is your job to satisfy, not the user's burden
- Reserve user questions for what only the user knows: intent, priorities, ambiguous requirements, product decisions
- Read → Grep → Glob → follow imports → keep digging until you hit either an answer or a real ambiguity that needs human input
- Surface what you found and what it means, don't just dump tool output
- This contrasts with the "Ask for Clarification" rule above: that's about ambiguous user _intent_; this is about facts in the _code_

## Reusable Components Must Own Their Own Types

**Problem**: Making reusable components (UI primitives, common components) import types from specific feature components, creating tight coupling and reverse dependencies.

**Solution**: Each reusable component should define its own types based on what IT needs. The consumer (feature component / page) transforms its data to match what the reusable component expects.

**Example** - `ProductCard` needing product data:

```typescript
// DON'T do this - UI primitive depends on a feature component
// components/ui/product-card.tsx
import { Product } from "@/components/features/shop/types"; // ❌ Wrong direction!

export interface ProductCardProps {
  product: Product;
}

// DO this - the UI primitive owns the props it actually needs
// components/ui/product-card.tsx
export interface ProductCardProps {
  // ✅ Own type definition
  title: string;
  price: string;
  image?: string;
  href?: string;
  onAddToCart?: () => void;
}
```

**Key points**:

- `components/ui/` and `components/common/` must NEVER import from `components/features/`
- Dependency direction: `components/features/<domain>` → `components/common` / `components/ui` (not the reverse)
- Shared domain types live in `lib/types/`; a feature component maps its data to the primitive's props
- If the `Product` model adds a field, `ProductCard` shouldn't need to change
- Each component defines only the fields it actually uses
- This enables true reusability across different contexts

## Prefer Theme Tokens Over Hardcoded Values

**Problem**: Using hardcoded hex values and arbitrary Tailwind values (e.g., `text-[#050451]`, `bg-[#050451]`, `rounded-[22.5px]`) when equivalent theme tokens already exist in `app/globals.css`.

**Solution**: Before writing any color, size, or spacing value, check `app/globals.css` (and `lib/design-tokens/`) for existing CSS custom properties. Use the corresponding Tailwind token class instead of arbitrary values.

**Example** - Brand color and border-radius:

```css
/* app/globals.css already defines brand tokens, exposed as Tailwind classes via the @theme block: */
--primary-navy: #050451; /* → bg-primary-navy / text-primary-navy / border-primary-navy */
--primary-gold: #ffcd0e; /* → bg-primary-gold */
--secondary-mint: #e1f2ef; /* → bg-secondary-mint */
--radius: 0.625rem; /* pill shapes → rounded-full */
```

```tsx
// DON'T do this - hardcoded hex / arbitrary values
<h1 className="text-[#050451]">Title</h1>
<button className="bg-[#050451] rounded-[22.5px]">Shop</button>

// DO this - use the brand tokens
<h1 className="text-primary-navy">Title</h1>
<button className="bg-primary-navy rounded-full">Shop</button>
```

**Key points**:

- Always check `app/globals.css` (`@theme inline` block) and `lib/design-tokens/` before using arbitrary values
- Brand tokens: `--primary-navy`, `--primary-gold`, `--secondary-mint`/`-pink`/`-blue`, `--neutral-*` → `bg-*` / `text-*` / `border-*`
- For pill shapes on fixed-height elements, `rounded-full` is cleaner than exact `rounded-[Xpx]`
- Hardcoded values break when the design system changes; tokens update automatically

## Verify Every Usage Before Removing or Renaming Anything

**Problem**: Removing or renaming a state, prop, function, type, export, or any shared code based on a partial search, then claiming it's safe — only to break consumers that were missed.

**Solution**: Before removing or renaming anything, search for **every usage** across the entire codebase and actually read each result. Do not skim grep output, do not assume based on a few matches, and do not declare "only used in X" without opening every file that references it.

**Example** - Removing a `loading` state from the user context:

```typescript
// DON'T do this
// Grep for "loading", see UserButton.tsx, say "only used in one place", remove it.
// → Misses account pages and other consumers that also read `loading` from useUser()
// → App breaks, can't build.

// DO this
// 1. Search for every consumer of useUser() (from contexts/UserContext.tsx)
// 2. Open EACH file and check if it reads `loading`
// 3. Only after confirming every consumer does NOT use it, proceed with removal
```

**Key points**:

- This applies to everything: states, props, functions, types, exports, variables, CSS classes — not just shared interfaces
- "Grep and skim" is not verification. Read each result.
- If there are many consumers, check them all — not just the first few
- When in doubt, tell the user which files you checked and let them confirm before proceeding
