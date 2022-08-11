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

import LinkNode from 'core/linked-list/link-node';

/**
 * Doubly linked list implementation
 * @typeparam T - linked list element
 */
export default class LinkedList<T> {
	/**
	 * Linked list first element
	 */
	head: Nullable<LinkNode<T>> = null;

	/**
	 * Linked list last element
	 */
	tail: Nullable<LinkNode<T>> = null;

	/**
	 * Internal length value
	 */
	protected lengthStore: number = 0;

	/**
	 * Linked list length
	 */
	get length(): number {
		return this.lengthStore;
	}

	/**
	 * Adds one element to the beginning of the linked list and returns the new length of the list
	 */
	unshift(data: T, id?: string): number {
		const
			link = new LinkNode<T>(data, id);

		if (this.head != null) {
			this.head.prev = link;

		} else {
			this.tail = link;
		}

		link.next = this.head;
		this.head = link;

		return ++this.lengthStore;
	}

	/**
	 * Removes the first element from the linked list and returns that removed element.
	 * This method changes the length of the list
	 */
	shift(): Nullable<LinkNode<T>> {
		if (this.lengthStore === 0) {
			return null;
		}

		this.lengthStore--;

		const
			tmp = this.head;

		if (tmp == null) {
			return null;
		}

		this.head = tmp.next;

		if (this.head == null) {
			this.clear();
			return tmp;
		}

		tmp.next = null;

		return tmp;
	}

	/**
	 * Adds one element to the end of the linked list and returns the new length of the list
	 */
	push(data: T, id?: string): number {
		const
			link = new LinkNode<T>(data, id);

		if (this.tail == null) {
			this.head = link;

		} else {
			this.tail.next = link;
			link.prev = this.tail;
		}

		this.tail = link;

		return ++this.lengthStore;
	}

	/**
	 * Removes the last element from the linked list and returns that removed element.
	 * This method changes the length of the list
	 */
	pop(): Nullable<LinkNode<T>> {
		if (this.lengthStore === 0) {
			return null;
		}

		this.lengthStore--;

		const
			tmp = this.tail;

		if (tmp == null) {
			return null;
		}

		this.tail = tmp.prev;

		if (this.tail == null) {
			this.clear();
			return tmp;
		}

		this.tail.next = null;
		tmp.prev = null;

		return tmp;
	}

	/**
	 * Clears the linked list
	 */
	clear(): void {
		this.lengthStore = 0;
		this.head = null;
		this.tail = null;
	}

	[Symbol.iterator](): IterableIterator<T> {
		let
			current = this.head,
			cursor = 0;

		const
			length = this.lengthStore;

		return {
			[Symbol.iterator]() {
				return this;
			},

			next(): IteratorResult<T> {
				const
					done = length <= cursor++,
					value = current;

				current = value?.next;

				if (done || value == null) {
					return {done: true, value: undefined};
				}

				return {done: false, value: value.data};
			}
		};
	}
}
