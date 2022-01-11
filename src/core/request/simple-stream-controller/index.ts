/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createControllablePromise } from 'core/request/utils';

export default class SimpleStreamController<ItemType = unknown> {
	/**
	 * Container that holds all set items
	 */
	protected readonly items: ItemType[];

	/**
	 * Current pending promise that resolves when a new item is added or the stream is closed,
	 * or rejects when the stream is destroyed
	 */
	protected pendingPromise: ReturnType<typeof createControllablePromise> | null;

	constructor() {
		this.items = [];
		this.pendingPromise = createControllablePromise();
	}

	/**
	 * Adds provided item to the stream if the stream is open otherwise it does nothing
	 *
	 * @param item - item to add
	 */
	add(item: ItemType): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.items.push(item);
		this.pendingPromise.resolveNow();
		this.pendingPromise = createControllablePromise();
	}

	/**
	 * Closes the stream
	 */
	close(): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.pendingPromise.resolveNow();
		this.pendingPromise = null;
	}

	/**
	 * Returns an iterator allowing to go through all items that were already added
	 */
	*[Symbol.iterator](): Generator<ItemType> {
		const
			items = this.items.slice();

		for (const item of items) {
			yield item;
		}
	}

	/**
	 * Destroys the stream
	 *
	 * @param [reason] - reason of destroying the stream
	 */
	destroy<R = unknown>(reason?: R): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.pendingPromise.rejectNow(reason ?? Error('Stream was destroyed'));
		this.pendingPromise = null;
	}

	/**
	 * Returns an async iterator allowing to go through the stream
	 */
	async*[Symbol.asyncIterator](): AsyncGenerator<ItemType> {
		const
			{items} = this;

		let
			pos = 0;

		while (true) {
			if (pos < items.length) {
				yield items[pos++];
				continue;
			}

			if (this.pendingPromise == null) {
				return;
			}

			await this.pendingPromise;
		}
	}
}
