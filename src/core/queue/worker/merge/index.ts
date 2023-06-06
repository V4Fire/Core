/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/worker/merge/README.md]]
 */

import WorkerQueue from 'core/queue/worker/interface';

import type {

	Task,
	Tasks,

	HashFn,
	QueueWorker,

	WorkerQueueOptions

} from 'core/queue/worker/merge/interface';

export * from 'core/queue/worker/merge/interface';

/**
 * Implementation of a worker queue data structure with support of task merging by a specified hash function
 *
 * @typeParam T - the task element
 * @typeParam V - the worker value
 */
export default class MergeWorkerQueue<T, V = unknown> extends WorkerQueue<T, V> {
	override readonly Tasks!: Tasks<string>;

	override get head(): CanUndef<T> {
		if (this.length === 0) {
			return undefined;
		}

		const obj = this.tasksMap.get(this.tasks.head!);
		return obj?.task;
	}

	/**
	 * A map of registered tasks
	 */
	protected tasksMap: Map<string, Task<T, V>> = new Map();

	/**
	 * A function to calculate task hashes
	 */
	protected readonly hashFn: HashFn<T>;

	/**
	 * @param worker
	 * @param [opts] - additional options
	 */
	constructor(worker: QueueWorker<T, V>, opts: WorkerQueueOptions<T>) {
		super(worker, opts);
		this.hashFn = opts.hashFn ?? Object.fastHash.bind(Object);
	}

	override push(task: T): Promise<V> {
		const
			hash = this.hashFn(task);

		let
			taskObj = this.tasksMap.get(hash);

		if (taskObj == null) {
			let
				resolve;

			const promise = new Promise<V>((r) => {
				resolve = r;
			});

			taskObj = {task, promise, resolve};
			this.tasksMap.set(hash, taskObj);
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

		this.tasksMap.delete(this.tasks.head!);
		this.tasks.shift();

		return head;
	}

	override clear(): void {
		if (this.length > 0) {
			super.clear();
			this.tasksMap = new Map<string, Task<T, V>>();
		}
	}

	override clone(): MergeWorkerQueue<T, V> {
		const
			newQueue = new MergeWorkerQueue<T, V>(this.worker, {});

		Object.assign(newQueue, this);
		newQueue.tasksMap = new Map(this.tasksMap);

		if (this.tasks.clone != null) {
			newQueue.tasks = this.tasks.clone();

		} else {
			const
				tasks = this.createTasks();

			for (const task of this.tasks) {
				tasks.push(task);
			}

			newQueue.tasks = tasks;
		}

		return newQueue;
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
			taskObj = this.tasksMap.get(hash);

		if (taskObj == null) {
			return;
		}

		const
			{task, promise, resolve} = taskObj;

		const cb = () => {
			this.tasksMap.delete(hash);
			return this.deferPerform();
		};

		promise.then(cb, cb);
		this.resolveTask(task, resolve);
	}
}
