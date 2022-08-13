/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/simple/README.md]]
 * @packageDocumentation
 */

import Queue, { InnerQueue } from 'core/queue/interface';
import type { CreateInnerQueue } from 'core/queue/simple/interface';
import LinkedList from 'core/linked-list';

export * from 'core/queue/interface';

/**
 * Simple implementation of a queue data structure
 * @typeparam T - queue element
 */
export default class SimpleQueue<T> extends Queue<T> {
	/**
	 * Type: inner queue to store elements
	 */
	readonly InnerQueue!: InnerQueue<T>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		return this.innerQueue.first;
	}

	/** @inheritDoc */
	get length(): number {
		return this.innerQueue.length;
	}

	/**
	 * Inner queue to store elements
	 */
	protected innerQueue: this['InnerQueue'];

	/** @override */
	constructor() {
		super();
		this.innerQueue = this.createInnerQueue();
	}

	/** @inheritDoc */
	push(task: T): number {
		this.innerQueue.push(task);

		return this.length;
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		return this.innerQueue.shift();
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.innerQueue.clear?.();
		}
	}

	/** @inheritDoc */
	clone(): SimpleQueue<T> {
		const
			newQueue = new SimpleQueue<T>();

		if (this.innerQueue.clone != null) {
			newQueue.innerQueue = this.innerQueue.clone();

		} else {
			for (const el of this.innerQueue) {
				newQueue.push(el);
			}
		}

		return newQueue;
	}

	/** @inheritDoc */
	[Symbol.iterator](): IterableIterator<T> {
		return this.innerQueue[Symbol.iterator]();
	}

	/**
	 * Returns a new blank inner queue to store elements
	 */
	protected createInnerQueue: CreateInnerQueue<this['InnerQueue']> = () => new LinkedList<T>();
}
