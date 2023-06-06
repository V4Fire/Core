/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/worker/simple/README.md]]
 * @packageDocumentation
 */

import WorkerQueue from 'core/queue/worker/interface';
import type { Task, Tasks } from 'core/queue/worker/simple/interface';

export * from 'core/queue/worker/merge/interface';

/**
 * Implementation of a worker queue data structure
 *
 * @typeParam T - the task element
 * @typeParam V - the worker value
 */
export default class SimpleWorkerQueue<T, V = unknown> extends WorkerQueue<T, V> {
	override readonly Tasks!: Tasks<Task<T>>;

	override get head(): CanUndef<T> {
		return this.tasks.head?.task;
	}

	override push(task: T): Promise<V> {
		let
			resolve;

		const promise = new Promise<V>((r) => {
			resolve = r;
		});

		const taskObj = {
			task,
			promise,
			resolve
		};

		this.tasks.push(taskObj);
		this.start();

		return taskObj.promise;
	}

	/** @inheritDoc */
	clone(): SimpleWorkerQueue<T, V> {
		const newQueue = new SimpleWorkerQueue<T, V>(this.worker);
		Object.assign(newQueue, this);

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
			taskObj = this.tasks.shift();

		if (!taskObj) {
			return;
		}

		const
			{task, promise, resolve} = taskObj;

		const cb = this.deferPerform.bind(this);
		promise.then(cb, cb);

		this.resolveTask(task, resolve);
	}
}
