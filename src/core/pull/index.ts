/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/pull/README.md]]
 * @packageDocumentation
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { resolveAfterEvents } from 'core/event';

import SyncPromise from 'core/promise/sync';

import { generate, serialize } from 'core/uuid';
import { Queue } from 'core/queue';

import type { PullHook, PullOptions, PullReturnType } from 'core/pull/interface';
import { defaultValue, hashProperty, viewerCount } from 'core/pull/const';

export * from 'core/pull/const';
export * from 'core/pull/interface';

/**
 * Implementation of pull
 * @typeparam T - pull element
 */
export default class Pull<T> {
	/**
	 * Factory from constructor argument
	 */
	protected objectFactory: (...args: unknown[]) => T;

	/**
	 * Data structure that contain pull's object
	 */
	protected readonly resourceStore: Map<string, T[]> = new Map();

	/**
	 * Data structure that contain pull's shared object
	 */
	protected readonly borrowedResourceStore: Map<string, T> = new Map();

	/**
	 * Hook that are activated before (free) function
	 *
	 * @param value - value from free(value)
	 * @param pull - this pull
	 * @param args - params that are given in free(value,...args)
	 */
	protected onFree?: PullHook<T>;

	/**
	 * Hook that are activated before `this.take` or `this.takeOrCreate`
	 *
	 * @param value - value that are returned from `this.take`
	 * @param pull - this pull
	 * @param args - params in `this.take(...args)`
	 */
	protected onTake?: PullHook<T>;

	/**
	 * Function that calculate hash of resource
	 *
	 * @param args - params passed to take or borrow or createOpts from constructor
	 */
	protected hashFn: (...args: unknown[]) => string;

	/**
	 * Hook that called before 'this.clear'
	 */
	protected onClear?: (pull: Pull<T>, ...args: unknown[]) => void;

	/**
	 * Hook that destruct object
	 */
	protected destructor?: (resource: T) => void;

	/**
	 * @see EventEmitter
	 */
	protected emitter: EventEmitter;

	/**
	 * Active event queue
	 */
	protected events: Queue<string> = new Queue();

	/**
	 * Active borrow events
	 */
	protected borrowEventsInQueue: Map<string, true> = new Map();

	/**
	 * Constructor that initialize pull
	 *
	 * @param objectFactory
	 * @param settings - settings like "max pull size" and hooks
	 */
	constructor(
		objectFactory: () => T,
		settings: PullOptions<T>
	)

	/**
	 * Constructor that can create object immediately
	 *
	 * @param objectFactory
	 * @param size - amount of object that will be created at initialization
	 * @param createOpts - options passed to objectFactory for first (size) elements
	 * @param settings - settings like "max pull size" and hooks
	 */
	constructor(
		objectFactory: () => T,
		size: number,
		createOpts: unknown[],
		settings: PullOptions<T>
	)

	constructor(
		objectFactory: () => T,
		size: number | PullOptions<T> = {},
		createOpts: unknown[] = [],
		opts: PullOptions<T> = {}
	) {

		if (!Object.isNumber(size)) {
			opts = size;
			size = 0;
		}

		this.onFree = opts.onFree;

		this.onTake = opts.onTake;

		this.onClear = opts.onClear?.bind(null);

		this.hashFn = opts.hashFn?.bind(null) ?? (() => defaultValue);

		this.destructor = opts.destructor?.bind(null);

		this.objectFactory = objectFactory;

		this.emitter = new EventEmitter();

		for (let i = 0; i < size; i++) {
			this.createElement(createOpts);
		}
	}

	/**
	 * Return how many elements of type `...args` you can take
	 *
	 * @param args - args for hashFn
	 */
	canTake(...args: unknown[]): number {
		const array = this.resourceStore.get(this.hashFn(...args));
		return Object.size(array);
	}

	/**
	 * Returns an object from the pull. Will throw an error if the pull is empty
	 *
	 * @param args - params for hasFn and hooks
	 */
	take(...args: unknown[]): PullReturnType<T> {
		const value = this.resourceStore.get(this.hashFn(...args))
			?.pop();

		if (value == null) {
			throw new Error('Pull is empty');
		}

		if (this.onTake) {
			this.onTake(value, this, ...args);
		}

		value[viewerCount]++;

		return this.returnValue(value);
	}

	/**
	 * If pull is empty, create a new element and returns it, otherwise it works like `this.take`
	 *
	 * @param args - params for hashFn and hooks
	 */
	takeOrCreate(...args: unknown[]): PullReturnType<T> {
		if (this.canTake(...args) === 0) {
			this.createElement(args);
		}

		return this.take(...args);
	}

