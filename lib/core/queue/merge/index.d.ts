/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import AbstractQueue from '../../../core/queue/interface';
import type { HashFn, InnerQueue, CreateInnerQueue } from '../../../core/queue/merge/interface';
export * from '../../../core/queue/merge/interface';
/**
 * Implementation of a queue data structure with support of task merging by a specified hash function
 * @typeparam T - the queue element
 */
export default class MergeQueue<T> extends AbstractQueue<T> {
    /**
     * Type: the internal queue to store elements
     */
    readonly InnerQueue: InnerQueue<string>;
    /** @inheritDoc */
    get head(): CanUndef<T>;
    /** @inheritDoc */
    get length(): number;
    /**
     * The internal queue to store elements
     */
    protected innerQueue: this['InnerQueue'];
    /**
     * A map of registered tasks
     */
    protected tasksMap: Map<string, T>;
    /**
     * A function to calculate task hashes
     */
    protected readonly hashFn: HashFn<T>;
    /**
     * @override
     * @param [hashFn] - a function to calculate task hashes
     */
    constructor(hashFn?: HashFn<T>);
    /** @inheritDoc */
    push(task: T): number;
    /** @inheritDoc */
    pop(): CanUndef<T>;
    /** @inheritDoc */
    clear(): void;
    /** @inheritDoc */
    clone(): MergeQueue<T>;
    /**
     * Returns a new blank internal queue to store elements
     */
    protected createInnerQueue: CreateInnerQueue<this['InnerQueue']>;
}
