/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Queue, { TaskDict, QueueWorker } from 'core/queue/interface';

export default class MergeQueue<T, V = unknown> extends Queue<T, V> {
	/** @override */
	protected readonly tasks!: string[];

	/**
	 * Merge hash function
	 */
	private readonly hashFn: (task: T) => string;

	/**
	 * Map of tasks
	 */
	private readonly tasksDict: TaskDict<T, V> = Object.createDict();

	/**
	 * @override
	 * @param worker
	 * @param [concurrency]
	 * @param [interval]
	 * @param [hashFn]
	 */
	constructor(worker: QueueWorker<T, V>, concurrency: number, interval: number, hashFn: (task: T) => string = String) {
		super(worker, concurrency, interval);
		this.hashFn = hashFn;
	}

	/** @override */
	push(task: T): Promise<V> {
		const
			hash = this.hashFn(task);

		let
			taskObj = this.tasksDict[hash];

		if (!taskObj) {
			let resolve;
			const promise = new Promise<V>((r) => {
				resolve = r;
			});

			taskObj = this.tasksDict[hash] = {task, promise, resolve};
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
			taskByHash = this.tasksDict[hash];

		if (!taskByHash) {
			return;
		}

		const
			{task, promise, resolve} = taskByHash;

		const cb = () => {
			delete this.tasksDict[hash];
			this.deferPerform();
		};

		promise.then(cb, cb);
		this.resolveTask(task, resolve);
	}
}
