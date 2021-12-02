/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/merge/README.md]]
 * @packageDocumentation
 */

import SimpleQueue from '@src/core/queue/simple';
import AbstractQueue from '@src/core/queue/interface';

import type { HashFn, InnerQueue, CreateInnerQueue } from '@src/core/queue/merge/interface';

export * from '@src/core/queue/merge/interface';

/**
 * Implementation of a queue data structure with support of task merging by the specified hash function
 * @typeparam T - queue element
 */
export default class MergeQueue<T> extends AbstractQueue<T> {
	/**
	 * Type: inner queue to store elements
	 */
	readonly InnerQueue!: InnerQueue<string>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		if (this.length === 0) {
			return undefined;
		}

		return this.tasksMap[this.innerQueue.head!];
	}

	/** @inheritDoc */
	get length(): number {
		return this.innerQueue.length;
	}

	/**
	 * Inner queue to store elements
	 */
	protected innerQueue: this['InnerQueue'];

	/**
	 * The map of registered tasks
	 */
	protected tasksMap: Dictionary<T> = Object.createDict();

	/**
	 * Function to calculate a task hash
	 */
	protected readonly hashFn: HashFn<T>;

	/**
	 * @override
	 * @param [hashFn]
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

		if (this.tasksMap[hash] == null) {
			this.tasksMap[hash] = task;
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

		delete this.tasksMap[this.innerQueue.head!];
		this.innerQueue.shift();

		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.innerQueue = this.createInnerQueue();
			this.tasksMap = Object.createDict();
		}
	}

	/**
	 * Returns a new blank inner queue to store elements
	 */
	protected createInnerQueue: CreateInnerQueue<this['InnerQueue']> = () => new SimpleQueue();
}
