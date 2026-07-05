export interface SystemInfo {
  os: typeof Deno.build.os;
  arch: string;
  cpus: number;
  memory: {
    total: number;
    free: number;
  };
  hostname: string;
}

export function info(): SystemInfo {
  const memory = Deno.systemMemoryInfo();
  return {
    os: Deno.build.os,
    arch: Deno.build.arch,
    cpus: navigator.hardwareConcurrency ?? 0,
    memory: {
      total: memory.total,
      free: memory.free,
    },
    hostname: Deno.hostname(),
  };
}

export const system = {
  info,
};

export type System = typeof system;
