/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Queue from 'core/queue/interface';
export * from 'core/queue/interface';

export interface QueueWorker<T = unknown, V = unknown> {
	(task: T): CanPromise<V>;
}

export interface QueueOptions {
	/**
	 * Maximum number of concurrent workers
	 */
	concurrency?: number;

	/**
	 * Value of a task status refresh interval
	 * (in milliseconds)
	 */
	interval?: number;
}

/**
 * Abstract class for a worker queue data structure
 *
 * @typeparam T - task element
 * @typeparam V - worker value
 */
export default abstract class WorkerQueue<T, V = unknown> implements Queue<T> {
	/** @inheritDoc */
	head: CanUndef<T>;

	/**
	 * Value of the task status refresh interval
	 * (in milliseconds)
	 */
	interval: number;

	/**
	 * Maximum number of concurrent workers
	 */
	concurrency: number;

	/**
	 * Number of active workers
	 */
	activeWorkers: number = 0;

	/**
	 * Queue length
	 */
	get length(): number {
		return this.tasks.length;
	}

	/**
	 * Worker constructor
	 */
	protected worker: QueueWorker<T, V>;

	/**
	 * Task queue
	 */
	protected tasks: unknown[] = [];

	/**
	 * @param worker
	 * @param [opts]
	 */
	protected constructor(worker: QueueWorker<T, V>, opts?: QueueOptions) {
		this.worker = worker;
		this.concurrency = opts?.concurrency || 1;
		this.interval = opts?.interval || 0;
	}

	/** @inheritDoc */
	abstract push(task: T): unknown;

	/** @inheritDoc */
	shift(): CanUndef<T> {
		const {head} = this;
		this.tasks.shift();
		return head;
	}

	/** @inheritDoc */
	clear(): void {
		this.tasks = [];
		this.activeWorkers = 0;
	}

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
			i = this.interval;

		return new Promise((resolve) => {
			const
				cb = () => resolve(this.perform());

			if (i) {
				setTimeout(cb, i);

			} else {
				// tslint:disable-next-line:no-string-literal
				globalThis['setImmediate'](cb);
			}
		});
	}

	/**
	 * Starts an execution of tasks from the queue
	 */
	protected start(): void {
		const n = Math.min(
			this.concurrency - this.activeWorkers,
			this.tasks.length
		);

		for (let i = 0; i < n; i++) {
			this.activeWorkers++;
			this.perform();
		}
	}
}
