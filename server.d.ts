/**
 * MCP Server Initialization
 *
 * Initializes the MCP server with WinCC OA manager, resources, and tools.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ServerContext } from "./types/index.js";
/**
 * Build the process-wide context: the WinCC OA manager plus the instruction
 * content. Memoised, so repeated calls are free and only one WinccoaManager is
 * ever constructed.
 *
 * A failure is not cached - the next call retries - so a transient file read
 * error cannot poison the process.
 *
 * @returns The shared server context
 */
export declare function initContext(): Promise<ServerContext>;
/**
 * Create a fresh, disposable McpServer bound to the given context.
 *
 * The HTTP transport must call this once per request. The MCP SDK's Protocol
 * supports a single transport per instance, and sharing one instance across
 * clients is the subject of a HIGH advisory against @modelcontextprotocol/sdk
 * ("cross-client data leak via shared server/transport instance reuse", the
 * same defect as GitHub issue #33). This is cheap - a few milliseconds - since
 * tool modules are import-cached and the zod-to-JSON-Schema conversion happens
 * per tools/list call regardless.
 *
 * @param context - Shared process-wide context from initContext()
 * @returns A new MCP server with resources and tools registered
 */
export declare function createServer(context: ServerContext): Promise<McpServer>;
/**
 * Initialize context and create a server in one step.
 *
 * Retained for the stdio transport, which is single-client and long-lived, so
 * one server instance for the process lifetime is correct there.
 *
 * @returns Configured MCP server
 */
export declare function initializeServer(): Promise<McpServer>;
/**
 * Get the shared context (for testing or debugging).
 *
 * Now async: it previously returned `winccoa!`, which was a hard null until
 * initializeServer() had run.
 *
 * @returns Current server context
 */
export declare function getContext(): Promise<ServerContext>;
//# sourceMappingURL=server.d.ts.map