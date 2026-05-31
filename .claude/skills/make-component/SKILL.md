---
name: make-component
description: "Scaffold a new component or template with index.tsx and types.ts"
---

# Make Component

Generate a new component or template scaffold with the correct folder structure, following project conventions.

## Usage

```
/make-component <ComponentName> [template]
```

**Arguments:**
- `ComponentName` — PascalCase name (required). Supports nested paths like `Auth/LoginForm`.
- If the user mentions "template" anywhere in the prompt (e.g., `template`, `as template`, `in templates`), place it in `src/templates/` and append `Template` to the code name. Otherwise, default to `src/components/`.

## Validation

Before generating files, validate:

1. **PascalCase** — The component name must start with an uppercase letter and contain only letters and numbers (e.g., `MyCard`, `LoginForm`). Reject names like `myCard`, `my-card`, `my_card`.
2. **Folder doesn't exist** — Check that the target folder does not already exist. If it does, stop and inform the user.

## Generated Files

### For components (`/make-component MyCard`)

Creates `src/components/MyCard/`:

**index.tsx:**
```tsx
import { MyCardProps } from "./types";

export default function MyCard({}: MyCardProps) {
  return (
    <div>
      <h1>MyCard component</h1>
    </div>
  );
}
```

**types.ts:**
```tsx
export interface MyCardProps {}
```

### For templates (`/make-component Event template`)

Creates `src/templates/Event/`:

**index.tsx:**
```tsx
import { EventTemplateProps } from "./types";

export default function EventTemplate({}: EventTemplateProps) {
  return (
    <div>
      <h1>EventTemplate component</h1>
    </div>
  );
}
```

**types.ts:**
```tsx
export interface EventTemplateProps {}
```

### Nested paths (`/make-component Auth/LoginForm`)

Creates `src/components/Auth/LoginForm/`:

**index.tsx:**
```tsx
import { LoginFormProps } from "./types";

export default function LoginForm({}: LoginFormProps) {
  return (
    <div>
      <h1>LoginForm component</h1>
    </div>
  );
}
```

**types.ts:**
```tsx
export interface LoginFormProps {}
```

The code name is always derived from the **last segment** of the path.

## Rules

### Code Style (from `.claude/rules/code-style.md`)
- Use **function declarations** for exported functions — never arrow functions.
- Single component file → `export default function`.
- Follow `.prettierrc` formatting: double quotes, semicolons, trailing commas, 2-space indent, Stroustrup brace style.

### Scaffold Rules
- Do NOT include `import React from 'react'` — React 19 does not require it for JSX.
- Do NOT generate Storybook story files.
- Use `types.ts` (not `types.d.ts`).
- Props interface name = `{CodeName}Props`.
- For templates, code name = `{ComponentName}Template`, props = `{ComponentName}TemplateProps`.
- Use the Write tool to create both files.
- After creation, confirm the files created with their paths.
