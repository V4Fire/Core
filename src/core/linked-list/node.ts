/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Linked list node
 *
 * @typeParam T - node data
 */
export default class Node<T> {
	/**
	 * Node data
	 */
	readonly data: T;

	/**
	 * A link to the next node
	 */
	next: Nullable<Node<T>> = null;

	/**
	 * A link to the previous node
	 */
	prev: Nullable<Node<T>> = null;

	/**
	 * @param [data]
	 */
	constructor(data: T) {
		this.data = data;
	}
}
