import { assert, assertEquals } from "@std/assert";
import { path } from "./mod.ts";

Deno.test("path.join joins segments", () => {
  assertEquals(path.join("a", "b", "c"), "a/b/c");
  assertEquals(path.join("/root", "sub", "file.txt"), "/root/sub/file.txt");
});

Deno.test("path.basename returns file name", () => {
  assertEquals(path.basename("/foo/bar/file.txt"), "file.txt");
  assertEquals(path.basename("/foo/bar/file.txt", ".txt"), "file");
});

Deno.test("path.dirname returns directory", () => {
  assertEquals(path.dirname("/foo/bar/file.txt"), "/foo/bar");
});

Deno.test("path.extname returns extension", () => {
  assertEquals(path.extname("file.tar.gz"), ".gz");
  assertEquals(path.extname("noext"), "");
});

Deno.test("path.normalize collapses separators", () => {
  assertEquals(path.normalize("a//b/../c"), "a/c");
});

Deno.test("path.relative computes relative path", () => {
  const r = path.relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb");
  assertEquals(r, "../../impl/bbb");
});

Deno.test("path.isAbsolute detects absolute paths", () => {
  assert(path.isAbsolute("/home"));
  assert(!path.isAbsolute("relative/path"));
});

Deno.test("path.sep and delimiter are strings", () => {
  assertEquals(typeof path.sep, "string");
  assertEquals(typeof path.delimiter, "string");
});
