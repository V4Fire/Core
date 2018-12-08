/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { GLOBAL } from 'core/const/links';
import { AsyncNamespace } from 'core/kv-storage';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export const
	event = new EventEmitter({maxListeners: 1e3});

const
	memoryStorage = Object.createDict<Dictionary>();

let
	storage: CanUndef<Promise<AsyncNamespace>>;

//#if runtime has kv-storage
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[ENV]]'));
//#endif

/**
 * Returns settings from the app environment by the specified key
 * @param key
 */
export async function get(key: string): Promise<CanUndef<Dictionary>> {
	if (Object.isPromise(storage)) {
		return (await storage).get<Dictionary>(key);
	}

	return memoryStorage[key];
}

/**
 * Added settings to the app environment by the specified key
 *
 * @param key
 * @param value
 */
export function set(key: string, value: Dictionary): void {
	if (Object.isPromise(storage)) {
		storage.then((storage) => storage.set(key, value)).catch(stderr);

	} else {
		memoryStorage[key] = value;
	}

	event.emit(`set.${key}`, value);
}

/**
 * Removes settings from the app environment by the specified key
 * @param key
 */
export function remove(key: string): void {
	if (Object.isPromise(storage)) {
		storage.then((storage) => storage.remove(key)).catch(stderr);

	} else {
		delete memoryStorage[key];
	}

	event.emit(`remove.${key}`);
}

extend(GLOBAL, 'envs', () => {
	if (Object.isPromise(storage)) {
		return storage.then((storage) => {
			console.log(storage);
			return storage;
		});
	}

	console.log(memoryStorage);
	return memoryStorage;
});

extend(GLOBAL, 'getEnv', (key) => get(key).then((val) => {
	console.log(val);
	return val;
}));

extend(GLOBAL, 'setEnv', () => set);
extend(GLOBAL, 'removeEnv', () => remove);
