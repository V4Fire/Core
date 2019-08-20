/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Queue, { QueueWorker } from 'core/queue/interface';

export interface RequestQueueTask<T> {
	enable: boolean;
	args: T
}

export interface ErrorCallback {
	(lastRequestEnabled: boolean, e: Error): void;
}

/**
 * Represents a queue of tasks for requests. This requests work with an entity
 * that has two states: 'on' and 'off'.
 * Each task has the property {@link RequestQueueTask.enable}
 * which determines how the task will affect the entity's state.
 *
 * The queue can omit some requests if they leads to the same state
 * of the entity as its current one.
 */
export default class RequestQueue<T, V = unknown> extends Queue<RequestQueueTask<T>, V> {
	/** @override */
	protected tasks: RequestQueueTask<T>[] = [];

	/**
	 * True, if queue is processing
	 */
	protected inProgress: boolean = false;

	/**
	 * Last request status from {@link RequestQueueTask.enable}
	 */
	protected lastRequestEnabled!: boolean;

	/**
	 * Handler: process errors
	 */
	protected onError?: ErrorCallback;

	/**
	 * @override
	 * @param worker
	 */
	constructor(worker: QueueWorker<RequestQueueTask<T>, V>) {
		super(worker);
	}

	/** @override */
	push(task: RequestQueueTask<T>): Promise<V> {
		this.tasks.push(task);

		if (!this.inProgress) {
			if (!this.lastRequestEnabled) {
				this.lastRequestEnabled = !task.enable;
			}

			this.perform();
		}

		return <any>Promise.resolve();
	}

	/**
	 * Updates error handler
	 * @param onError
	 */
	updateErrorHandler(onError: ErrorCallback): void {
		this.onError = onError;
	}

	/** @override */
	protected perform(): void {
		this.run().catch((e) => this.handelError(e));
	}

	/**
	 * Processes every task in the queue until it's empty
	 */
	protected run(): Promise<V> {
		if (this.tasks.length === 0) {
			this.clear();
			return <any>Promise.resolve();
		}

		this.inProgress = true;

		const
			task = this.tasks.shift();

		if (!task) {
			return Promise.reject();
		}

		return this.worker.call(null, task)
			.then(() => this.lastRequestEnabled = task.enable)
			.then(() => this.tryOptimize())
			.catch((e) => this.handelError(e))
			.then(() => this.run());
	}

	/**
	 * Clears the queue
	 */
	protected clear(): void {
		this.tasks = [];
		this.inProgress = false;
	}

	/**
	 * Processes error
	 * @param error
	 */
	protected handelError(error: Error): void {
		this.clear();
		this.onError && this.onError(this.lastRequestEnabled, error);
	}

	/**
	 * Clears the queue if last task in the queue leads to the current state {@link RequestQueueTask.enable}
	 */
	protected tryOptimize(): void {
		if (this.tasks.length === 0) {
			return;
		}

		if (this.lastRequestEnabled === this.tasks[this.tasks.length - 1].enable) {
			this.clear();
		}
	}
}
