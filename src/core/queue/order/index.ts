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
import type { Tasks, CreateTasks, TaskComparator } from 'core/queue/order/interface';

export * from 'core/queue/order/interface';

/**
 * Implementation of an ordered queue data structure
 * @typeparam T - queue element
 */
export default class OrderedQueue<T> extends Queue<T> {
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
		return this.lastIndex + 1;
	}

	/**
	 * Index of the last element from the queue
	 */
	protected lastIndex: number = -1;

	/**
	 * List of tasks
	 */
	protected tasks: this['Tasks'];

	/**
	 * Function to compare tasks
	 */
	protected comparator: TaskComparator<T>;

	/**
	 * @param comparator
	 */
	constructor(comparator: TaskComparator<T>) {
		super();
		this.tasks = this.createTasks();
		this.comparator = comparator;
	}

	/** @inheritDoc */
	push(task: T): number {
		this.tasks[++this.lastIndex] = task;
		this.fromBottom();
		return this.length;
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		const
			{head} = this;

		if (this.lastIndex > 0) {
			this.tasks[0] = this.tasks[this.lastIndex];
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
			this.tasks = this.createTasks();
			this.lastIndex = -1;
		}
	}

	/**
	 * Returns a new blank list of tasks
	 */
	protected createTasks: CreateTasks<this['Tasks']> = () => [];

	/**
	 * Raises the headIndex queue element of the queue up
	 */
	protected fromBottom(): void {
		let
			pos = this.lastIndex,
			parent = Math.floor((pos - 1) / 2);

		const
			val = this.tasks[pos];

		while (pos !== 0) {
			const
				parentVal = this.tasks[parent];

			if (this.comparator(val, parentVal) <= 0) {
				break;
			}

			this.tasks[pos] = parentVal;
			pos = parent;
			parent = Math.floor((pos - 1) / 2);
		}

		this.tasks[pos] = val;
	}

	/**
	 * Puts the first queue element down the queue
	 */
	protected toBottom(): void {
		let
			pos = 0,
			child1 = 1,
			child2 = 2;

		const
			val = this.tasks[pos];

		while (child1 <= this.lastIndex) {
			let
				child;

			if (child2 <= this.lastIndex) {
				child = this.comparator(this.tasks[child1], this.tasks[child2]) > 0 ? child1 : child2;

			} else {
				child = child1;
			}

			const
				childVal = this.tasks[child];

			if (child == null || this.comparator(val, childVal) > 0) {
				break;
			}

			this.tasks[pos] = childVal;

			pos = child;
			child1 = pos * 2 + 1;
			child2 = pos * 2 + 2;
		}

		this.tasks[pos] = val;
	}
}
