/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import StreamController from 'core/request/stream-controller/abstract';

export default class PersistentStreamController<ItemType = unknown>
	extends StreamController<ItemType, ItemType[]> {
	/**
	 * Returns an iterator allowing to go through buffer
	 * That is extendable iterator, that can yield {done: true} after {done: false} if there are new not read items
	 */
	[Symbol.iterator](): Iterator<ItemType> {
		const
			{buffer} = this;

		let
			pos = 0;

		return <Iterator<ItemType>>{
			next() {
				const
					hasNext = pos < buffer.length;

				return {
					done: !hasNext,
					value: hasNext ? buffer[pos++] : undefined
				};
			}
		};
	}

	/**
	 * Creates buffer container
	 *
	 * @param [init]
	 */
	protected override createBuffer(init?: Iterable<ItemType>): ItemType[] {
		return init ? [...init] : [];
	}
}
