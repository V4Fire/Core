/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/modules/stream-buffer/README.md]]
 * @packageDocumentation
 */

import { createControllablePromise } from 'core/promise';
import type { ControllablePromise } from 'core/request/modules/stream-buffer/interface';

export default class StreamBuffer<T = unknown> {
	/**
	 * Returns a boolean stating whether the stream is open or not
	 */
	get isOpened(): boolean {
		return this.pendingPromise != null;
	}

	/**
	 * Buffer of added values
	 */
	protected buffer: T[];

	/**
	 * Current pending promise that resolves when a new value is added
	 */
	protected pendingPromise: Nullable<ControllablePromise<T>>;

	/**
	 * True, if an asynchronous iterator from `Symbol.asyncIterator` was called
	 */
	protected isAsyncIteratorInvoked: boolean;

	/**
	 * @param [values] - values to add
	 */
	constructor(values: Iterable<T> = []) {
		this.buffer = [...values];
		this.isAsyncIteratorInvoked = false;
		this.pendingPromise = createControllablePromise<T>();
	}

	/**
	 * Returns an iterator allowing to go through all items that were already added
	 */
	[Symbol.iterator](): IterableIterator<T> {
		return this.buffer.values();
	}

	/**
	 * Returns an asynchronous iterator allowing to go through the stream
	 */
	[Symbol.asyncIterator](): AsyncIterableIterator<T> {
		const
			that = this,
			iter = createIter();

		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			next: iter.next.bind(iter)
		};

		async function* createIter() {
			that.isAsyncIteratorInvoked = true;

			const
				{buffer} = that;

			while (true) {
				if (buffer.length > 0) {
					yield buffer.shift();
					continue;
				}

				if (that.pendingPromise == null) {
					return;
				}

				await that.pendingPromise;
			}
		}
	}

	/**
	 * Adds a new value to the stream if it is opened, otherwise does nothing
	 * @param value - item to add
	 */
	add(value: T): void {
		if (!this.isOpened) {
			return;
		}

		this.buffer.push(value);
		this.pendingPromise!.resolve();
		this.pendingPromise = createControllablePromise<T>();
	}

	/**
	 * Closes the stream
	 */
	close(): void {
		if (!this.isOpened) {
			return;
		}

		this.pendingPromise!.resolve();
		this.pendingPromise = null;
	}

	/**
	 * Destroys the stream
	 * @param [reason] - reason to destroy
	 */
	destroy<R = unknown>(reason?: R): void {
		if (!this.isOpened) {
			return;
		}

		if (this.isAsyncIteratorInvoked) {
			this.pendingPromise!.reject(reason ?? Error('The stream has been destroyed'));

		} else {
			this.pendingPromise!.resolve();
		}

		this.pendingPromise = null;
	}
}
