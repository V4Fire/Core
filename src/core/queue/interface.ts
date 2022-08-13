/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface InnerQueue<T = unknown> {
	readonly length: number;
	readonly head?: CanUndef<T>;
	readonly first?: CanUndef<T>;
	push(task: T): number;
	unshift(task: T): number;
	pop(): CanUndef<T>;
	shift(): CanUndef<T>;
	clear?(): void;
	clone?(): InnerQueue<T>;
	[Symbol.iterator](): IterableIterator<T>;
}

export interface CreateInnerQueue<T extends InnerQueue<any> = InnerQueue> {
	(): T;
}

export interface QueueOptions<T extends InnerQueue<any> = InnerQueue> {
	/**
	 * Factory to create an inner queue to store elements
	 */
	queueFactory?: CreateInnerQueue<T>;
}

/**
 * Abstract class for a queue data structure
 * @typeparam T - queue element
 */
export default abstract class Queue<T> {
	/**
	 * Queue head
	 */
	abstract readonly head: CanUndef<T>;

	/**
	 * Queue length
	 */
	abstract readonly length: number;

	/**
	 * Adds an element to the queue
	 * @param el
	 */
	abstract push(el: T): unknown;

	/**
	 * Removes a head element from the queue and returns it
	 */
	abstract pop(): CanUndef<T>;

	/**
	 * Alias to `push`
	 * @see [[Queue.push]]
	 */
	unshift(el: T): ReturnType<this['push']> {
		return Object.cast(this.push(el));
	}

	/**
	 * Alias to `pop`
	 * @see [[Queue.pop]]
	 */
	shift(): ReturnType<this['pop']> {
		return Object.cast(this.pop());
	}

	/**
	 * Clears the queue
	 */
	abstract clear(): void;

	/**
	 * Clones the queue
	 */
	abstract clone(): Queue<T>;

	/**
	 * Returns iterator
	 */
	[Symbol.iterator](): IterableIterator<T> {
		const
			clonedQueue = this.clone();

		return {
			[Symbol.iterator]() {
				return this;
			},

			next(): IteratorResult<T> {
				const
					done = clonedQueue.length <= 0,
					value = clonedQueue.pop();

				if (done || value == null) {
					return {done: true, value: undefined};
				}

				return {done, value};
			}
		};
	}

	/**
	 * Returns async iterator
	 */
	[Symbol.asyncIterator](): AsyncIterableIterator<T> {
		const
			clonedQueue = this.clone();

		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			next(): Promise<IteratorResult<T>> {
				return new Promise((resolve) => {
					const
						done = clonedQueue.length <= 0,
						value = clonedQueue.pop();

					if (done || value == null) {
						return resolve({done: true, value: undefined});
					}

					return resolve({done, value});
				});
			}
		};
	}
}
