import { assert, assertEquals } from "@std/assert";
import { process } from "./mod.ts";

const SHELL = Deno.build.os === "windows" ? "cmd.exe" : "/bin/sh";

Deno.test("process.exec runs a command and captures stdout", async () => {
  if (Deno.build.os === "windows") {
    const r = await process.exec("cmd.exe", ["/c", "echo hello"]);
    assertEquals(r.success, true);
    assertEquals(r.stdout.trim(), "hello");
  } else {
    const r = await process.exec("echo", ["hello"]);
    assertEquals(r.success, true);
    assertEquals(r.stdout.trim(), "hello");
  }
});

Deno.test("process.exec reports failure code on non-zero exit", async () => {
  const r = await process.exec(SHELL, [
    "-c",
    Deno.build.os === "windows" ? "exit /b 7" : "exit 7",
  ]);
  assertEquals(r.success, false);
  assertEquals(r.code, 7);
});

Deno.test("process.exec captures stderr separately", async () => {
  if (Deno.build.os === "windows") {
    const r = await process.exec("cmd.exe", ["/c", "echo err 1>&2"]);
    assertEquals(r.stderr.trim(), "err");
  } else {
    const r = await process.exec("/bin/sh", ["-c", "echo err 1>&2"]);
    assertEquals(r.stderr.trim(), "err");
  }
});

Deno.test("process.spawn returns a handle with pid", async () => {
  const handle = process.spawn("echo", ["spawned"]);
  assert(handle.pid > 0);
  const result = await handle.wait();
  assertEquals(result.success, true);
  assertEquals(result.stdout.trim(), "spawned");
});

Deno.test("process.spawn streams stdout incrementally", async () => {
  if (Deno.build.os === "windows") return;
  const handle = process.spawn("/bin/sh", ["-c", "echo one; echo two"]);
  const chunks: string[] = [];
  for await (const chunk of handle.stdout) {
    chunks.push(new TextDecoder().decode(chunk));
  }
  await handle.wait();
  const combined = chunks.join("");
  assert(combined.includes("one"));
  assert(combined.includes("two"));
});

Deno.test("process.exec supports env override", async () => {
  if (Deno.build.os === "windows") {
    const r = await process.exec("cmd.exe", ["/c", "echo %TSKIT_TEST%"], {
      env: { TSKIT_TEST: "envvalue" },
    });
    assertEquals(r.stdout.trim(), "envvalue");
  } else {
    const r = await process.exec("/bin/sh", ["-c", "echo $TSKIT_TEST"], {
      env: { TSKIT_TEST: "envvalue" },
    });
    assertEquals(r.stdout.trim(), "envvalue");
  }
});

Deno.test("process.exec respects timeout and kills long-running command", async () => {
  if (Deno.build.os === "windows") return;
  const start = performance.now();
  const r = await process.exec("/bin/sh", ["-c", "sleep 5"], { timeout: 200 });
  const elapsed = performance.now() - start;
  assert(elapsed < 2000, `elapsed=${elapsed}ms`);
  assertEquals(r.success, false);
});
