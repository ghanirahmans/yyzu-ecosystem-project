// ============================================================
// YYZU Logger — structured logging wrapper (no deps)
//
// Wraps console with structured output. Swap to pino / winston
// when we need file transport, log levels, or ingestion.
// ============================================================

const LOG_LEVEL = (process.env.LOG_LEVEL ?? "info") as
  | "debug"
  | "info"
  | "warn"
  | "error";

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

function shouldLog(level: keyof typeof LEVELS): boolean {
  return LEVELS[level] >= LEVELS[LOG_LEVEL];
}

function format(level: string, message: string, meta?: Record<string, unknown>) {
  const ts = new Date().toISOString();
  const base = { ts, level, message, ...meta };
  // In production, strip sensitive data; in dev, pretty-print
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(base);
  }
  return base;
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("debug")) return;
    console.debug(format("debug", message, meta));
  },
  info(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("info")) return;
    console.info(format("info", message, meta));
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("warn")) return;
    console.warn(format("warn", message, meta));
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (!shouldLog("error")) return;
    console.error(format("error", message, meta));
  },
};