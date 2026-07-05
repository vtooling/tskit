export async function readText(path: string | URL): Promise<string> {
  return await Deno.readTextFile(path);
}

export async function writeText(
  path: string | URL,
  data: string,
): Promise<void> {
  await Deno.writeTextFile(path, data, { createNew: true });
}

export async function list(dir: string | URL): Promise<Deno.DirEntry[]> {
  const entries: Deno.DirEntry[] = [];
  for await (const entry of Deno.readDir(dir)) {
    entries.push(entry);
  }
  return entries;
}

export const fs = {
  readText,
  writeText,
  list,
};

export type Fs = typeof fs;
