/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Node from '../../core/linked-list/node';
/**
 * Double-ended two-way linked list
 * @typeparam T - linked list node data
 */
export default class List<T> {
    /**
     * Number of nodes in the list
     */
    get length(): number;
    /**
     * Data of the first node in the list
     */
    get first(): CanUndef<T>;
    /**
     * Data of the last node in the list
     */
    get last(): CanUndef<T>;
    /**
     * A link to the first node of the list
     */
    protected firstNode: Nullable<Node<T>>;
    /**
     * A link to the last node of the list
     */
    protected lastNode: Nullable<Node<T>>;
    /**
     * Internal length value of the list
     */
    protected lengthStore: number;
    /**
     * @param [iterable] - data to add to the list
     */
    constructor(iterable?: Iterable<T>);
    /**
     * Returns an iterator over the data from the list
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * Adds the passed data to the beginning of the list and returns its new length
     * @param data
     */
    unshift(...data: T[]): number;
    /**
     * Removes the first node from the list and returns its data as the result.
     * This method changes the length of the list.
     */
    shift(): CanUndef<T>;
    /**
     * Adds the passed data to the end of the list and returns its new length
     * @param data
     */
    push(...data: T[]): number;
    /**
     * Removes the last node from the list and returns its data as the result.
     * This method changes the length of the list.
     */
    pop(): CanUndef<T>;
    /**
     * Returns true if the list contains a node with the given data
     * @param data
     */
    includes(data: T): boolean;
    /**
     * Clears all nodes from the list
     */
    clear(): void;
    /**
     * Returns a shallow copy of a portion of a list into a new LinkedList selected from start to end (end not included)
     * where start and end represent the index of nodes in that list. The original list will not be modified.
     *
     * @param [start]
     * @param [end]
     */
    slice(start?: number, end?: number): List<T>;
    /**
     * Returns an iterator over the data from the list
     */
    values(): IterableIterator<T>;
    /**
     * Returns an iterator over the data in the list.
     * The traversal will proceed from the last node to the first.
     */
    reverse(): IterableIterator<T>;
}
