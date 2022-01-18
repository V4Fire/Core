/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createControllablePromise } from 'core/request/utils';
import { hookNames } from 'core/request/stream-controller/const';

import type { ControllablePromise } from 'core/request/interface';
import type { ItemContainer } from 'core/request/stream-controller/interface';

export * from 'core/request/stream-controller/const';
export * from 'core/request/stream-controller/interface';

export default abstract class StreamController<T = unknown, P extends ItemContainer<T> = ItemContainer<T>> {
	/**
	 * Buffer that holds all set items
	 */
	protected readonly buffer: P;

	/**
	 * Current pending promise that resolves when a new item is added or the stream is closed,
	 * or rejects when the stream is destroyed
	 */
	protected pendingPromise: ControllablePromise<T> | null;

	/**
	 * Container that holds all hooks
	 */
	protected hooks: Map<string, Array<(...args: any[]) => any>>;

	/**
	 * True, if the [Symbol.asyncIterator] is called
	 */
	protected asyncIteratorInvoked: boolean;

	/**
	 * Returns a boolean stating whether the stream is open
	 */
	get open(): boolean {
		return this.pendingPromise != null;
	}

	/**
	 * @param [init] - iterable object contains initial items
	 */
	constructor(init?: Iterable<T>) {
		this.asyncIteratorInvoked = false;
		this.hooks = new Map();
		this.pendingPromise = createControllablePromise();

		this.buffer = this.createBuffer(init);
	}

	/**
	 * Adds provided item to the stream if the stream is open otherwise it does nothing
	 *
	 * @param item - item to add
	 */
	add(item: T): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.buffer.push(item);
		this.pendingPromise.resolveNow(item);
		this.pendingPromise = createControllablePromise();
	}

	/**
	 * Closes the stream
	 */
	close(): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.pendingPromise.resolveNow();
		this.pendingPromise = null;
	}

	/**
	 * Destroys the stream
	 *
	 * @param [reason] - reason of destroying the stream
	 */
	destroy<R = unknown>(reason?: R): void {
		if (this.pendingPromise == null) {
			return;
		}

		if (this.asyncIteratorInvoked) {
			this.pendingPromise.rejectNow(reason ?? Error('Stream was destroyed'));
		} else {
			this.pendingPromise.resolveNow();
		}

		this.pendingPromise = null;
	}

	/**
	 * Adds new hook
	 *
	 * @param hookName - name of hook to add
	 * @param hookExecutor
	 */
	addHook(hookName: typeof hookNames[keyof typeof hookNames], hookExecutor: () => any): void {
		let
			hooks = this.hooks.get(hookName);

		if (hooks == null) {
			this.hooks.set(hookName, hooks = []);
		}

		hooks.push(hookExecutor);
	}

	/**
	 * Returns an async iterator allowing to go through the stream
	 */
	async*[Symbol.asyncIterator](): AsyncGenerator<T> {
		const
			hooks = this.hooks.get(hookNames.ASYNC_ITERATOR) ?? [];

		for (const hook of hooks) {
			await Promise.resolve(hook(this));
		}

		this.asyncIteratorInvoked = true;

		const
			iter = this[Symbol.iterator]();

		while (true) {
			const
				{done, value} = iter.next();

			if (!done) {
				yield value;
				continue;
			}

			if (this.pendingPromise == null) {
				return;
			}

			await this.pendingPromise;
		}
	}

	/**
	 * Returns an iterator allowing to go through buffer
	 * That is extendable iterator, that can yield {done: true} after {done: false} if there are new not read items
	 */
	abstract [Symbol.iterator](): Iterator<T>;

	/**
	 * Creates buffer container
	 *
	 * @param [init]
	 */
	protected abstract createBuffer(init?: Iterable<T>): P;
}
