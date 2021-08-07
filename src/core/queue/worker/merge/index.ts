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

import WorkerQueue from 'core/queue/worker/interface';
import type { Task, Tasks, QueueWorker, QueueOptions, HashFn } from 'core/queue/worker/merge/interface';

export * from 'core/queue/worker/merge/interface';

/**
 * Implementation of a worker queue data structure with support of task merging by the specified hash function
 *
 * @typeparam T - task element
 * @typeparam V - worker value
 */
export default class MergeWorkerQueue<T, V = unknown> extends WorkerQueue<T, V> {
	override readonly Tasks!: Tasks<string>;

	override get head(): CanUndef<T> {
		if (this.length === 0) {
			return undefined;
		}

		const obj = this.tasksMap[this.tasks.head!];
		return obj?.task;
	}

	/**
	 * The map of registered tasks
	 */
	protected tasksMap: Dictionary<Task<T, V>> = Object.createDict();

	/**
	 * Function to calculate task hash
	 */
	protected readonly hashFn: HashFn<T>;

	/**
	 * @override
	 * @param worker
	 * @param [opts]
	 */
	constructor(worker: QueueWorker<T, V>, opts: QueueOptions<T>) {
		super(worker, opts);
		this.hashFn = opts.hashFn ?? Object.fastHash.bind(Object);
	}

	override push(task: T): Promise<V> {
		const
			hash = this.hashFn(task);

		let
			taskObj = this.tasksMap[hash];

		if (taskObj == null) {
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

	override pop(): CanUndef<T> {
		if (this.length === 0) {
			return;
		}

		const
			{head} = this;

		delete this.tasksMap[this.tasks.head!];
		this.tasks.shift();

		return head;
	}

	override clear(): void {
		if (this.length > 0) {
			super.clear();
			this.tasksMap = Object.createDict();
		}
	}

	protected override perform(): void {
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
			// eslint-disable-next-line @typescript-eslint/unbound-method
			{task, promise, resolve} = taskObj;

		const cb = () => {
			delete this.tasksMap[hash];
			return this.deferPerform();
		};

		promise.then(cb, cb);
		this.resolveTask(task, resolve);
	}
}
