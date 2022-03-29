/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/pool/README.md]]
 * @packageDocumentation
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { resolveAfterEvents } from 'core/event';

import SyncPromise from 'core/promise/sync';

import { generate, serialize } from 'core/uuid';
import { Queue } from 'core/queue';

import { hashVal, borrowCounter } from 'core/pool/const';

import type {

	Args,
	HashFn,

	Resource,
	ResourceHook,
	ResourceFactory,
	ResourceDestructor,

	PoolHook,
	PoolOptions,

	WrappedResource,
	OptionalWrappedResource

} from 'core/pool/interface';

export * from 'core/pool/const';
export * from 'core/pool/interface';

/**
 * Implementation of an object pool structure
 * @typeparam T - pool resource
 */
export default class Pool<T = unknown> {
	/**
	 * The maximum number of resources that the pool can contain
	 */
	readonly maxSize: number = Infinity;

	/**
	 * Number of resources that are stored in the pool
	 */
	get size(): number {
		return this.availableResources.size + this.unavailableResources.size;
	}

	/**
	 * Number of available resources that are stored in the pool
	 */
	get available(): number {
		return this.availableResources.size;
	}

	/**
	 * A factory to create a new resource for the pool.
	 * The function take arguments that are passed to `takeOrCreate`, `borrowAndCreate`, etc.
	 */
	protected resourceFactory: ResourceFactory<T>;

	/**
	 * A function to destroy one resource from the pool
	 */
	protected resourceDestructor?: ResourceDestructor<T>;

	/**
	 * A function to calculate a hash string for the specified arguments
	 */
	protected hashFn: HashFn;

	/**
	 * Event emitter to broadcast pool events
	 * @see [[EventEmitter]]
	 */
	protected emitter: EventEmitter = new EventEmitter();

	/**
	 * Store of pool resources
	 */
	protected resourceStore: Map<string, Array<Resource<T>>> = new Map();

	/**
	 * Store of borrowed pool resources
	 */
	protected borrowedResourceStore: Map<string, Resource<T>> = new Map();

	/**
	 * Set of all available resources
	 */
	protected availableResources: Set<Resource<Resource<T>>> = new Set();

	/**
	 * Set of all unavailable resources
	 */
	protected unavailableResources: Set<Resource<Resource<T>>> = new Set();

	/**
	 * Queue of active events
	 */
	protected events: Map<string, Queue<string>> = new Map();

	/**
	 * Map of active borrow events
	 */
	protected borrowEventsInQueue: Map<string, string> = new Map();

	/**
	 * Handler: taking some resource via `take` methods
	 */
	protected onTake?: ResourceHook<T>;

	/**
	 * Handler: taking some resource via `borrow` methods
	 */
	protected onBorrow?: ResourceHook<T>;

	/**
	 * Handler: releasing of some resource
	 */
	protected onFree?: ResourceHook<T>;

	/**
	 * Handler: clearing of all pool resources
	 */
	protected onClear?: PoolHook<T>;

	/**
	 * @param resourceFactory
	 * @param args - extra arguments to pass to the resource factory during initialization
	 * @param [opts] - additional options
	 */
	constructor(
		resourceFactory: ResourceFactory<T>,
		args: Args,
		opts?: PoolOptions<T>
	);

	/**
	 * @param resourceFactory
	 * @param [opts] - additional options
	 */
	constructor(resourceFactory: ResourceFactory<T>, opts?: PoolOptions<T>);

	constructor(
		resourceFactory: ResourceFactory<T>,
		argsOrOpts?: Args | PoolOptions<T>,
		opts?: PoolOptions<T>
	) {
		const
			p: PoolOptions<T> = {...opts};

		let
			args: unknown[] | Function = [];

		if (Object.isArray(argsOrOpts) || Object.isFunction(argsOrOpts)) {
			args = argsOrOpts;

		} else if (Object.isDictionary(argsOrOpts)) {
			Object.assign(p, argsOrOpts);
		}

		Object.assign(this, Object.reject(p, 'size'));

		this.hashFn ??= (() => '[[DEFAULT]]');
		this.resourceFactory = resourceFactory;

		const
			size = p.size ?? 0;

		for (let i = 0; i < size; i++) {
			this.createResource(...Object.isFunction(args) ? args(i) : args);
		}
	}

