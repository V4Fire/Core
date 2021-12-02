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

import Queue from '~/core/queue/interface';
import type { Tasks, CreateTasks } from '~/core/queue/simple/interface';

export * from '~/core/queue/interface';

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
		return this.lengthStore;
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
	 * Internal length value
	 */
	protected lengthStore: number = 0;

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
		this.lengthStore++;
		this.tasks[this.emptyCursor++] = task;

		if (this.emptyCursor === this.headCursor) {
			this.emptyCursor = this.lengthStore;
		}

		return this.length;
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		if (this.length === 0) {
			return;
		}

		const {head} = this;
		this.lengthStore--;

		if (this.length === 0) {
			this.headCursor = 0;
			this.emptyCursor = 0;

		} else {
			if (this.emptyCursor > this.headCursor) {
				this.emptyCursor = this.headCursor;
			}

			this.headCursor++;
		}

		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.tasks = this.createTasks();
			this.lengthStore = 0;
			this.emptyCursor = 0;
			this.headCursor = 0;
		}
	}

	/**
	 * Returns a new blank list of tasks
	 */
	protected createTasks: CreateTasks<this['Tasks']> = () => [];
}
