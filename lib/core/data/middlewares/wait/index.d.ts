/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export * from '../../../../core/data/middlewares/attach-status/interface';
/**
 * Middleware: if the request has some parameter to wait,
 * then the middleware won't be resolved until this parameter isn't resolved.
 *
 * This middleware can be used as encoder: the value to wait will be taken from input data (`.wait`),
 * otherwise, it will be taken from `.meta.wait`.
 */
export declare function wait(...args: unknown[]): Promise<unknown>;
