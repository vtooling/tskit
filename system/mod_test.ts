import { assert, assertEquals } from "@std/assert";
import { system } from "./mod.ts";

Deno.test("system.info returns structured runtime info", () => {
  const info = system.info();
  const validOs = ["darwin", "linux", "windows"] as const;
  assert((validOs as readonly string[]).includes(info.os));
  assertEquals(typeof info.arch, "string");
  assert(info.cpus > 0);
  assert(info.memory.total > 0);
  assert(info.memory.free >= 0);
  assertEquals(typeof info.hostname, "string");
  assert(info.hostname.length > 0);
});
