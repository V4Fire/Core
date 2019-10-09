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

export interface Task<T = unknown, V = unknown> {
	task: T;
	promise: Promise<V>;
	resolve(res: Value<V>): void;
}

export interface QueueParams {
	concurrency?: number;
	interval?: number;
}

export default abstract class Queue<T, V = unknown> {
	/**
	 * Queue head
	 */
	head: CanUndef<Task>;

	/**
	 * Task status refresh interval
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
	 * @param [concurrency]
	 * @param [interval]
	 */
	protected constructor(worker: QueueWorker<T, V>, {concurrency = 1, interval = 0}: QueueParams = {}) {
		this.worker = worker;
		this.concurrency = concurrency;
		this.interval = interval;
	}

	/**
	 * Adds the specified task to the queue
	 * @param task
	 */
	abstract push(task: T): Promise<V>;

	/**
	 * Removes the head task from the queue and returns it
	 */
	shift(): CanUndef<Task> {
		const {head} = this;
		this.tasks.shift();
		return head;
	}

	/**
	 * Clears the queue
	 */
	clear(): void {
		this.tasks = [];
	}

	/**
	 * Provides a task result to a promise resolve function
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

	/**
	 * Executes a chunk of tasks from the queue
	 */
	protected abstract perform(): void;

	/**
	 * Executes a chunk of tasks from the queue
	 * (deferred version)
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