	/**
	 * Return a Promise, that will be resolved after somebody releases item
	 *
	 * @param args - params for hashFn and hooks
	 */
	takeOrWait(...args: unknown[]): SyncPromise<PullReturnType<T>> {
		const event = serialize(generate());

		return new SyncPromise((r) => {
			if (this.canTake(...args) !== 0) {
				r(this.take(...args));
			}

			this.events.push(event);

			r(resolveAfterEvents(this.emitter, event)
				.then(() => this.take(...args)));
		});
	}

	/**
	 * Check can you borrow item with ...args
	 *
	 * @param args - params for hashFn and hooks
	 */
	canBorrow(...args: unknown[]): boolean {
		const hash = this.hashFn(...args);

		return !(!this.borrowedResourceStore.has(hash) &&
			this.canTake(...args) === 0);
	}

	/**
	 * Borrow shared resources from pull
	 *
	 * @param args - params for hashFn and hooks
	 */
	borrow(...args: unknown[]): PullReturnType<T> {
		const hash = this.hashFn(...args);
		let value = this.borrowedResourceStore.get(hash);

		value = value == null ? this.resourceStore.get(hash)?.pop() : value;

		if (value == null) {
			throw Error('Pull is empty');
		}

		this.borrowedResourceStore.set(hash, value);

		value[viewerCount]++;

		return this.returnValue(value);
	}

	/**
	 * Borrow resource from pull or create it if can't
	 *
	 * @param args - params for hashFn and hooks
	 */
	borrowOrCreate(...args: unknown[]): PullReturnType<T> {
		if (!this.canBorrow(...args)) {
			this.createElement(args);
		}

		return this.borrow(...args);
	}

	/**
	 * Borrow resource from pull or wait until somebody free resource
	 *
	 * @param args - params for hashFn and hooks
	 */
	borrowOrWait(...args: unknown[]): SyncPromise<PullReturnType<T>> {
		const event = this.hashFn(...args);

		return new SyncPromise((r) => {
			if (this.canBorrow(...args)) {
				r(this.borrow(...args));
			}

			if (this.borrowEventsInQueue.get(event) == null) {
				this.events.push(event);
				this.borrowEventsInQueue.set(event, true);
			}

			r(resolveAfterEvents(this.emitter, event)
				.then(() => this.borrow(...args)));
		});
	}

	/**
	 * Delete all elements in pull
	 * also call `this.onClear` and 'this.destruct' for every resource
	 *
	 * @param args - params for hook
	 */
	clear(...args: unknown[]): void {
		if (this.onClear !== undefined) {
			this.onClear(this, ...args);
		}

		this.resourceStore.forEach((array: T[]) => {
			while (array.length !== 0) {
				this.destructor?.(<T>array.pop());
			}
		});

		this.borrowedResourceStore.forEach((el: T) => {
			this.destructor?.(el);
		});

		this.resourceStore.clear();
		this.borrowedResourceStore.clear();
	}

	/**
	 * Function that return a value to the pull
	 *
	 * @param value - pull's object
	 * @param args - args for hook
	 */
	free(value: T, ...args: unknown[]): void {
		if (this.onFree) {
			this.onFree(value, this, ...args);
		}

		value[viewerCount]--;

		if (
			value[viewerCount] === 0 &&
			this.borrowedResourceStore.get(value[hashProperty]) === value
		) {

			this.borrowedResourceStore.delete(value[hashProperty]);
		}

		if (value[viewerCount] === 0) {
			this.resourceStore.get(value[hashProperty])
				?.push(value);
		}

		const event = this.events.pop();

		if (event !== undefined) {
			this.emitter.emit(event);
			this.borrowEventsInQueue.delete(event);
		}
	}

	/**
	 * Create an element and add it to the pull
	 *
	 * @param args - params for hashFn and objectFactory
	 * @protected
	 */
	protected createElement(args: unknown[]): void {
		const hash = this.hashFn(...args);

		if (!this.resourceStore.has(hash)) {
			this.resourceStore.set(hash, []);
		}

		const value = this.objectFactory(...args);
		value[hashProperty] = hash;
		value[viewerCount] = 0;
		this.resourceStore.get(hash)
			?.push(value);
	}

	/**
	 * @see PullReturnType
	 * Return object that contain value and free, destroy functions
	 *
	 * @param value - value that will be returned
	 * @protected
	 */
	protected returnValue(value: T): PullReturnType<T> {
		return {
			free: this.free.bind(this),
			value,
			destroy: (resource: T) => {
				this.free(resource);

				if (value[viewerCount] === 0) {
					this.resourceStore.get(resource[hashProperty])
						?.pop();

					this.destructor?.(resource);
				}
			}
		};
	}

}
