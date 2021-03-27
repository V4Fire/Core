/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';
import type { Options, PersistentOptions } from 'core/log/middlewares/configurable/interface';
import { DEFAULT_OPTIONS } from 'core/log/middlewares/configurable/const';

let
	logOps: CanUndef<Options>;

/**
 * Returns current options of configurable middleware
 */
export function get(): CanUndef<Options> {
	return logOps;
}

/**
 * Sets passed options of configurable middleware if they are valid
 * @param opts
 */
export function set(opts: unknown): void {
	let po: PersistentOptions;

	if (isValidOptions(opts)) {
		po = {
			...DEFAULT_OPTIONS,
			...opts
		};

	} else {
		po = {
			...DEFAULT_OPTIONS
		};
	}

	logOps = {
		patterns: po.patterns.map((pattern) => new RegExp(pattern))
	};
}

/**
 * Inits a configurable middleware with data from a storage and subscribes for its changes
 */
export function subscribe(): void {
	env.get('log').then(set, set);
	env.emitter.on('set.log', set);
	env.emitter.on('remove.log', set);
}

/**
 * Unsubscribes from a storage changes
 */
export function unsubscribe(): void {
	env.emitter.off('set.log', set);
	env.emitter.off('remove.log', set);
}

/**
 * Returns `true` if passed options have correct format
 * @param opts
 */
function isValidOptions(opts: unknown): opts is CanUndef<PersistentOptions> {
	if (opts != null) {
		if (
			!Object.isPlainObject(opts) ||
			!Object.isArray(opts.patterns) ||
			opts.patterns.some((p) => !Object.isString(p))
		) {
			console.error('Incorrect format of log options: should be "{patterns: string[]}"');
			return false;
		}
	}

	return true;
}
