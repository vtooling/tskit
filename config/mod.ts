import { parse as parseYaml } from "@std/yaml";
import { parse as parseToml } from "@std/toml";

export type ConfigFormat = "json" | "yaml" | "yml" | "toml";

export interface LoadOptions {
  format?: ConfigFormat;
}

export async function load(
  path: string | URL,
  opts: LoadOptions = {},
): Promise<unknown> {
  const format = opts.format ?? detectFormat(path);
  const text = await Deno.readTextFile(path);

  switch (format) {
    case "json":
      return JSON.parse(text);
    case "yaml":
    case "yml":
      return parseYaml(text);
    case "toml":
      return parseToml(text);
    default:
      throw new TypeError(`Unsupported config format: ${format}`);
  }
}

function detectFormat(path: string | URL): ConfigFormat {
  const str = path instanceof URL ? path.pathname : path;
  const ext = str.slice(str.lastIndexOf(".") + 1).toLowerCase();
  if (ext === "json" || ext === "yaml" || ext === "yml" || ext === "toml") {
    return ext;
  }
  throw new TypeError(`Cannot infer config format from path: ${str}`);
}

export const config = {
  load,
};

export type Config = typeof config;
