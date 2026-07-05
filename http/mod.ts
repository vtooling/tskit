export type HttpBody = BodyInit | Record<string, unknown> | unknown[] | null;

export interface HttpOptions extends Omit<RequestInit, "body" | "method"> {
  body?: HttpBody;
  headers?: HeadersInit;
  throwOnError?: boolean;
}

export class HttpError extends Error {
  status: number;
  response: Response;
  constructor(response: Response) {
    super(`HTTP ${response.status} ${response.statusText}`);
    this.name = "HttpError";
    this.status = response.status;
    this.response = response;
  }
}

function normalizeBody(body: HttpBody): BodyInit | null {
  if (body === null || body === undefined) return null;
  if (
    typeof body === "string" || body instanceof FormData ||
    body instanceof URLSearchParams || body instanceof Blob ||
    body instanceof ArrayBuffer || body instanceof Uint8Array ||
    (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
  ) {
    return body as BodyInit;
  }
  return JSON.stringify(body);
}

async function request(
  method: string,
  url: string | URL,
  opts: HttpOptions = {},
): Promise<Response> {
  const { body, headers, throwOnError = true, ...rest } = opts;
  const hasJsonObjectBody = body !== null && body !== undefined && typeof body === "object" &&
    !(body instanceof FormData) && !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) && !(body instanceof ArrayBuffer) &&
    !(body instanceof Uint8Array);

  const finalHeaders = new Headers(headers);
  if (hasJsonObjectBody && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    method,
    body: normalizeBody(body as HttpBody),
    headers: finalHeaders,
    ...rest,
  });

  if (throwOnError && !response.ok) {
    throw new HttpError(response);
  }
  return response;
}

export function get(url: string | URL, opts?: HttpOptions): Promise<Response> {
  return request("GET", url, opts);
}

export function post(url: string | URL, opts?: HttpOptions): Promise<Response> {
  return request("POST", url, opts);
}

export function put(url: string | URL, opts?: HttpOptions): Promise<Response> {
  return request("PUT", url, opts);
}

export function del(url: string | URL, opts?: HttpOptions): Promise<Response> {
  return request("DELETE", url, opts);
}

export const http = {
  get,
  post,
  put,
  delete: del,
};

export type Http = typeof http;