	/**
	 * Returns an available resource from the pool.
	 * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
	 *
	 * The returned result is wrapped with a structure that contains methods to release or drop this resource.
	 * If the pool is empty, the structure value field will be nullish.
	 *
	 * @param [args]
	 */
	take(...args: unknown[]): OptionalWrappedResource<T> {
		const
			resource = this.resourceStore.get(this.hashFn(...args))?.pop();

		if (resource == null) {
			return this.wrapResource(null);
		}

		resource[borrowCounter]++;
		this.availableResources.delete(resource);
		this.unavailableResources.add(resource);

		if (this.onTake != null) {
			this.onTake(resource, this, ...args);
		}

		return this.wrapResource(resource);
	}

	/**
	 * Returns an available resource from the pool.
	 * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
	 *
	 * The returned result is wrapped with a structure that contains methods to release or drop this resource.
	 * If the pool is empty, it creates a new resource and returns it.
	 *
	 * @param [args]
	 */
	takeOrCreate(...args: unknown[]): WrappedResource<T> {
		if (this.canTake(...args) === 0) {
			this.createResource(...args);
		}

		return Object.cast(this.take(...args));
	}

	/**
	 * Returns a promise with an available resource from the pull.
	 * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
	 *
	 * The returned result is wrapped with a structure that contains methods to release or drop this resource.
	 * If the pool is empty, the promise will wait till it release.
	 *
	 * @param [args]
	 */
	takeOrWait(...args: unknown[]): SyncPromise<WrappedResource<T>> {
		const
			event = this.hashFn(...args),
			id = serialize(generate());

		return new SyncPromise((r) => {
			if (this.canTake(...args) !== 0) {
				r(this.take(...args));
				return;
			}

			let
				queue = this.events.get(event);

			if (queue == null) {
				queue = new Queue();
				this.events.set(event, queue);
			}

			queue.push(id);
			r(resolveAfterEvents(this.emitter, id).then(() => this.take(...args)));
		});
	}

	/**
	 * Borrows an available resource from the pool.
	 * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
	 *
	 * When a resource is borrowed, it won’t be dropped from the pool. I.e. you can share it with other consumers.
	 * Mind, you can’t take this resource from the pool when it’s borrowed.
	 *
	 * The returned result is wrapped with a structure that contains methods to release or drop this resource.
	 * If the pool is empty, the structure value field will be nullish.
	 *
	 * @param [args]
	 */
	borrow(...args: unknown[]): OptionalWrappedResource<T> {
		const
			hash = this.hashFn(...args);

		let resource = this.borrowedResourceStore.get(hash);
		resource = resource ?? this.resourceStore.get(hash)?.pop();

		if (resource == null) {
			return this.wrapResource(null);
		}

		this.borrowedResourceStore.set(hash, resource);
		resource[borrowCounter]++;

		if (this.onBorrow != null) {
			this.onBorrow(resource, this, ...args);
		}

		return this.wrapResource(resource);
	}

	/**
	 * Borrows an available resource from the pool.
	 * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
	 *
	 * When a resource is borrowed, it won’t be dropped from the pool. I.e. you can share it with other consumers.
	 * Mind, you can’t take this resource from the pool when it’s borrowed.
	 *
	 * The returned result is wrapped with a structure that contains methods to release or drop this resource.
	 * If the pool is empty, it creates a new resource and returns it.
	 *
	 * @param [args]
	 */
	borrowOrCreate(...args: unknown[]): WrappedResource<T> {
		if (!this.canBorrow(...args)) {
			this.createResource(...args);
		}

		return Object.cast(this.borrow(...args));
	}

	/**
	 * Returns a promise with a borrowed resource from the pull.
	 * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
	 *
	 * When a resource is borrowed, it won’t be dropped from the pool. I.e. you can share it with other consumers.
	 * Mind, you can’t take this resource from the pool when it’s borrowed.
	 *
	 * The returned result is wrapped with a structure that contains methods to release or drop this resource.
	 * If the pool is empty, the promise will wait till it release.
	 *
	 * @param [args]
	 */
	borrowOrWait(...args: unknown[]): SyncPromise<WrappedResource<T>> {
		const
			event = this.hashFn(...args);

		let
			id = serialize(generate());

		return new SyncPromise((r) => {
			if (this.canBorrow(...args)) {
				r(this.borrow(...args));
				return;
			}

			const
				events = this.borrowEventsInQueue.get(event);

			if (events == null) {
				if (!this.events.has(event)) {
					this.events.set(event, new Queue());
				}

				this.events.get(event)?.push(id);
				this.borrowEventsInQueue.set(event, id);

			} else {
				id = events;
			}

			r(resolveAfterEvents(this.emitter, id).then(() => {
				this.borrowEventsInQueue.delete(event);
				return this.borrow(...args);
			}));
		});
	}

