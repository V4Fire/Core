import { createControllablePromise } from 'core/request/utils';

export default class SimpleStreamController<ItemType = unknown> {
	public readonly items: ItemType[];
	protected pendingPromise: ReturnType<typeof createControllablePromise> | null;

	constructor() {
		this.items = [];
		this.pendingPromise = createControllablePromise();
	}

	add(item: ItemType): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.items.push(item);
		this.pendingPromise.resolveNow();
		this.pendingPromise = createControllablePromise();
	}

	close(): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.pendingPromise.resolveNow();
		this.pendingPromise = null;
	}

	*[Symbol.iterator](): Generator<ItemType> {
		for (const item of this.items) {
			yield item;
		}
	}

	destroy<R = unknown>(reason?: R): void {
		if (this.pendingPromise == null) {
			return;
		}

		this.pendingPromise.rejectNow(reason ?? Error('Stream was destroyed'));
		this.pendingPromise = null;
	}

	async*[Symbol.asyncIterator](): AsyncGenerator<ItemType> {
		const {items} = this;

		let pos = 0;

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
