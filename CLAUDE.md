# FinanceTracker — Claude Guidelines

## UI Conventions

### Cursor Pointer on Interactive Elements

All interactive elements that act as buttons or selectable options must use `cursor-pointer`. This applies to:

- `SelectTrigger` — the dropdown toggle button
- `SelectItem` — each option inside the dropdown list

Do **not** use `cursor-default` on any clickable/selectable UI primitive. When adding or modifying shadcn/Radix UI components, always verify interactive parts have `cursor-pointer` in their className.
