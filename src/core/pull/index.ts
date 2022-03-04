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

import type { hook, Options, ReturnType } from 'core/pull/interface';
import { defaultValue, hashProperty, viewerCount } from 'core/pull/const';

/**
 * Simple implementation of pull with stack
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
	protected onFree?: hook<T>;

	/**
	 * Hook that are activated before this.take or this.takeOrCreate
	 *
	 * @param value - value that are return from this.take
	 * @param pull - this pull
	 * @param args - params in this.take(...args)
	 */
	protected onTake?: hook<T>;

	/**
	 * Function that calculate hash of resource
	 *
	 * @param args - params passed to take or borrow or createOpts from constructor
	 */
	protected hashFn: (...args: unknown[]) => string;

	/**
	 * Hook that called on this.clear
	 */
	protected onClear?: (pull: Pull<T>, ...args: unknown[]) => void;

	/**
	 * Hook that destruct object
	 */
	protected destructor?: (resource: T) => void;

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
		settings: Options<T>
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
		settings: Options<T>
	)

	constructor(
		objectFactory: () => T,
		size: number | Options<T> = {},
		createOpts: unknown[] = [],
		opts: Options<T> = {}
	) {

		if (!Object.isNumber(size)) {
			opts = size;
			size = 0;
		}

		this.onFree = opts.onFree;

		this.onTake = opts.onTake;

		this.onClear = opts.onClear;

		this.hashFn = opts.hashFn ?? (() => defaultValue);

		this.destructor = opts.destructor;

		this.objectFactory = objectFactory;

		this.emitter = new EventEmitter();

		for (let i = 0; i < size; i++) {
			this.createElement(createOpts);
		}
	}

	/**
	 * Return how many items of types ...args you can take
	 *
	 * @param args - args for hashFn
	 */
	canTake(...args: unknown[]): number {
		const array = this.resourceStore.get(this.hashFn(...args));
		return array !== undefined ? array.length : 0;
	}

	/**
	 * Return object from pull. Throw error if pull is empty
	 *
	 * @param args - params for hasFn and hooks
	 */
	take(...args: unknown[]): ReturnType<T> {
		const value = this.resourceStore.get(this.hashFn(...args))
			?.pop();

		if (value == null) {
			throw new Error('Pull is empty');
		}

		if (this.onTake) {
			this.onTake(value, this, args);
		}

		value[viewerCount]++;

		return this.returnValue(value);
	}

	/**
	 * Take but if this.take throw error create new object
	 *
	 * @param args - params for hashFn and hooks
	 */
	takeOrCreate(...args: unknown[]): ReturnType<T> {
		if (this.canTake(...args) === 0) {
			this.createElement(args);
		}

		return this.take(...args);
	}

	/**
	 * Return a Promise
	 *
	 * @param args - params for hashFn and hooks
	 */
	takeOrWait(...args: unknown[]): SyncPromise<ReturnType<T>> {
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
	 * Return if you can borrow item with ...args
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
	borrow(...args: unknown[]): ReturnType<T> {
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
	borrowOrCreate(...args: unknown[]): ReturnType<T> {
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
	borrowOrWait(...args: unknown[]): SyncPromise<ReturnType<T>> {
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
	 * Clear pull from all resources with call this.destruct and call hook onClear
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
	 * Function that add value to pull
	 *
	 * @param value - pull's object
	 * @param args - args for hook
	 */
	free(value: T, ...args: unknown[]): void {
		if (this.onFree) {
			this.onFree(value, this, args);
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

	protected returnValue(value: T): ReturnType<T> {
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
