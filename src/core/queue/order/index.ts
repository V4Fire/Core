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

export * from 'core/queue/interface';
export * from 'core/queue/order/interface';

/**
 * Implementation of an ordered queue data structure
 * @typeparam T - queue element
 */
export default class OrderedQueue<T> extends Queue<T> {
	/**
	 * Type: list of tasks
	 */
	readonly Tasks!: Tasks<CanUndef<T>>;

	/** @inheritDoc */
	get head(): CanUndef<T> {
		return this.tasks[0];
	}

	/** @inheritDoc */
	get length(): number {
		return this.last + 1;
	}

	/**
	 * Pointer to the last element from the queue
	 */
	protected last: number = -1;

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
		this.tasks[++this.last] = task;
		this.fromBottom();
		return this.length;
	}

	/** @inheritDoc */
	pop(): CanUndef<T> {
		const
			{head} = this;

		if (this.last > 0) {
			this.tasks[0] = this.tasks[this.last];
			this.tasks[this.last--] = undefined;
			this.toBottom();

		} else {
			this.last = this.last === 1 ? 0 : -1;
			this.tasks[0] = undefined;
		}

		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.tasks = this.createTasks();
			this.last = -1;
		}
	}

	/**
	 * Returns a new blank list of tasks
	 */
	protected createTasks: CreateTasks<this['Tasks']> = () => [];

	/**
	 * Raises the last queue element of the queue up
	 */
	protected fromBottom(): void {
		let
			pos = this.last,
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

		while (child1 <= this.last) {
			let
				child;

			if (child2 <= this.last) {
				child = this.comparator(this.tasks[child1]!, this.tasks[child2]!) > 0 ? child1 : child2;

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
