/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/merge/README.md]]
 *
 * @packageDocumentation
 */

import SimpleQueue from 'core/queue/simple';
import AbstractQueue from 'core/queue/interface';

import type { HashFn, InnerQueue, CreateInnerQueue } from 'core/queue/merge/interface';

export * from 'core/queue/merge/interface';

/**
 * Implementation of a queue data structure with support of task merging by a specified hash function
 *
 * @typeParam T - the queue element
 */
export default class MergeQueue<T> extends AbstractQueue<T> {
	/**
	 * Type: the internal queue to store elements
	 */
	readonly InnerQueue!: InnerQueue<string>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		if (this.length === 0) {
			return undefined;
		}

		return this.tasksMap.get(this.innerQueue.head!);
	}

	/** @inheritDoc */
	get length(): number {
		return this.innerQueue.length;
	}

	/**
	 * The internal queue to store elements
	 */
	protected innerQueue: this['InnerQueue'];

	/**
	 * A map of registered tasks
	 */
	protected tasksMap: Map<string, T> = new Map();

	/**
	 * A function to calculate task hashes
	 */
	protected readonly hashFn: HashFn<T>;

	/**
	 * @override
	 * @param [hashFn] - a function to calculate task hashes
	 */
	constructor(hashFn?: HashFn<T>) {
		super();
		this.innerQueue = this.createInnerQueue();
		this.hashFn = hashFn ?? Object.fastHash.bind(Object);
	}

	/** @inheritDoc */
	push(task: T): number {
		const
			hash = this.hashFn(task);

		if (!this.tasksMap.has(hash)) {
			this.tasksMap.set(hash, task);
			this.innerQueue.push(hash);
		}

		return this.length;
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		if (this.length === 0) {
			return;
		}

		const
			{head} = this;

		this.tasksMap.delete(this.innerQueue.head!);
		this.innerQueue.shift();

		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.innerQueue = this.createInnerQueue();
			this.tasksMap = new Map();
		}
	}

	/** @inheritDoc */
	clone(): MergeQueue<T> {
		const newQueue = new MergeQueue<T>(this.hashFn);
		newQueue.tasksMap = new Map(this.tasksMap);

		if (this.innerQueue.clone != null) {
			newQueue.innerQueue = this.innerQueue.clone();

		} else {
			for (const el of this.innerQueue) {
				newQueue.innerQueue.push(el);
			}
		}

		return newQueue;
	}

	/**
	 * Returns a new blank internal queue to store elements
	 */
	protected createInnerQueue: CreateInnerQueue<this['InnerQueue']> = () => new SimpleQueue();
}
