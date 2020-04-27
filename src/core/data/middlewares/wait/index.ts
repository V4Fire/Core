/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/middlewares/wait/README.md]]
 * @packageDocumentation
 */

import { MiddlewareParams } from 'core/request';
export * from 'core/data/middlewares/attach-status/interface';

/**
 * Middleware: if the request has some parameter to wait,
 * then the middleware won't be resolved until this parameter isn't resolved.
 *
 * This middleware can be used as encoder: the value to wait will be taken from input data (`.wait`),
 * otherwise, it will be taken from `.meta.wait`.
 */
export async function wait(...args: unknown[]): Promise<void> {
	let
		wait;

	const
		fst = args[0];

	if (args.length === 1) {
		wait = (<CanUndef<MiddlewareParams>>fst)?.opts.meta?.wait;

	} else if (Object.isDictionary(fst)) {
		wait = fst.wait;

		if (wait !== undefined) {
			delete fst.wait;
		}
	}

	if (wait !== undefined) {
		await (Object.isFunction(wait) ? wait(...args) : wait);
	}
}
