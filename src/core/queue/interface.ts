/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface Tasks<T> {
	readonly length: number;
	push(task: T): number;
	unshift(task: T): number;
	pop(): CanUndef<T>;
	shift(): CanUndef<T>;
}

export interface CreateTasks<T> {
	(): T;
}

export interface QueueOptions {
	/**
	 * Factory to create a task container
	 */
	tasksFactory?: CreateTasks<any>;
}

/**
 * Abstract class for a queue data structure
 * @typeparam T - queue element
 */
export default abstract class Queue<T> {
	/**
	 * Queue head
	 */
	abstract readonly head: CanUndef<T>;

	/**
	 * Queue length
	 */
	abstract readonly length: number;

	/**
	 * Adds an element to the queue
	 * @param el
	 */
	abstract push(el: T): unknown;

	/**
	 * Removes a head element from the queue and returns it
	 */
	abstract pop(): CanUndef<T>;

	/**
	 * Alias to .push
	 * @see [[Queue.push]]
	 */
	unshift(el: T): ReturnType<this['push']> {
		return <any>this.push(el);
	}

	/**
	 * Alias to .pop
	 * @see [[Queue.pop]]
	 */
	shift(): ReturnType<this['pop']> {
		return <any>this.pop();
	}

	/**
	 * Clears the queue
	 */
	abstract clear(): void;
}
