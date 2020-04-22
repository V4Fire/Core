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

import Queue, { Tasks, CreateTasks } from 'core/queue/interface';
export * from 'core/queue/interface';

/**
 * Simple implementation of a queue data structure
 * @typeparam T - queue element
 */
export default class SimpleQueue<T> extends Queue<T> {
	/**
	 * Type: list of tasks
	 */
	readonly Tasks!: Tasks<T>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		return this.tasks[0];
	}

	/** @inheritDoc */
	get length(): number {
		return this.tasks.length;
	}

	/**
	 * List of tasks
	 */
	protected tasks: this['Tasks'];

	/** @override */
	constructor() {
		super();
		this.tasks = this.createTasks();
	}

	/** @inheritDoc */
	push(task: T): number {
		return this.tasks.push(task);
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		const {head} = this;
		this.tasks.shift();
		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.tasks = this.createTasks();
		}
	}

	/**
	 * Returns a new blank list of tasks
	 */
	protected createTasks: CreateTasks<this['Tasks']> = () => [];
}
