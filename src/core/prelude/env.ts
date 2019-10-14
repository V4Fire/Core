/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { AsyncNamespace } from 'core/kv-storage';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

/**
 * Link to the global object
 */
export const
	GLOBAL = Function('return this')();

/**
 * True if NodeJS runtime
 */
export const IS_NODE: boolean = (() => {
	try {
		const
			// tslint:disable-next-line
			process = globalThis['process'];

		// @ts-ignore
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch {
		return false;
	}
})();

/**
 * True if the current runtime has window object
 */
export const HAS_WINDOW: boolean = typeof window === 'object';

export const
	event = new EventEmitter({maxListeners: 1e3, newListener: false});

const
	memoryStorage = Object.createDict<Dictionary>();

let
	storage: CanUndef<Promise<AsyncNamespace>>;

//#if runtime has core/kv-storage
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
