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
	 * Linked list first element node
	 */
	protected firstNode: Nullable<LinkNode<T>> = null;

	/**
	 * Linked list last element node
	 */
	protected lastNode: Nullable<LinkNode<T>> = null;

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
	 * Linked list first element
	 */
	get first(): CanUndef<T> {
		return this.firstNode?.data;
	}

	/**
	 * Linked list last element
	 */
	get last(): CanUndef<T> {
		return this.lastNode?.data;
	}

	/**
	 * @param [iterable] - creates a list based on the iterable
	 */
	constructor(iterable?: Iterable<T>) {
		if (Object.isIterable(iterable)) {
			for (const el of iterable) {
				this.push(el);
			}
		}
	}

	/**
	 * Adds one element to the beginning of the linked list and returns the new length of the list
	 * @param data
	 */
	unshift(data: T): number {
		const
			link = new LinkNode<T>(data);

		if (this.firstNode != null) {
			this.firstNode.prev = link;

		} else {
			this.lastNode = link;
		}

		link.next = this.firstNode;
		this.firstNode = link;

		return ++this.lengthStore;
	}

	/**
	 * Removes the first element from the linked list and returns that removed element.
	 * This method changes the length of the list.
	 */
	shift(): CanUndef<T> {
		if (this.lengthStore === 0) {
			return;
		}

		this.lengthStore--;

		const
			tmp = this.firstNode;

		if (tmp == null) {
			return;
		}

		this.firstNode = tmp.next;

		if (this.firstNode == null) {
			this.clear();
			return tmp.data;
		}

		tmp.next = null;

		return tmp.data;
	}

	/**
	 * Adds one element to the end of the linked list and returns the new length of the list
	 * @param data
	 */
	push(data: T): number {
		const
			link = new LinkNode<T>(data);

		if (this.lastNode == null) {
			this.firstNode = link;

		} else {
			this.lastNode.next = link;
			link.prev = this.lastNode;
		}

		this.lastNode = link;

		return ++this.lengthStore;
	}

	/**
	 * Removes the last element from the linked list and returns that removed element.
	 * This method changes the length of the list.
	 */
	pop(): CanUndef<T> {
		if (this.lengthStore === 0) {
			return;
		}

		this.lengthStore--;

		const
			tmp = this.lastNode;

		if (tmp == null) {
			return;
		}

		this.lastNode = tmp.prev;

		if (this.lastNode == null) {
			this.clear();
			return tmp.data;
		}

		this.lastNode.next = null;
		tmp.prev = null;

		return tmp.data;
	}

	/**
	 * Returns true if a specified value exists in the list
	 * @param value
	 */
	has(value: T): boolean {
		for (const el of this) {
			if (el === value) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Clears the linked list
	 */
	clear(): void {
		this.lengthStore = 0;
		this.firstNode = null;
		this.lastNode = null;
	}

	/**
	 * Makes a shallow copy of current linked list
	 */
	clone(): LinkedList<T> {
		return new LinkedList<T>(this);
	}

	/**
	 * Returns an iterator from the last element
	 */
	reverse(): IterableIterator<T> {
		let
			current = this.lastNode,
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

				current = value?.prev;

				if (done || value == null) {
					return {done: true, value: undefined};
				}

				return {done, value: value.data};
			}
		};
	}

	/**
	 * Returns an iterator by list values
	 */
	[Symbol.iterator](): IterableIterator<T> {
		let
			current = this.firstNode,
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

				return {done, value: value.data};
			}
		};
	}
}
