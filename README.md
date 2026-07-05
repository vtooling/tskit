# tskit

A Deno-first TypeScript kit of atomic capabilities for scripting, automation, and future Agent/MCP
work.

## Goal

Provide a small set of well-typed namespace modules (`fs`, `path`, `process`, `http`, `config`,
`system`) that cover the 80% of Python scripting needs, designed to grow into an Agent runtime.

## Install

```ts
import { config, fs, http, path, process, system } from "@tskit/core";
```

Or pull a single module:

```ts
import { fs } from "@tskit/core/fs";
```

## Quick example

```ts
import { fs, http, process } from "@tskit/core";

const files = await fs.list(".");

const r = await process.exec("git", ["status"]);
console.log(r.stdout);

const res = await http.get("https://example.com");
console.log(res.status);
```

## Permissions

Each module documents the Deno permissions it needs. Use the minimum scope possible:

| Module    | Flags                           |
| --------- | ------------------------------- |
| `fs`      | `--allow-read`, `--allow-write` |
| `path`    | (none)                          |
| `process` | `--allow-run`                   |
| `http`    | `--allow-net`                   |
| `config`  | `--allow-read`                  |
| `system`  | `--allow-sys`, `--allow-env`    |

## Layout

```
mod.ts          unified entrypoint
fs/             readText, writeText, list
path/           join, basename, dirname, extname, normalize, relative
process/        exec, spawn
http/           get, post
config/         load (json/yaml/toml)
system/         info
```

## Status

MVP: 10 core capabilities. Future layers (json/csv/archive/terminal/agent) will be added
incrementally.
