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
import { generate, serialize } from 'core/uuid';
import SyncPromise from 'core/promise/sync';
import type { hook, PartialOpts, ReturnType } from 'core/pull/interface';
import { hashProperty, viewerCount } from 'core/pull/const';
import { resolveAfterEvents } from 'core/event';
import { Queue } from 'core/queue';

/**
 * Simple implementation of pull with stack
 * @typeparam T - pull element
 */
export default class Pull<T> {

	/**
	 * Data structure that contain pull's object
	 */
	storeForTake: Map<string, T[]> = new Map();

	/**
	 * Data structure that contain pull's shared object
	 */
	storeForBorrow: Map<string, T> = new Map();

	/**
	 * Hook that are activated before (free) function
	 *
	 * @param value - value from free(value)
	 * @param pull - this pull
	 * @param args - params that are given in free(value,...args)
	 */
	onFree?: hook<T>;

	/**
	 * Hook that are activated before this.take or this.takeOrCreate
	 *
	 * @param value - value that are return from this.take
	 * @param pull - this pull
	 * @param args - params in this.take(...args)
	 */
	onTake?: hook<T>;

	/**
	 * Function that calculate hash of resource
	 *
	 * @param args - params passed to take or borrow or createOpts from constructor
	 */
	hashFn: (...args: unknown[]) => string;

	/**
	 * Hook that called on this.clear
	 */
	onClear?: (pull: Pull<T>, ...args: unknown[]) => void;

	/**
	 * Hook that destruct object
	 */
	destructor?: (resource: T) => void;

	/**
	 * Factory from constructor argument
	 */
	objectFactory: (...args: unknown[]) => T;

	eventEmitter: EventEmitter;

	/**
	 * Active event queue
	 */
	events: Queue<string> = new Queue();

	/**
	 * Active borrow events
	 */
	borrowEventsInQueue: Map<string, true> = new Map();

	/**
	 * Constructor that initialize pull
	 *
	 * @param objectFactory
	 * @param settings - settings like "max pull size" and hooks
	 */
	constructor(objectFactory: () => T,
							settings: PartialOpts<T>)

	/**
	 * Constructor that can create object immediately
	 *
	 * @param objectFactory
	 * @param size - amount of object that will be created at initialization
	 * @param createOpts - options passed to objectFactory for first (size) elements
	 * @param settings - settings like "max pull size" and hooks
	 */
	constructor(objectFactory: () => T,
							size: number,
							createOpts: unknown[],
							settings: PartialOpts<T>)

	constructor(objectFactory: () => T,
							size: number | PartialOpts<T> = {},
							createOpts: unknown[] = [],
							settings: PartialOpts<T> = {}) {

		if (typeof size !== 'number') {
			settings = size;
			size = 0;
		}

		this.onFree = settings.onFree;

		this.onTake = settings.onTake;

		this.onClear = settings.onClear;

		this.hashFn = settings.hashFn ?? (() => '');

		this.destructor = settings.destructor;

		this.objectFactory = objectFactory;

		this.eventEmitter = new EventEmitter();

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
		const array = this.storeForTake.get(this.hashFn(...args));
		return array !== undefined ? array.length : 0;
	}

	/**
	 * Return object from pull. Throw error if pull is empty
	 *
	 * @param args - params for hasFn and hooks
	 */
	take(...args: unknown[]): ReturnType<T> {
		const value = this.storeForTake.get(this.hashFn(...args))
			?.pop();
		if (value === undefined) {
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

			r(resolveAfterEvents(this.eventEmitter, event)
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

		return !(!this.storeForBorrow.has(hash) &&
			this.canTake(...args) === 0);
	}

	/**
	 * Borrow shared resources from pull
	 *
	 * @param args - params for hashFn and hooks
	 */
	borrow(...args: unknown[]): ReturnType<T> {
		const hash = this.hashFn(...args);
		let value = this.storeForBorrow.get(hash);

		if (value === undefined) {
			value = this.storeForTake.get(hash)
				?.pop();

			if (value === undefined) {
				throw Error('Pull is empty');
			}

			this.storeForBorrow.set(hash, value);
		}

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

			if (this.borrowEventsInQueue.get(event) === undefined) {
				this.events.push(event);
				this.borrowEventsInQueue.set(event, true);
			}

			r(resolveAfterEvents(this.eventEmitter, event)
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

		this.storeForTake.forEach((array: T[]) => {
			while (array.length !== 0) {
				this.destructor?.(<T>array.pop());
			}
		});

		this.storeForBorrow.forEach((el: T) => {
			this.destructor?.(el);
		});

		this.storeForTake.clear();
		this.storeForBorrow.clear();
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

		if (value[viewerCount] === 0 &&
			this.storeForBorrow.get(value[hashProperty]) === value) {

			this.storeForBorrow.delete(value[hashProperty]);
		}

		if (value[viewerCount] === 0) {
			this.storeForTake.get(value[hashProperty])
				?.push(value);
		}

		const event = this.events.pop();
		if (event !== undefined) {
			this.eventEmitter.emit(event);
			this.borrowEventsInQueue.delete(event);
		}
	}

	createElement(args: unknown[]): void {
		const hash = this.hashFn(...args);
		if (!this.storeForTake.has(hash)) {
			this.storeForTake.set(hash, []);
		}

		const value = this.objectFactory(...args);
		value[hashProperty] = hash;
		value[viewerCount] = 0;
		this.storeForTake.get(hash)
			?.push(value);
	}

	returnValue(value: T): ReturnType<T> {
		return {
			free: this.free.bind(this),
			value,
			destroy: (resource: T) => {
				this.free(resource);

				if (value[viewerCount] === 0) {
					this.storeForTake.get(resource[hashProperty])
						?.pop();

					this.destructor?.(resource);
				}
			}
		};
	}

}
