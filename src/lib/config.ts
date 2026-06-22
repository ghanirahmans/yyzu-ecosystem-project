/**
 * src/lib/config.ts
 *
 * Centralized environment variable configuration with startup-time validation.
 * If a required variable is missing, the process throws a fatal Error immediately
 * so the issue surfaces at boot rather than at runtime.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`FATAL: Environment variable "${key}" is not defined. Add it to your .env file.`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

// ---------------------------------------------------------------------------
// Required variables — will throw at startup if missing
// ---------------------------------------------------------------------------

export const JWT_SECRET: string = (() => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'FATAL: JWT_SECRET is not defined. Set it in your .env file before starting the server.'
    );
  }
  return process.env.JWT_SECRET;
})();

export const DATABASE_URL: string = requireEnv("DATABASE_URL");

// ---------------------------------------------------------------------------
// Optional variables — have safe defaults
// ---------------------------------------------------------------------------

export const NODE_ENV: string = optionalEnv("NODE_ENV", "development");

export const IS_PRODUCTION: boolean = NODE_ENV === "production";
