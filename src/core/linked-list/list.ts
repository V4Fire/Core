/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Node from 'core/linked-list/node';

/**
 * Double-ended two-way linked list
 * @typeparam T - linked list node data
 */
export default class List<T> {
	/**
	 * Number of nodes in the list
	 */
	get length(): number {
		return this.lengthStore;
	}

	/**
	 * Data of the first node in the list
	 */
	get first(): CanUndef<T> {
		return this.firstNode?.data;
	}

	/**
	 * Data of the last node in the list
	 */
	get last(): CanUndef<T> {
		return this.lastNode?.data;
	}

	/**
	 * A link to the first node of the list
	 */
	protected firstNode: Nullable<Node<T>> = null;

	/**
	 * A link to the last node of the list
	 */
	protected lastNode: Nullable<Node<T>> = null;

	/**
	 * Internal length value of the list
	 */
	protected lengthStore: number = 0;

	/**
	 * @param [iterable] - data to add to the list
	 */
	constructor(iterable?: Iterable<T>) {
		if (Object.isIterable(iterable)) {
			for (const el of iterable) {
				this.push(el);
			}
		}
	}

	/**
	 * Returns an iterator over the data from the list
	 */
	[Symbol.iterator](): IterableIterator<T> {
		return this.values();
	}

	/**
	 * Adds the passed data to the beginning of the list and returns its new length
	 * @param data
	 */
	unshift(data: T): number {
		const
			link = new Node<T>(data);

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
	 * Removes the first node from the list and returns its data as the result.
	 * This method changes the length of the list.
	 */
	shift(): CanUndef<T> {
		if (this.lengthStore === 0) {
			return;
		}

		this.lengthStore--;

		const
			first = this.firstNode;

		if (first == null) {
			return;
		}

		this.firstNode = first.next;

		if (this.firstNode == null) {
			this.clear();
			return first.data;
		}

		first.next = null;

		return first.data;
	}

	/**
	 * Adds the passed data to the end of the list and returns its new length
	 * @param data
	 */
	push(data: T): number {
		const
			link = new Node<T>(data);

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
	 * Removes the last node from the list and returns its data as the result.
	 * This method changes the length of the list.
	 */
	pop(): CanUndef<T> {
		if (this.lengthStore === 0) {
			return;
		}

		this.lengthStore--;

		const
			last = this.lastNode;

		if (last == null) {
			return;
		}

		this.lastNode = last.prev;

		if (this.lastNode == null) {
			this.clear();
			return last.data;
		}

		this.lastNode.next = null;
		last.prev = null;

		return last.data;
	}

	/**
	 * Returns true if the list contains a node with the given data
	 * @param data
	 */
	includes(data: T): boolean {
		if (Number.isNaN(data)) {
			for (const el of this) {
				if (Number.isNaN(el)) {
					return true;
				}
			}

		} else {
			for (const el of this) {
				if (el === data) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Clears all nodes from the list
	 */
	clear(): void {
		this.lengthStore = 0;
		this.firstNode = null;
		this.lastNode = null;
	}

	/**
	 * Returns a shallow copy of a portion of a list into a new LinkedList selected from start to end (end not included)
	 * where start and end represent the index of nodes in that list. The original list will not be modified.
	 *
	 * @param [start]
	 * @param [end]
	 */
	slice(start?: number, end?: number): List<T> {
		if (start == null) {
			return new List<T>(this);
		}

		if (start < 0 && end != null) {
			return new List<T>([...this].slice(start, end));
		}

		let
			iter: IterableIterator<T>,
			reversed = false;

		if (start < 0) {
			start = Math.abs(start) - 1;
			end = start + 1;

			iter = this.reverse();
			reversed = true;

		} else {
			iter = this.values();
		}

		end ??= this.length;

		if (end < 0) {
			end += this.length;
		}

		let
			i = 0,
			done = false;

		const sliceIter = {
			[Symbol.iterator]() {
				return this;
			},

			next() {
				// eslint-disable-next-line no-constant-condition
				while (true) {
					if (done) {
						return {value: undefined, done: true};
					}

					const
						chunk = iter.next();

					if (chunk.done) {
						done = true;
						return chunk;
					}

					if (i >= start!) {
						if (i++ < end!) {
							return chunk;
						}

						done = true;
						return {value: chunk.value, done};
					}

					i++;
				}
			}
		};

		return new List<T>(reversed ? [...sliceIter].reverse() : sliceIter);
	}

	/**
	 * Returns an iterator over the data from the list
	 */
	values(): IterableIterator<T> {
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
					return {
						done: true,
						value: undefined
					};
				}

				return {
					done,
					value: value.data
				};
			}
		};
	}

	/**
	 * Returns an iterator over the data in the list.
	 * The traversal will proceed from the last node to the first.
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
}
