import { assertEquals, assertRejects } from "@std/assert";
import { http, HttpError } from "./mod.ts";

async function withServer(
  handler: (req: Request) => Response | Promise<Response>,
  fn: (base: string) => Promise<void>,
): Promise<void> {
  const controller = new AbortController();
  const server = Deno.serve({
    port: 0,
    hostname: "127.0.0.1",
    signal: controller.signal,
  }, handler);
  const { hostname, port } = server.addr as { hostname: string; port: number };
  const base = `http://${hostname}:${port}`;
  try {
    await fn(base);
  } finally {
    controller.abort();
    await server.finished;
  }
}

Deno.test("http.get returns OK response", async () => {
  await withServer(
    () => new Response("hello", { status: 200 }),
    async (base) => {
      const res = await http.get(`${base}/`);
      assertEquals(res.status, 200);
      assertEquals(await res.text(), "hello");
    },
  );
});

Deno.test("http.get throws HttpError on 4xx by default", async () => {
  await withServer(
    () => new Response("nope", { status: 404 }),
    async (base) => {
      await assertRejects(
        async () => await http.get(`${base}/`),
        HttpError,
      );
    },
  );
});

Deno.test("http.get with throwOnError:false returns non-ok response", async () => {
  await withServer(
    () => new Response("err", { status: 500 }),
    async (base) => {
      const res = await http.get(`${base}/`, { throwOnError: false });
      assertEquals(res.status, 500);
      assertEquals(await res.text(), "err");
    },
  );
});

Deno.test("http.post sends JSON body with Content-Type", async () => {
  await withServer(
    async (req) => {
      const body = await req.json();
      return Response.json({ echo: body });
    },
    async (base) => {
      const res = await http.post(`${base}/`, { body: { x: 1 } });
      assertEquals(res.status, 200);
      assertEquals(await res.json(), { echo: { x: 1 } });
    },
  );
});

Deno.test("http.post passes custom headers", async () => {
  await withServer(
    (req) => {
      const auth = req.headers.get("authorization") ?? "";
      return new Response(auth, { status: 200 });
    },
    async (base) => {
      const res = await http.post(`${base}/`, {
        body: "x",
        headers: { authorization: "Bearer token" },
      });
      assertEquals(await res.text(), "Bearer token");
    },
  );
});

Deno.test("http.delete issues DELETE method", async () => {
  await withServer(
    (req) => new Response(req.method, { status: 200 }),
    async (base) => {
      const res = await http.delete(`${base}/item/1`);
      assertEquals(res.status, 200);
      assertEquals(await res.text(), "DELETE");
    },
  );
});
