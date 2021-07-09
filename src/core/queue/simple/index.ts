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

import Queue from 'core/queue/interface';
import type { Tasks, CreateTasks } from 'core/queue/simple/interface';

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
		return this.tasks[this.headCursor];
	}

	/** @inheritDoc */
	get length(): number {
		const {
			headCursor,
			emptyCursor,
			tasks: {length}
		} = this;

		console.log(headCursor, emptyCursor, length);

		if (emptyCursor === length) {
			console.log('r1', headCursor === length ? 0 : length);
			return headCursor === length ? 0 : length;
		}

		if (headCursor > emptyCursor) {
			console.log('r2', length - emptyCursor - 1);
			return length - emptyCursor - 1;
		}

		console.log('r3', length - emptyCursor + headCursor);
		return length - emptyCursor + headCursor + 1;
	}

	/**
	 * Index of the head
	 */
	protected headCursor: number = 0;

	/**
	 * Index of the nearest empty cell
	 */
	protected emptyCursor: number = 0;

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
		this.tasks[this.emptyCursor++] = task;

		if (this.emptyCursor === this.headCursor) {
			this.emptyCursor = this.tasks.length;
		}

		return this.length;
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		const
			{head} = this;

		this.tasks[this.headCursor] = undefined;

		this.emptyCursor = this.headCursor;
		this.headCursor++;

		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.tasks = this.createTasks();
			this.emptyCursor = 0;
			this.headCursor = 0;
		}
	}

	/**
	 * Returns a new blank list of tasks
	 */
	protected createTasks: CreateTasks<this['Tasks']> = () => [];
}
