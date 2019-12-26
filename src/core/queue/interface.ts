/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface QueueWorker<T = unknown, V = unknown> {
	(task: T): CanPromise<V>;
}

export interface QueueOptions {
	concurrency?: number;
	interval?: number;
}

export default abstract class Queue<T, V = unknown> {
	/**
	 * The queue head
	 */
	head: CanUndef<T>;

	/**
	 * A value of the task status refresh interval
	 * (in milliseconds)
	 */
	interval: number;

	/**
	 * The maximum number of concurrent workers
	 */
	concurrency: number;

	/**
	 * The number of active workers
	 */
	activeWorkers: number = 0;

	/**
	 * The queue length
	 */
	get length(): number {
		return this.tasks.length;
	}

	/**
	 * A worker constructor
	 */
	protected worker: QueueWorker<T, V>;

	/**
	 * The task queue
	 */
	protected tasks: unknown[] = [];

	/**
	 * @param worker
	 * @param [concurrency]
	 * @param [interval]
	 */
	protected constructor(worker: QueueWorker<T, V>, {concurrency = 1, interval = 0}: QueueOptions = {}) {
		this.worker = worker;
		this.concurrency = concurrency;
		this.interval = interval;
	}

	/**
	 * Adds a task to the queue
	 * @param task
	 */
	abstract push(task: T): unknown;

	/**
	 * Removes a head task from the queue and returns it
	 */
	shift(): CanUndef<T> {
		const {head} = this;
		this.tasks.shift();
		return head;
	}

	/**
	 * Clears the queue
	 */
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
