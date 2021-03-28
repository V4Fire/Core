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
 * @param [opts]
 */
export function set(opts?: unknown): void {
	const updateOpts = (opts: PersistentOptions) => {
		logOps = {
			patterns: opts.patterns.map((pattern) => new RegExp(pattern))
		};
	};

	if (isValidOptions(opts)) {
		const po = {
			...DEFAULT_OPTIONS,
			...opts
		};

		updateOpts(po);

	} else {
		if (!logOps) {
			const po = {
				...DEFAULT_OPTIONS
			};

			updateOpts(po);
		}

		throw new Error('Incorrect format of log options: should be "{patterns: string[]}"');
	}
}

/**
 * Reverts options ot its initial state - undefined
 */
export function clear(): void {
	logOps = undefined;
}

/**
 * Inits a configurable middleware with data from options storage
 */
export function init(): Promise<void> {
	return env.get('log').then(set, (_) => set());
}

/**
 * Subscribes for options storage changes
 */
export function subscribe(): void {
	env.emitter.on('set.log', set);
	env.emitter.on('remove.log', set);
}

/**
 * Returns `true` if passed options have correct format
 * @param [opts]
 */
function isValidOptions(opts?: unknown): opts is CanUndef<PersistentOptions> {
	if (opts != null) {
		if (
			!Object.isPlainObject(opts) ||
			!Object.isArray(opts.patterns) ||
			opts.patterns.some((p) => !Object.isString(p))
		) {
			return false;
		}
	}

	return true;
}
