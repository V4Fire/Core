/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GLOBAL } from 'core/env';

export interface TaskObject<T = unknown, V = unknown> {

}

export interface QueueWorker<T = unknown, V = unknown> {
	(task: T): CanPromise<V>;
}

export interface QueueParams {
	concurrency?: number;
	interval?: number;
}

export default abstract class Queue<T, V = unknown> {
	/**
	 * Queue head
	 */
	head: CanUndef<T>;

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
	abstract push(task: T): unknown;

	/**
	 * Removes the head task from the queue and returns it
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
	}

	/**
	 * Executes a chunk of tasks from the queue
	 */
	protected abstract perform(): unknown;

	/**
	 * Executes a chunk of tasks from the queue
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
				GLOBAL['setImmediate'](cb);
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
