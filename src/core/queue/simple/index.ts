/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/simple/README.md]]
 *
 * @packageDocumentation
 */

import LinkedList from 'core/linked-list';

import Queue from 'core/queue/interface';
import type { CreateInnerQueue } from 'core/queue/simple/interface';

export * from 'core/queue/interface';

/**
 * Implementation of a queue data structure based on a linked-list
 *
 * @typeParam T - the queue element
 */
export default class SimpleQueue<T> extends Queue<T> {
	/**
	 * Type: the internal queue to store elements
	 */
	readonly InnerQueue!: LinkedList<T>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		return this.innerQueue.first;
	}

	/** @inheritDoc */
	get length(): number {
		return this.innerQueue.length;
	}

	/**
	 * The internal queue to store elements
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
			this.innerQueue.clear();
		}
	}

	/** @inheritDoc */
	clone(): SimpleQueue<T> {
		const newQueue = new SimpleQueue<T>();
		newQueue.innerQueue = this.innerQueue.slice();
		return newQueue;
	}

	override values(): IterableIterator<T> {
		return this.innerQueue.values();
	}

	/**
	 * Returns a new blank internal queue to store elements
	 */
	protected createInnerQueue: CreateInnerQueue<this['InnerQueue']> = () => new LinkedList<T>();
}
