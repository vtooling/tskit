import { assert, assertEquals, assertRejects } from "@std/assert";
import { fs } from "./mod.ts";

Deno.test("fs.writeText writes and readText reads back", async () => {
  const dir = await Deno.makeTempDir();
  const file = `${dir}/hello.txt`;
  await fs.writeText(file, "hello world");
  const content = await fs.readText(file);
  assertEquals(content, "hello world");
});

Deno.test("fs.writeText fails if file already exists (createNew)", async () => {
  const dir = await Deno.makeTempDir();
  const file = `${dir}/exists.txt`;
  await fs.writeText(file, "first");
  await assertRejects(() => fs.writeText(file, "second"));
});

Deno.test("fs.list returns directory entries", async () => {
  const dir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${dir}/a.txt`, "a");
  await Deno.mkdir(`${dir}/sub`);
  const entries = await fs.list(dir);
  const names = entries.map((e) => e.name).sort();
  assertEquals(names, ["a.txt", "sub"]);
  const sub = entries.find((e) => e.name === "sub");
  const a = entries.find((e) => e.name === "a.txt");
  assert(sub?.isDirectory);
  assert(a?.isFile);
});
