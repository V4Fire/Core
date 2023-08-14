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
import SyncPromise from '../../core/promise/sync';
import { Queue } from '../../core/queue';
import type { Args, HashFn, Resource, ResourceHook, ResourceFactory, ResourceDestructor, PoolHook, PoolOptions, WrappedResource, OptionalWrappedResource } from '../../core/pool/interface';
export * from '../../core/pool/const';
export * from '../../core/pool/interface';
/**
 * Implementation of an object pool structure
 * @typeparam T - pool resource
 */
export default class Pool<T = unknown> {
    /**
     * The maximum number of resources that the pool can contain
     */
    readonly maxSize: number;
    /**
     * Number of resources that are stored in the pool
     */
    get size(): number;
    /**
     * Number of available resources that are stored in the pool
     */
    get available(): number;
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
    protected emitter: EventEmitter;
    /**
     * Store of pool resources
     */
    protected resourceStore: Map<string, Array<Resource<T>>>;
    /**
     * Store of borrowed pool resources
     */
    protected borrowedResourceStore: Map<string, Resource<T>>;
    /**
     * Set of all available resources
     */
    protected availableResources: Set<Resource<Resource<T>>>;
    /**
     * Set of all unavailable resources
     */
    protected unavailableResources: Set<Resource<Resource<T>>>;
    /**
     * Queue of active events
     */
    protected events: Map<string, Queue<string>>;
    /**
     * Map of active borrow events
     */
    protected borrowEventsInQueue: Map<string, string>;
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
    constructor(resourceFactory: ResourceFactory<T>, args: Args, opts?: PoolOptions<T>);
    /**
     * @param resourceFactory
     * @param [opts] - additional options
     */
    constructor(resourceFactory: ResourceFactory<T>, opts?: PoolOptions<T>);
    /**
     * Returns an available resource from the pool.
     * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
     *
     * The returned result is wrapped with a structure that contains methods to release or drop this resource.
     * If the pool is empty, the structure value field will be nullish.
     *
     * @param [args]
     */
    take(...args: unknown[]): OptionalWrappedResource<T>;
    /**
     * Returns an available resource from the pool.
     * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
     *
     * The returned result is wrapped with a structure that contains methods to release or drop this resource.
     * If the pool is empty, it creates a new resource and returns it.
     *
     * @param [args]
     */
    takeOrCreate(...args: unknown[]): WrappedResource<T>;
    /**
     * Returns a promise with an available resource from the pull.
     * The passed arguments will be used to calculate a resource hash. Also, they will be provided to hook handlers.
     *
     * The returned result is wrapped with a structure that contains methods to release or drop this resource.
     * If the pool is empty, the promise will wait till it release.
     *
     * @param [args]
     */
    takeOrWait(...args: unknown[]): SyncPromise<WrappedResource<T>>;
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
    borrow(...args: unknown[]): OptionalWrappedResource<T>;
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
    borrowOrCreate(...args: unknown[]): WrappedResource<T>;
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
    borrowOrWait(...args: unknown[]): SyncPromise<WrappedResource<T>>;
    /**
     * Clears the pool, i.e. drops all created resource.
     * The method takes arguments that will be provided to hook handlers.
     *
     * @param [args]
     */
    clear(...args: unknown[]): void;
    /**
     * Returns how many elements of the specified kind you can take.
     * The method takes arguments that will be used to calculate a resource hash.
     *
     * @param [args]
     */
    protected canTake(...args: unknown[]): number;
    /**
     * Checks if you can borrow a resource.
     * The passed arguments will be used to calculate a resource hash.
     *
     * @param [args]
     */
    protected canBorrow(...args: unknown[]): boolean;
    /**
     * Creates a resource and stores it in the pool.
     * The method takes arguments that will be provided to a resource factory.
     *
     * @param [args]
     */
    protected createResource(...args: unknown[]): Resource<T>;
    /**
     * Wraps the specified resource and returns the wrapper
     * @param resource
     */
    protected wrapResource(resource: Resource<T> | null): OptionalWrappedResource<T>;
    /**
     * Releases the specified resource.
     * The method takes arguments that will be provided to hook handlers.
     *
     * @param resource
     * @param [args]
     */
    protected free(resource: Resource<T>, ...args: unknown[]): void;
}
