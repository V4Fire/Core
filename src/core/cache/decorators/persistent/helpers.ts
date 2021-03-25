import type { SyncStorageNamespace, AsyncStorageNamespace } from 'core/kv-storage';

/**
 * The manager for working with the storage
 * collapses changes to the same properties
 * and performs changes only after the previous ones have been made
 */
export class StorageManager {
	/**
	 * Stores keys that will need to be updated at the next iteration
	 */
	private memory: {
		[key: string]: {
			value?: unknown;
			action: 'set' | 'remove';
			callback?(): void;
		};
	} = {};

	/**
	 * Storage object
	 */
	private readonly storage: SyncStorageNamespace | AsyncStorageNamespace;

	/**
	 * Promise used to ensure that the new iteration starts only after the old one ends
	 */
	private promise: Promise<unknown> = Promise.resolve();

	constructor(storage: SyncStorageNamespace | AsyncStorageNamespace) {
		this.storage = storage;
	}

	/**
	 * Create a task to set value to storage
	 * Can be combined with the task for the same key, then the callback will be executed only from the last task
	 *
	 * @param key
	 * @param value
	 * @param callback Executed when the value is saved in the storage
	 */
	set(key: string, value: unknown, callback?: () => void): void {
		this.changeElement(key, {
			action: 'set',
			value,
			callback
		});
	}

	/**
	 * Create a task to remove value from storage
	 * Can be combined with the task for the same key, then the callback will be executed only from the last task
	 *
	 * @param key
	 * @param value
	 * @param callback Executed when the value is removed from the storage
	 */
	remove(key: string, callback?: () => void): void {
		this.changeElement(key, {
			action: 'remove',
			callback
		});
	}

	/**
	 * The adapter is needed to have a standard set/remove API
	 * As soon as the first change occurs the state creates a task for updating the storage
	 *
	 * @param key
	 * @param parameters
	 */
	private changeElement(key: string, parameters: {
		action: 'set';
		value: unknown;
		callback?(): void;
	} | {
		action: 'remove';
		callback?(): void;
	}): void {
		this.memory[key] = parameters;

		if (Object.keys(this.memory).length === 1) {
			this.promise = this.promise.then(async () => {
				await this.makeIteration();
			});
		}
	}

	/**
	 * Executes all the tasks saved in the current iteration
	 * and creates a promise that will be resolved when all the tasks are completed
	 */
	private async makeIteration() {
		const
			clone = {...this.memory};
		this.memory = {};

		await Promise.all(Object.keys(clone).map((key) => {
			const promiseForKey = new Promise<void>(async (resolve) => {
				if (clone[key].action === 'remove') {
					await this.storage.remove(key);
				} else {
					await this.storage.set(key, clone[key].value);
				}

				const
					cb = clone[key].callback;

				if (cb) {
					cb();
				}

				resolve();
			});
			return promiseForKey;
		}));
	}
}
