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

import Queue, { Tasks, CreateTasks } from 'core/queue/interface';
import { HashFn } from 'core/queue/merge/interface';

export * from 'core/queue/merge/interface';

/**
 * Implementation of a queue data structure with support of task merging by the specified hash function
 * @typeparam T - queue element
 */
export default class MergeQueue<T> extends Queue<T> {
	/**
	 * Type: list of tasks
	 */
	readonly Tasks!: Tasks<string>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		return this.tasksMap[this.tasks[0]];
	}

	/** @inheritDoc */
	get length(): number {
		return this.tasks.length;
	}

	/**
	 * List of tasks
	 */
	protected tasks: this['Tasks'];

	/**
	 * The map of registered tasks
	 */
	protected tasksMap: Dictionary<T> = Object.createDict();

	/**
	 * The task hash function
	 */
	protected readonly hashFn: HashFn<T>;

	/**
	 * @override
	 * @param [hashFn]
	 */
	constructor(hashFn?: HashFn<T>) {
		super();
		this.tasks = this.createTasks();
		this.hashFn = hashFn ?? Object.fastHash.bind(Object);
	}

	/** @inheritDoc */
	push(task: T): number {
		const
			hash = this.hashFn(task);

		if (this.tasksMap[hash] == null) {
			this.tasksMap[hash] = task;
			this.tasks.push(hash);
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

		delete this.tasksMap[this.tasks[0]];
		this.tasks.shift();

		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.tasks = this.createTasks();
			this.tasksMap = Object.createDict();
		}
	}

	/**
	 * Returns a new blank list of tasks
	 */
	protected createTasks: CreateTasks<this['Tasks']> = () => [];
}
