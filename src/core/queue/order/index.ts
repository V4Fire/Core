/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/order/README.md]]
 * @packageDocumentation
 */

import Queue from 'core/queue/interface';
import type { InnerQueue, CreateInnerQueue, ElsComparator } from 'core/queue/order/interface';

export * from 'core/queue/order/interface';

/**
 * Implementation of an ordered queue data structure based on a binary heap
 * @typeparam T - the queue element
 */
export default class OrderedQueue<T> extends Queue<T> {
	/**
	 * Type: the internal queue to store elements
	 */
	readonly InnerQueue!: InnerQueue<T>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		return this.innerQueue[0];
	}

	/** @inheritDoc */
	get length(): number {
		return this.lastIndex + 1;
	}

	/**
	 * An index of the last element from the queue
	 */
	protected lastIndex: number = -1;

	/**
	 * The internal queue to store elements
	 */
	protected innerQueue: this['InnerQueue'];

	/**
	 * A function to compare tasks
	 */
	protected comparator: ElsComparator<T>;

	/**
	 * @param comparator - a function to compare tasks
	 */
	constructor(comparator: ElsComparator<T>) {
		super();
		this.innerQueue = this.createInnerQueue();
		this.comparator = comparator;
	}

	/** @inheritDoc */
	push(task: T): number {
		this.innerQueue[++this.lastIndex] = task;
		this.fromBottom();
		return this.length;
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		const
			{head} = this;

		if (this.lastIndex > 0) {
			this.innerQueue[0] = this.innerQueue[this.lastIndex];
			this.lastIndex--;
			this.toBottom();

		} else {
			this.lastIndex = this.lastIndex === 1 ? 0 : -1;
		}

		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.innerQueue = this.createInnerQueue();
			this.lastIndex = -1;
		}
	}

	/** @inheritDoc */
	clone(): OrderedQueue<T> {
		const newQueue = new OrderedQueue<T>(this.comparator);
		newQueue.lastIndex = this.lastIndex;

		for (const el of this.innerQueue) {
			newQueue.innerQueue.push(el);
		}

		return newQueue;
	}

	/**
	 * Returns a new blank internal queue to store elements
	 */
	protected createInnerQueue: CreateInnerQueue<this['InnerQueue']> = () => [];

	/**
	 * Pushes the last queue element to the top
	 */
	protected fromBottom(): void {
		let
			pos = this.lastIndex,
			parent = Math.floor((pos - 1) / 2);

		const
			val = this.innerQueue[pos];

		while (pos !== 0) {
			const
				parentVal = this.innerQueue[parent];

			if (this.comparator(val, parentVal) <= 0) {
				break;
			}

			this.innerQueue[pos] = parentVal;
			pos = parent;
			parent = Math.floor((pos - 1) / 2);
		}

		this.innerQueue[pos] = val;
	}

	/**
	 * Pushes the first queue element down
	 */
	protected toBottom(): void {
		let
			pos = 0,
			child1 = 1,
			child2 = 2;

		const
			val = this.innerQueue[pos];

		while (child1 <= this.lastIndex) {
			let
				child;

			if (child2 <= this.lastIndex) {
				child = this.comparator(this.innerQueue[child1], this.innerQueue[child2]) > 0 ? child1 : child2;

			} else {
				child = child1;
			}

			const
				childVal = this.innerQueue[child];

			if (child == null || this.comparator(val, childVal) > 0) {
				break;
			}

			this.innerQueue[pos] = childVal;

			pos = child;
			child1 = pos * 2 + 1;
			child2 = pos * 2 + 2;
		}

		this.innerQueue[pos] = val;
	}
}
