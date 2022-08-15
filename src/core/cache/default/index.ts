/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/default/README.md]]
 * @packageDocumentation
 */

import SimpleCache from 'core/cache/simple';

export * from 'core/cache/interface';

/**
 * Implementation for a simple in-memory cache data structure
 *
 * @typeparam K - key type
 * @typeparam V - value type
 */
export default class DefaultCache<K = unknown, V = unknown> extends SimpleCache<K, V> {
	/**
	 * Function that returns a value which would be set as default value
	 */
	defaultFactory: () => V;

	/**
	 * @param [defaultFactory] - function that returns a value which would be set as default value
	 */
	constructor(defaultFactory: () => V) {
		super();

		this.defaultFactory = defaultFactory;
	}

	/** @see [[Cache.get]] */
	override get(key: K): CanUndef<V> {
		if (!this.storage.has(key)) {
			this.storage.set(key, this.defaultFactory());
		}

		return this.storage.get(key);
	}

	/** @see [[Cache.clone]] */
	override clone(): DefaultCache<K, V> {
		const
			newCache = new DefaultCache<K, V>(this.defaultFactory),
			mixin = {storage: new Map(this.storage)};

		Object.assign(newCache, mixin);

		return newCache;
	}
}
