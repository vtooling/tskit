import { assertEquals, assertRejects } from "@std/assert";
import { config } from "./mod.ts";

async function withTempFile(
  ext: string,
  content: string,
  fn: (path: string) => Promise<void>,
): Promise<void> {
  const dir = await Deno.makeTempDir();
  const path = `${dir}/cfg.${ext}`;
  await Deno.writeTextFile(path, content);
  try {
    await fn(path);
  } finally {
    await Deno.remove(dir, { recursive: true });
  }
}

Deno.test("config.load parses JSON by extension", async () => {
  await withTempFile("json", '{"a":1,"b":[2,3]}', async (path) => {
    assertEquals(await config.load(path), { a: 1, b: [2, 3] });
  });
});

Deno.test("config.load parses YAML by extension", async () => {
  await withTempFile("yaml", "name: tskit\nversion: 1\n", async (path) => {
    assertEquals(await config.load(path), { name: "tskit", version: 1 });
  });
});

Deno.test("config.load parses yml extension", async () => {
  await withTempFile("yml", "key: value\n", async (path) => {
    assertEquals(await config.load(path), { key: "value" });
  });
});

Deno.test("config.load parses TOML by extension", async () => {
  await withTempFile("toml", 'name = "tskit"\nversion = 1\n', async (path) => {
    assertEquals(await config.load(path), { name: "tskit", version: 1 });
  });
});

Deno.test("config.load honors explicit format override", async () => {
  await withTempFile("txt", '{"x":10}', async (path) => {
    assertEquals(await config.load(path, { format: "json" }), { x: 10 });
  });
});

Deno.test("config.load rejects unknown extension", async () => {
  await withTempFile("txt", "whatever", async (path) => {
    await assertRejects(() => config.load(path));
  });
});
