#!/usr/bin/env node
/*******************************************************/
/*******************************************************/
import type { Request, Response, NextFunction } from 'express';
declare const app: any;
/**
 * Compare two secrets without leaking their contents through timing.
 *
 * `!==` on strings short-circuits at the first differing byte, which lets a
 * caller recover the expected token one character at a time. timingSafeEqual
 * requires equal-length buffers, so length is compared separately - length is
 * not secret in the way the value is.
 */
declare function secretsMatch(presented: string | undefined, expected: string | undefined): boolean;
declare function authenticate(req: Request, res: Response, next: NextFunction): void;
declare function start(): Promise<void>;
export { app, start, authenticate, secretsMatch };
//# sourceMappingURL=index_http.d.ts.map