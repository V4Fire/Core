/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Queue, {

	QueueWorker,
	QueueParams as BaseQueueParams,
	TaskObject as BaseTaskObject

} from 'core/queue/interface';

export interface HashFn<T> {
	(task: T): string;
}

export interface QueueParams<T> extends BaseQueueParams {
	hashFn?: HashFn<T>;
}

export interface TaskObject<T = unknown, V = unknown> extends BaseTaskObject<T, V> {
	task: T;
	promise: Promise<V>;
	resolve(res: CanPromise<V>): void;
}

export default class MergeQueue<T, V = unknown> extends Queue<T, V> {
	/** @override */
	get head(): CanUndef<T> {
		if (!this.length) {
			return undefined;
		}

		const obj = this.tasksMap[this.tasks[0]];
		return obj && obj.task;
	}

	/** @override */
	protected tasks!: string[];

	/**
	 * Map of tasks
	 */
	private tasksMap: Dictionary<TaskObject<T, V>> = Object.createDict();

	/**
	 * Merge hash function
	 */
	private readonly hashFn: HashFn<T>;

	/**
	 * @override
	 * @param worker
	 * @param [params]
	 */
	constructor(worker: QueueWorker<T, V>, params: QueueParams<T>) {
		super(worker, params);
		this.hashFn = params && params.hashFn || String;
	}

	/** @override */
	shift(): CanUndef<T> {
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
	clear(): void {
		super.clear();
		this.tasksMap = Object.createDict();
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
		if (!this.length) {
			this.activeWorkers--;
			return;
		}

		const
			hash = <string>this.tasks.shift(),
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
}
