/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Super, { AsyncCbOptions, ClearOptionsId } from 'core/async/proxy';

import { PrimitiveNamespaces } from 'core/async/const';

import type { TimerId } from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * A wrapper for `globalThis.setImmediate`
	 *
	 * @param cb - the callback function
	 * @param [opts] - additional options for the operation
	 */
	setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		return this.registerTask({
			...opts,

			task: cb,
			namespace: PrimitiveNamespaces.immediate,

			clearFn: clearImmediate,
			wrapper: setImmediate,

			linkByWrapper: true
		});
	}

	/**
	 * A wrapper for `globalThis.clearImmediate`
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	clearImmediate(id?: TimerId): this;

	/**
	 * Clears the specified `setImmediate` timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearImmediate(opts: ClearOptionsId<TimerId>): this;
	clearImmediate(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, PrimitiveNamespaces.immediate);
	}

	/**
	 * Mutes the specified `setImmediate` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	muteImmediate(id?: TimerId): this;

	/**
	 * Mutes the specified `setImmediate` timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteImmediate(opts: ClearOptionsId<TimerId>): this;
	muteImmediate(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('muted', task, PrimitiveNamespaces.immediate);
	}

	/**
	 * Unmutes the specified `setImmediate` timer
	 * @param [id] - the operation identifier (if not defined will be got all handlers)
	 */
	unmuteImmediate(id?: TimerId): this;

	/**
	 * Unmutes the specified `setImmediate` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteImmediate(opts: ClearOptionsId<TimerId>): this;
	unmuteImmediate(p?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', p, PrimitiveNamespaces.immediate);
	}

	/**
	 * Suspends the specified `setImmediate` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendImmediate(id?: TimerId): this;

	/**
	 * Suspends the specified `setImmediate` timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendImmediate(opts: ClearOptionsId<TimerId>): this;
	suspendImmediate(p?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', p, PrimitiveNamespaces.immediate);
	}

	/**
	 * Unsuspends the specified `setImmediate` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendImmediate(id?: TimerId): this;

	/**
	 * Unsuspends the specified `setImmediate` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendImmediate(opts: ClearOptionsId<TimerId>): this;
	unsuspendImmediate(p?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', p, PrimitiveNamespaces.immediate);
	}

	/**
	 * A wrapper for `globalThis.setInterval`
	 *
	 * @param cb - the callback function
	 * @param timeout - the timer value
	 * @param [opts] - additional options for the operation
	 */
	setInterval(cb: Function, timeout: number, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		return this.registerTask({
			...opts,

			task: cb,
			namespace: PrimitiveNamespaces.interval,

			clearFn: clearInterval,
			wrapper: setInterval,

			periodic: true,
			linkByWrapper: true,

			args: [timeout]
		});
	}

	/**
	 * A wrapper for `globalThis.clearInterval`
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	clearInterval(id?: TimerId): this;

	/**
	 * Clears the specified `setInterval` timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearInterval(opts: ClearOptionsId<TimerId>): this;
	clearInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, PrimitiveNamespaces.interval);
	}

	/**
	 * Mutes the specified `setInterval` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	muteInterval(id?: TimerId): this;

	/**
	 * Mutes the specified `setInterval` timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteInterval(opts: ClearOptionsId<TimerId>): this;
	muteInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('muted', task, PrimitiveNamespaces.interval);
	}

	/**
	 * Unmutes the specified `setInterval` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unmuteInterval(id?: TimerId): this;

	/**
	 * Unmutes the specified `setInterval` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteInterval(opts: ClearOptionsId<TimerId>): this;
	unmuteInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', task, PrimitiveNamespaces.interval);
	}

	/**
	 * Suspends the specified `setInterval` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendInterval(id?: TimerId): this;

	/**
	 * Suspends the specified `setInterval` timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendInterval(opts: ClearOptionsId<TimerId>): this;
	suspendInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', task, PrimitiveNamespaces.interval);
	}

	/**
	 * Unsuspends the specified `setImmediate` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendInterval(id?: TimerId): this;

	/**
	 * Unsuspends the specified `setImmediate` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendInterval(opts: ClearOptionsId<TimerId>): this;
	unsuspendInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', task, PrimitiveNamespaces.interval);
	}

	/**
	 * A wrapper for `globalThis.setTimeout`
	 *
	 * @param cb - the callback function
	 * @param timeout - the timeout value
	 * @param [opts] - additional options for the operation
	 */
	setTimeout(cb: Function, timeout: number, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		return this.registerTask({
			...opts,

			task: cb,
			namespace: PrimitiveNamespaces.timeout,

			clearFn: clearTimeout,
			wrapper: setTimeout,

			linkByWrapper: true,
			args: [timeout]
		});
	}

	/**
	 * A wrapper for `globalThis.clearTimeout`
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	clearTimeout(id?: TimerId): this;

	/**
	 * Clears the specified `setTimeout` timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearTimeout(opts: ClearOptionsId<TimerId>): this;
	clearTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, PrimitiveNamespaces.timeout);
	}

	/**
	 * Mutes the specified `setTimeout` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	muteTimeout(id?: TimerId): this;

	/**
	 * Mutes the specified `setTimeout` timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteTimeout(opts: ClearOptionsId<TimerId>): this;
	muteTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('muted', task, PrimitiveNamespaces.timeout);
	}

	/**
	 * Unmutes the specified `setTimeout` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unmuteTimeout(id?: TimerId): this;

	/**
	 * Unmutes the specified `setTimeout` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteTimeout(opts: ClearOptionsId<TimerId>): this;
	unmuteTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', task, PrimitiveNamespaces.timeout);
	}

	/**
	 * Suspends the specified `setTimeout` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendTimeout(id?: TimerId): this;

	/**
	 * Suspends the specified `setTimeout` timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendTimeout(opts: ClearOptionsId<TimerId>): this;
	suspendTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', task, PrimitiveNamespaces.timeout);
	}

	/**
	 * Unsuspends the specified `setTimeout` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendTimeout(id?: TimerId): this;

	/**
	 * Unsuspends the specified `setTimeout` timer or a group of names
	 * @param opts - options for the operation
	 */
	unsuspendTimeout(opts: ClearOptionsId<TimerId>): this;
	unsuspendTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', task, PrimitiveNamespaces.timeout);
	}
}