	/**
	 * Clears the pool, i.e. drops all created resource.
	 * The method takes arguments that will be provided to hook handlers.
	 *
	 * @param [args]
	 */
	clear(...args: unknown[]): this {
		const
			destructor = this.resourceDestructor;

		if (destructor != null) {
			this.availableResources.forEach((resource) => {
				destructor(resource);
			});

			this.unavailableResources.forEach((resource) => {
				destructor(resource);
			});
		}

		this.resourceStore.clear();
		this.borrowedResourceStore.clear();

		this.availableResources.clear();
		this.unavailableResources.clear();

		if (this.onClear != null) {
			this.onClear(this, ...args);
		}

		return this;
	}

	/**
	 * Returns how many elements of the specified kind you can take.
	 * The method takes arguments that will be used to calculate a resource hash.
	 *
	 * @param [args]
	 */
	protected canTake(...args: unknown[]): number {
		const array = this.resourceStore.get(this.hashFn(...args));
		return Object.size(array);
	}

	/**
	 * Checks if you can borrow a resource.
	 * The passed arguments will be used to calculate a resource hash.
	 *
	 * @param [args]
	 */
	protected canBorrow(...args: unknown[]): boolean {
		const hash = this.hashFn(...args);
		return !(!this.borrowedResourceStore.has(hash) && this.canTake(...args) === 0);
	}

	/**
	 * Creates a resource and stores it in the pool.
	 * The method takes arguments that will be provided to a resource factory.
	 *
	 * @param [args]
	 */
	protected createResource(...args: unknown[]): Resource<T> {
		const
			hash = this.hashFn(...args);

		if (this.maxSize <= this.size) {
			throw new Error('The pool contains too many resources');
		}

		let
			store = this.resourceStore.get(hash);

		if (store == null) {
			store = [];
			this.resourceStore.set(hash, store);
		}

		const
			resource = <Resource<T>>this.resourceFactory(...args);

		Object.defineProperty(resource, hashVal, {
			configurable: true,
			writable: true,
			value: hash
		});

		Object.defineProperty(resource, borrowCounter, {
			configurable: true,
			writable: true,
			value: 0
		});

		store.push(resource);
		this.availableResources.add(resource);

		return resource;
	}

	/**
	 * Wraps the specified resource and returns the wrapper
	 * @param resource
	 */
	protected wrapResource(resource: Resource<T> | null): OptionalWrappedResource<T> {
		let
			released = false;

		return {
			value: resource,

			free: (...args) => {
				if (released) {
					return;
				}

				released = true;

				if (resource != null) {
					this.free(resource, ...args);
				}
			},

			destroy: () => {
				if (released) {
					return;
				}

				released = true;

				if (resource != null) {
					const
						{onFree} = this;

					this.onFree = undefined;

					this.free(resource);
					this.availableResources.delete(resource);

					this.onFree = onFree;

					if (resource[borrowCounter] === 0) {
						this.resourceStore.get(resource[hashVal])?.pop();
						this.resourceDestructor?.(resource);
					}
				}
			}
		};
	}

	/**
	 * Releases the specified resource.
	 * The method takes arguments that will be provided to hook handlers.
	 *
	 * @param resource
	 * @param [args]
	 */
	protected free(resource: Resource<T>, ...args: unknown[]): this {
		resource[borrowCounter]--;
		this.unavailableResources.delete(resource);
		this.availableResources.add(resource);

		if (
			resource[borrowCounter] === 0 &&
			this.borrowedResourceStore.get(resource[hashVal]) === resource
		) {
			this.borrowedResourceStore.delete(resource[hashVal]);
		}

		if (resource[borrowCounter] === 0) {
			this.resourceStore.get(resource[hashVal])?.push(resource);
		}

		const
			event = this.events.get(resource[hashVal])?.pop();

		if (event != null) {
			this.emitter.emit(event);
		}

		if (this.onFree != null) {
			this.onFree(resource, this, ...args);
		}

		return this;
	}
}
