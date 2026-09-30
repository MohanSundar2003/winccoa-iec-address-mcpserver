/**
 * Server Deployment Configuration
 *
 * Configuration for HTTP/STDIO server modes, authentication, CORS, SSL, and security.
 */
import type { ServerConfig, SslCertificates } from '../types/index.js';
export declare const serverConfig: ServerConfig;
/**
 * Helper function to load SSL certificates
 * @returns SSL certificate data or null if SSL is disabled or loading fails
 */
export declare function loadSSLConfig(): SslCertificates | null;
/**
 * Is this host a loopback address?
 *
 * Used to decide whether running without TLS is merely a development
 * convenience or an actual exposure: on a loopback bind the API token never
 * leaves the machine, on any other bind it crosses the network in clear text.
 *
 * @param host - Host or interface the server binds to
 * @returns true if traffic cannot leave the machine
 */
export declare function isLoopbackHost(host: string): boolean;
/**
 * Validate configuration.
 *
 * Returns messages rather than throwing, so the caller can report every problem
 * at once instead of one per restart.
 *
 * @returns Array of validation error messages (empty if valid)
 */
export declare function validateConfig(): string[];
//# sourceMappingURL=server.config.d.ts.map