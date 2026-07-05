export interface ExecOptions {
  cwd?: string | URL;
  env?: Record<string, string>;
  stdin?: "inherit" | "null" | "piped";
  stdout?: "inherit" | "null" | "piped";
  stderr?: "inherit" | "null" | "piped";
  timeout?: number;
}

export interface ExecResult {
  success: boolean;
  code: number;
  stdout: string;
  stderr: string;
}

export async function exec(
  command: string,
  args: string[] = [],
  opts: ExecOptions = {},
): Promise<ExecResult> {
  const cmd = new Deno.Command(command, {
    args,
    cwd: opts.cwd,
    env: opts.env,
    stdin: opts.stdin ?? "null",
    stdout: opts.stdout ?? "piped",
    stderr: opts.stderr ?? "piped",
  });

  const child = cmd.spawn();

  if (opts.timeout && opts.timeout > 0) {
    const timer = setTimeout(() => child.kill("SIGTERM"), opts.timeout);
    try {
      const output = await child.output();
      return toResult(output);
    } finally {
      clearTimeout(timer);
    }
  }

  const output = await child.output();
  return toResult(output);
}

function toResult(output: Deno.CommandOutput): ExecResult {
  return {
    success: output.success,
    code: output.code,
    stdout: new TextDecoder().decode(output.stdout),
    stderr: new TextDecoder().decode(output.stderr),
  };
}

export interface SpawnOptions extends ExecOptions {}

export interface ProcessHandle {
  pid: number;
  kill: (signal?: Deno.Signal) => void;
  stdout: ReadableStream<Uint8Array>;
  stderr: ReadableStream<Uint8Array>;
  wait: () => Promise<ExecResult>;
}

export function spawn(
  command: string,
  args: string[] = [],
  opts: SpawnOptions = {},
): ProcessHandle {
  const cmd = new Deno.Command(command, {
    args,
    cwd: opts.cwd,
    env: opts.env,
    stdin: opts.stdin ?? "null",
    stdout: opts.stdout ?? "piped",
    stderr: opts.stderr ?? "piped",
  });

  const child = cmd.spawn();
  const decoder = new TextDecoder();

  return {
    pid: child.pid,
    kill: (signal: Deno.Signal = "SIGTERM") => child.kill(signal),
    stdout: child.stdout,
    stderr: child.stderr,
    wait: async () => {
      const output = await child.output();
      return {
        success: output.success,
        code: output.code,
        stdout: decoder.decode(output.stdout),
        stderr: decoder.decode(output.stderr),
      };
    },
  };
}

export const process = {
  exec,
  spawn,
};

export type Process = typeof process;
