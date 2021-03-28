/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import type { AsyncStorageNamespace } from 'core/kv-storage';

import { emitter } from 'core/prelude/env/const';

export * from 'core/prelude/env/const';

const
	memoryStorage = Object.createDict<Dictionary>();

let
	storage: CanUndef<Promise<AsyncStorageNamespace>>;

//#if runtime has core/kv-storage
// eslint-disable-next-line prefer-const
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[ENV]]'));
//#endif

/**
 * Returns settings from the application environment by the specified key
 * @param key
 */
export async function get(key: string): Promise<CanUndef<Dictionary>> {
	if (Object.isPromise(storage)) {
		return (await storage).get<Dictionary>(key);
	}

	return memoryStorage[key];
}

/**
 * Added settings to the application environment by the specified key
 *
 * @param key
 * @param value
 */
export async function set(key: string, value: Dictionary): Promise<void> {
	if (Object.isPromise(storage)) {
		try {
			await (await storage).set(key, value);

		} catch (e) {
			stderr(e);
		}

	} else {
		memoryStorage[key] = value;
	}

	emitter.emit(`set.${key}`, value);
}

/**
 * Removes settings from the application environment by the specified key
 * @param key
 */
export async function remove(key: string): Promise<void> {
	if (Object.isPromise(storage)) {
		try {
			await (await storage).remove(key);

		} catch (e) {
			stderr(e);
		}

	} else {
		delete memoryStorage[key];
	}

	emitter.emit(`remove.${key}`);
}

extend(globalThis, 'envs', () => {
	if (Object.isPromise(storage)) {
		return storage.then((storage) => {
			console.log(storage);
			return storage;
		});
	}

	console.log(memoryStorage);
	return memoryStorage;
});

extend(globalThis, 'getEnv', (key) => get(key).then((val) => {
	console.log(val);
	return val;
}));

extend(globalThis, 'setEnv', set);
extend(globalThis, 'removeEnv', remove);
