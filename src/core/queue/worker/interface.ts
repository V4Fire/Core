/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SimpleQueue from '@src/core/queue/simple';
import AbstractQueue, { InnerQueue, CreateInnerQueue } from '@src/core/queue/interface';

export * from '@src/core/queue/interface';

export interface Task<T = unknown, V = unknown> {
	task: T;
	promise: Promise<V>;
	resolve(res: CanPromise<V>): void;
}

export type Tasks<T = unknown> = InnerQueue<T>;

export type CreateTasks<T extends Tasks<any>> = CreateInnerQueue<T>;

export interface QueueWorker<T = unknown, V = unknown> {
	(task: T): CanPromise<V>;
}

export interface WorkerQueueOptions<T extends Tasks<any> = Tasks> {
	/**
	 * Factory to create an inner queue to store elements
	 */
	tasksFactory?: CreateInnerQueue<T>;

	/**
	 * Maximum number of concurrent workers
	 */
	concurrency?: number;

	/**
	 * How often to refresh task statuses
	 * (in milliseconds)
	 */
	refreshInterval?: number;
}

/**
 * Abstract class for a worker queue data structure
 *
 * @typeparam T - task element
 * @typeparam V - worker value
 */
export default abstract class WorkerQueue<T, V = unknown> extends AbstractQueue<T> {
	/**
	 * Type: queue of tasks
	 */
	readonly Tasks!: Tasks;

	abstract override readonly head: CanUndef<T>;

	/** @inheritDoc */
	get length(): number {
		return this.tasks.length;
	}

	/**
	 * The maximum number of concurrent workers
	 */
	concurrency: number;

	/**
	 * How often to refresh task statuses
	 * (in milliseconds)
	 */
	refreshInterval: number;

	/**
	 * Number of active workers
	 */
	activeWorkers: number = 0;

	/**
	 * Worker constructor
	 */
	protected worker: QueueWorker<T, V>;

	/**
	 * Queue of tasks
	 */
	protected tasks: this['Tasks'];

	/**
	 * @param worker
	 * @param [opts]
	 */
	protected constructor(worker: QueueWorker<T, V>, opts: WorkerQueueOptions = {}) {
		super();

		this.worker = worker;
		this.concurrency = opts.concurrency ?? 1;
		this.refreshInterval = opts.refreshInterval ?? 0;

		if (opts.tasksFactory) {
			this.createTasks = opts.tasksFactory;
		}

		this.tasks = this.createTasks();
	}

	/** @inheritDoc */
	abstract override push(task: T): unknown;

	/** @inheritDoc */
	pop(): CanUndef<T> {
		const {head} = this;
		this.tasks.shift();
		return head;
	}

	/** @inheritDoc */
	clear(): void {
		if (this.length > 0) {
			this.tasks = this.createTasks();
			this.activeWorkers = 0;
		}
	}

	/**
	 * Returns a new blank queue of tasks
	 */
	protected createTasks: CreateInnerQueue<this['Tasks']> = () => new SimpleQueue();

	/**
	 * Executes a task chunk from the queue
	 */
	protected abstract perform(): unknown;

	/**
	 * Executes a task chunk from the queue
	 * (deferred version)
	 */
	protected deferPerform(): Promise<unknown> {
		const
			i = this.refreshInterval;

		return new Promise((resolve) => {
			const
				cb = () => resolve(this.perform());

			if (i > 0) {
				setTimeout(cb, i);

			} else {
				setImmediate(cb);
			}
		});
	}

	/**
	 * Starts an execution of tasks from the queue
	 */
	protected start(): void {
		const n = Math.min(
			this.concurrency - this.activeWorkers,
			this.length
		);

		for (let i = 0; i < n; i++) {
			this.activeWorkers++;
			this.perform();
		}
	}

	/**
	 * Provides a task result to the specified promise resolve function
	 *
	 * @param task
	 * @param resolve
	 */
	protected resolveTask(task: T, resolve: Function): void {
		try {
			resolve(this.worker(task));

		} catch (error) {
			resolve(Promise.reject(error));
		}
	}
}
