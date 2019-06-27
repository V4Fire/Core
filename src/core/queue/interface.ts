/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GLOBAL } from 'core/env';

export type Value<V = unknown> = V | PromiseLike<V>;
export type QueueWorker<T = unknown, V = unknown> = (task: T) => Value<V>;
export type TaskDict<T = unknown, V = unknown> = Dictionary<{
	task: T;
	promise: Promise<V>;
	resolve(res: Value<V>): void;
}>;

export default abstract class Queue<T, V = unknown> {
	/**
	 * Worker constructor
	 */
	protected worker: QueueWorker<T, V>;

	/**
	 * Task status refresh interval
	 */
	protected interval: number;

	/**
	 * Maximum number of concurrent workers
	 */
	protected concurrency: number;

	/**
	 * Number of active workers
	 */
	protected activeWorkers: number = 0;

	/**
	 * Task queue
	 */
	protected readonly tasks: unknown[] = [];

	/**
	 * @param worker
	 * @param [concurrency]
	 * @param [interval]
	 */
	protected constructor(worker: QueueWorker<T, V>, concurrency: number = 1, interval: number = 0) {
		this.worker = worker;
		this.concurrency = concurrency;
		this.interval = interval;
	}

	/**
	 * Adds a task to the queue
	 * @param task
	 */
	abstract push(task: T): Promise<V>;

	/**
	 * Provides a task result to a promise resolve function
	 *
	 * @param task
	 * @param resolve
	 */
	protected resolveTask(task: T, resolve: Function): void {
		try {
			resolve(this.worker.call(null, task));

		} catch (error) {
			resolve(Promise.reject(error));
		}
	}

	/**
	 * Executes a chunk of tasks in the queue
	 */
	protected abstract perform(): void;

	/**
	 * Executes a chunk of tasks in the queue
	 * (lazy mode)
	 */
	protected deferPerform(): void {
		const
			i = this.interval,
			cb = () => this.perform();

		if (i) {
			setTimeout(cb, i);

		} else {
			// tslint:disable-next-line:no-string-literal
			GLOBAL['setImmediate'](cb);
		}
	}

	/**
	 * Start an execution of tasks in the queue
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
