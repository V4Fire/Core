/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/linked-list/README.md]]
 * @packageDocumentation
 */

/**
 * Linked list node
 * @typeparam T - linked list node element
 */
export default class LinkNode<T> {
	/**
	 * Identifier of the link node
	 */
	readonly id?: string;

	/**
	 * Data of the link node
	 */
	readonly data: T;

	/**
	 * Link to the next link node
	 */
	next: Nullable<LinkNode<T>> = null;

	/**
	 * Link to the previous link node
	 */
	prev: Nullable<LinkNode<T>> = null;

	/**
	 * @param [data] - data to add
	 */
	constructor(data: T) {
		this.data = data;
	}
}
