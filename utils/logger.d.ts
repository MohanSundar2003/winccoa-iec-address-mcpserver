/**
 * Minimal level-based logger.
 *
 * The HTTP server previously logged a running commentary on every request,
 * including request headers and the first 8 characters of both the presented and
 * the expected API token. Anything reaching a WinCC OA manager log is readable by
 * anyone with log access, so token material must never be written there, and the
 * per-request commentary belongs behind a level.
 *
 * Controlled by MCP_LOG_LEVEL: debug | info | warn | error (default: info).
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
/** Verbose per-request tracing. Off unless MCP_LOG_LEVEL=debug. */
export declare function debug(...args: unknown[]): void;
/** Normal operational messages: startup, listening, tool registration. */
export declare function info(...args: unknown[]): void;
export declare function warn(...args: unknown[]): void;
export declare function error(...args: unknown[]): void;
/**
 * Describe a secret without disclosing any of it.
 *
 * Use this instead of `token.substring(0, 8)`: a prefix is still secret material,
 * and for a short or low-entropy token it can be most of it.
 *
 * @param secret - The value to describe
 * @returns "set (N chars)" or "not set"
 */
export declare function describeSecret(secret: string | undefined | null): string;
//# sourceMappingURL=logger.d.ts.map