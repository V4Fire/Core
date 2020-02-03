/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/** @deprecated */
export { default } from 'core/queue/worker';

/**
 * Base interface for a queue data structure
 * @typeparam T - queue element
 */
export interface Queue<T> {
	/**
	 * Queue head
	 */
	readonly head: CanUndef<T>;

	/**
	 * Queue length
	 */
	readonly length: number;

	/**
	 * Adds an element to the queue
	 * @param el
	 */
	push(el: T): unknown;

	/**
	 * Removes a head element from the queue and returns it
	 */
	pop(): CanUndef<T>;

	/**
	 * Clears the queue
	 */
	clear(): void;
}
