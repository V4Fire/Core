/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Queue, { QueueParams, QueueWorker, Task } from 'core/queue/interface';

export interface HashFn<T> {
	(task: T): string;
}

export interface MergeQueueParams<T> extends QueueParams {
	hashFn?: HashFn<T>;
}

export default class MergeQueue<T, V = unknown> extends Queue<T, V> {
	/** @override */
	get head(): CanUndef<Task<T, V>> {
		if (!this.length) {
			return undefined;
		}

		return this.tasksMap[this.tasks[0]];
	}

	/** @override */
	protected readonly tasks!: string[];

	/**
	 * Merge hash function
	 */
	private readonly hashFn: HashFn<T>;

	/**
	 * Map of tasks
	 */
	private readonly tasksMap: Dictionary<Task<T, V>> = Object.createDict();

	/**
	 * @override
	 * @param worker
	 * @param [params]
	 */
	constructor(worker: QueueWorker<T, V>, params: MergeQueueParams<T>) {
		super(worker, params);
		this.hashFn = params && params.hashFn || String;
	}

	/** @override */
	shift(): CanUndef<Task> {
		if (!this.length) {
			return undefined;
		}

		const
			{head} = this;

		delete this.tasksMap[this.tasks[0]];
		this.tasks.shift();

		return head;
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

			taskObj = this.tasksMap[hash] = {task, promise, resolve};
			this.tasks.push(hash);
		}

		this.start();
		return taskObj.promise;
	}

	/** @override */
	protected perform(): void {
		if (!this.tasks.length) {
			this.activeWorkers--;
			return;
		}

		const
			hash = <string>this.tasks.shift(),
			taskByHash = this.tasksMap[hash];

		if (!taskByHash) {
			return;
		}

		const
			{task, promise, resolve} = taskByHash;

		const cb = () => {
			delete this.tasksMap[hash];
			this.deferPerform();
		};

		promise.then(cb, cb);
		this.resolveTask(task, resolve);
	}
}
