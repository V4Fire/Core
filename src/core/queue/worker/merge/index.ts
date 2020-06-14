/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/worker/merge/README.md]]
 * @packageDocumentation
 */

import WorkerQueue, { Tasks } from 'core/queue/worker/interface';
import { QueueWorker, QueueOptions, Task, HashFn } from 'core/queue/worker/merge/interface';

export * from 'core/queue/worker/merge/interface';

/**
 * Implementation of a worker queue data structure with support of task merging by the specified hash function
 *
 * @typeparam T - task element
 * @typeparam V - worker value
 */
export default class MergeWorkerQueue<T, V = unknown> extends WorkerQueue<T, V> {
	/** @override */
	readonly Tasks!: Tasks<string>;

	/** @override */
	get head(): CanUndef<T> {
		if (this.length === 0) {
			return undefined;
		}

		const obj = this.tasksMap[this.tasks[0]];
		return obj?.task;
	}

	/**
	 * The map of registered tasks
	 */
	private tasksMap: Dictionary<Task<T, V>> = Object.createDict();

	/**
	 * The task hash function
	 */
	private readonly hashFn: HashFn<T>;

	/**
	 * @override
	 * @param worker
	 * @param [opts]
	 */
	constructor(worker: QueueWorker<T, V>, opts: QueueOptions<T>) {
		super(worker, opts);
		this.hashFn = opts.hashFn ?? Object.fastHash.bind(Object);
	}

	/** @override */
	push(task: T): Promise<V> {
		const
			hash = this.hashFn(task);

		let
			taskObj = this.tasksMap[hash];

		if (!taskObj) {
			let
				resolve;

			const promise = new Promise<V>((r) => {
				resolve = r;
			});

			taskObj = {task, promise, resolve};
			this.tasksMap[hash] = taskObj;
			this.tasks.push(hash);
		}

		this.start();
		return taskObj.promise;
	}

	/** @override */
	pop(): CanUndef<T> {
		if (this.length === 0) {
			return;
		}

		const
			{head} = this;

		delete this.tasksMap[this.tasks[0]];
		this.tasks.shift();

		return head;
	}

	/** @override */
	clear(): void {
		super.clear();
		this.tasksMap = Object.createDict();
	}

	/** @override */
	protected perform(): void {
		if (this.length === 0) {
			this.activeWorkers--;
			return;
		}

		const
			hash = this.tasks.shift();

		if (hash === undefined) {
			return;
		}

		const
			taskObj = this.tasksMap[hash];

		if (!taskObj) {
			return;
		}

		const
			{task, promise, resolve} = taskObj;

		const cb = () => {
			delete this.tasksMap[hash];
			return this.deferPerform();
		};

		promise.then(cb, cb);
		this.resolveTask(task, resolve);
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
