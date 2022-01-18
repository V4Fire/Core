/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Queue from 'core/queue/simple';
import StreamController from 'core/request/stream-controller/abstract';

export default class SimpleStreamController<ItemType = unknown>
	extends StreamController<ItemType, Queue<ItemType>> {
	/**
	 * Returns an iterator allowing to go through buffer
	 * That is extendable iterator, that can yield {done: true} after {done: false} if there are new not read items
	 */
	[Symbol.iterator](): Iterator<ItemType> {
		const
			{buffer} = this;

		return <Iterator<ItemType>>{
			next() {
				return {
					done: buffer.length === 0,
					value: buffer.pop()
				};
			}
		};
	}

	/**
	 * Creates buffer container
	 *
	 * @param [init]
	 */
	protected override createBuffer(init?: Iterable<ItemType>): Queue<ItemType> {
		const
			queue = new Queue<ItemType>();

		if (init == null) {
			return queue;
		}

		for (const item of init) {
			queue.push(item);
		}

		return queue;
	}
}
