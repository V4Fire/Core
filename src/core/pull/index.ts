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

import type { PullHook, PullOptions, PullResource } from 'core/pull/interface';
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
	 * Data structure that contains pull's objects
	 */
	protected readonly resourceStore: Map<string, T[]> = new Map();

	/**
	 * Data structure that contains pull's shared objects
	 */
	protected readonly borrowedResourceStore: Map<string, T> = new Map();

	/**
	 * Hook that is executed before `free` function
	 *
	 * @param value - value from `free(value)`
	 * @param pull - this pull
	 * @param args - args that are given to `free(value,...args)`
	 */
	protected onFree?: PullHook<T>;

	/**
	 * Hook that is executed before `this.take` or `this.takeOrCreate`
	 *
	 * @param value - value that are returned from `this.take`
	 * @param pull - this pull
	 * @param args - args in `this.take(...args)`
	 */
	protected onTake?: PullHook<T>;

	/**
	 * Calculates a hash of the resource
	 *
	 * @param args - params passed to `this.objectFactory`
	 */
	protected hashFn: (...args: unknown[]) => string;

	/**
	 * Hook that is called before `this.clear`
	 */
	protected onClear?: (pull: Pull<T>, ...args: unknown[]) => void;

	/**
	 * Object destructor
	 */
	protected destructor?: (resource: T) => void;

	/**
	 * @see [[EventEmitter]]
	 */
	protected emitter: EventEmitter=new EventEmitter();

	/**
	 * Queue of active events
	 */
	protected events: Queue<string> = new Queue();

	/**
	 * Map of active borrow events
	 */
	protected borrowEventsInQueue: Map<string, true> = new Map();

	/**
	 * Constructor that initializes pull
	 *
	 * @param objectFactory
	 * @param settings - settings like hooks
	 */
	constructor(
		objectFactory: (...args: unknown[]) => T,
		settings: PullOptions<T>
	)

	/**
	 * Constructor that can create objects immediately
	 *
	 * @param objectFactory
	 * @param size - amount of object that will be created at initialization
	 * @param settings - settings like hooks
	 */
	constructor(
		objectFactory: (...args: unknown[]) => T,
		size: number,
		settings: PullOptions<T>
	)

	/**
	 * Constructor that can create objects immediately with initial arguments
	 *
	 * @param objectFactory
	 * @param size - amount of object that will be created at initialization
	 * @param createOpts - options passed to objectFactory for first (size) elements
	 * @param settings - settings like hooks
	 */
	constructor(
		objectFactory: (...args: unknown[]) => T,
		size: number,
		createOpts: unknown[],
		settings: PullOptions<T>
	)

	constructor(
		objectFactory: (...args: unknown[]) => T,
		size: number | PullOptions<T>,
		createOpts: unknown[] | PullOptions<T> = [],
		opts: PullOptions<T> = {}
	) {

		if (!Object.isNumber(size)) {
			opts = size;
			size = 0;
		} else if (Object.isDictionary(createOpts)) {
			opts = createOpts;
			createOpts = [];
		}

		this.onFree = opts.onFree;

		this.onTake = opts.onTake;

		this.onClear = opts.onClear?.bind(null);

		this.hashFn = opts.hashFn?.bind(null) ?? (() => defaultValue);

		this.destructor = opts.destructor?.bind(null);

		this.objectFactory = objectFactory;

		for (let i = 0; i < size; i++) {
			this.createElement(<unknown[]>createOpts);
		}
	}

	/**
	 * Return how many elements of type `hashFn(...args)` you can take
	 *
	 * @param args - args for hashFn
	 */
	canTake(...args: unknown[]): number {
		const array = this.resourceStore.get(this.hashFn(...args));
		return Object.size(array);
	}

	/**
	 * Returns an object from the pull. Will return undefined if the pull is empty
	 *
	 * @param args - params for hasFn and hooks
	 */
	take(...args: unknown[]): PullResource<T> {
		const value = this.resourceStore.get(this.hashFn(...args))
			?.pop();

		if (value == null) {
			throw undefined;
		}

		if (this.onTake) {
			this.onTake(value, this, ...args);
		}

		value[viewerCount]++;

		return this.createPullResource(value);
	}

	/**
	 * If pull is empty, create a new element and returns it, otherwise it works like `this.take`
	 *
	 * @param args - params for hashFn and hooks
	 */
	takeOrCreate(...args: unknown[]): PullResource<T> {
		if (this.canTake(...args) === 0) {
			this.createElement(args);
		}

		return this.take(...args);
	}

	/**
	 * Return a Promise, that will be resolved after somebody returns element to pull
	 *
	 * @param args - params for hashFn and hooks
	 */
	takeOrWait(...args: unknown[]): SyncPromise<PullResource<T>> {
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
	 * Check if you can borrow element with ...args
	 *
	 * @param args - params for hashFn and hooks
	 */
	canBorrow(...args: unknown[]): boolean {
		const hash = this.hashFn(...args);

		return !(!this.borrowedResourceStore.has(hash) &&
			this.canTake(...args) === 0);
	}

	/**
	 * Borrow shared resources from pull, return undefined if the pull is empty
	 *
	 * @param args - params for hashFn and hooks
	 */
	borrow(...args: unknown[]): PullResource<T> {
		const hash = this.hashFn(...args);
		let value = this.borrowedResourceStore.get(hash);

		value = value == null ?
this.resourceStore.get(hash)
			?.pop() :
value;

		if (value == null) {
			throw undefined;
		}

		this.borrowedResourceStore.set(hash, value);

		value[viewerCount]++;

		return this.createPullResource(value);
	}

	/**
	 * Borrow resource from pull or create it if can't
	 *
	 * @param args - params for hashFn and hooks
	 */
	borrowOrCreate(...args: unknown[]): PullResource<T> {
		if (!this.canBorrow(...args)) {
			this.createElement(args);
		}

		return this.borrow(...args);
	}

	/**
	 * Borrow resource from pull or wait until somebody returns resource to pull
	 *
	 * @param args - params for hashFn and hooks
	 */
	borrowOrWait(...args: unknown[]): SyncPromise<PullResource<T>> {
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
	 * also call `this.onClear` and `this.destruct` for every resource
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
	 * Function that returns a value to the pull
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
	 * Return object that contain value and free, destroy functions
	 * @see [[PullResource]]
	 *
	 * @param value - value that will be returned
	 */
	protected createPullResource(value: T): PullResource<T> {
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
