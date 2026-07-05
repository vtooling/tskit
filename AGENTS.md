# AGENTS.md

Commands for this repository (Deno 2.9+, no Node/npm).

## Type check

```
deno check mod.ts
```

## Lint + format check

```
deno task check
```

## Run tests (with coverage)

```
deno task test
```

## Format code

```
deno task fmt
```

## JSR dry-run publish check

```
deno publish --dry-run
```

## Notes

- Pure Deno runtime; use `jsr:@std/*` imports declared in `deno.json`.
- Each module exports a namespace object (e.g. `export const fs = { ... }`).
- Tests live next to source as `*_test.ts` and run under `--allow-all`.
- Required permissions by module:
  - `fs`: `--allow-read`, `--allow-write`
  - `process`: `--allow-run`
  - `http`: `--allow-net`
  - `config`: `--allow-read`
  - `system`: `--allow-sys`, `--allow-env`
