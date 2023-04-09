import type { EventEmitter2 } from 'eventemitter2';

import type {

	QueueChunk,
	LocalOptions

} from 'core/event-emitter/modules/stream/interface';

import type EventEmitter from 'core/event-emitter';

import type {

	HandlerValues,

	EmitterEvent,
	EventHandler

} from 'core/event-emitter/interface';

import { createsAsyncSemaphore } from 'core/event';

import { Queue } from 'core/queue';

/**
 *
 */
export default class Stream implements AsyncIterableIterator<HandlerValues> {
	/**
	 *
	 */
	protected readonly emitter: EventEmitter;

	/**
	 *
	 */
	protected readonly localEmitter: EventEmitter2;

	/**
	 *
	 */
	protected readonly events: EmitterEvent[];

	/**
	 *
	 */
	protected readonly queue: Queue<QueueChunk> = new Queue();

	/**
	 *
	 */
	protected readonly forbiddenEvents: Set<EmitterEvent> = new Set();

	/**
	 *
	 */
	protected readonly listeners: Map<EmitterEvent, EventHandler> = new Map();

	/**
	 *
	 */
	protected resolvePromise: Nullable<(value: IteratorResult<HandlerValues>) => void> = null;

	/**
	 *
	 */
	protected pendingPromise: Nullable<Promise<IteratorResult<HandlerValues>>> = null;

	/**
	 *
	 */
	protected isDone: boolean = false;

	/**
	 *
	 */
	protected returnAfterQueueIsEmpty: boolean = false;

	constructor(emitter: EventEmitter, localEmitter: EventEmitter2, events: EmitterEvent[]) {
		this.emitter = emitter;
		this.events = events;
		this.localEmitter = localEmitter;

		const terminateStream = () => {
			if (this.queue.length > 0) {
				this.returnAfterQueueIsEmpty = true;
			} else {
				void this.return();
			}
		};

		const
			semaphore = createsAsyncSemaphore(terminateStream, ...this.events);

		this.events.forEach((event) => {
			const handler: EventHandler = (...value) => {
				if (this.pendingPromise == null) {
					this.queue.push({event, value});
				} else {
					this.resolvePromise?.({done: false, value});
				}
			};

			this.listeners.set(event, handler);

			this.emitter.prepend(event, handler);

			this.localEmitter.once(`off.${event}`, (options?: LocalOptions) => {
				semaphore(event);

				if (options?.forbid) {
					this.forbiddenEvents.add(event);
				}
			});
		});
	}

	/**
	 *
	 */
	[Symbol.asyncIterator](): AsyncIterableIterator<HandlerValues> {
		return this;
	}

	/**
	 *
	 */
	next(): Promise<IteratorResult<HandlerValues>> {
		if (this.isDone) {
			return this.return();
		}

		if (this.queue.length > 0) {
			const
				chunk = this.getNextAvailableQueueChunk();

			if (chunk != null) {
				return Promise.resolve({done: false, value: chunk.value});
			}
		}

		if (this.returnAfterQueueIsEmpty) {
			return this.return();
		}

		return this.pendingPromise ??= createPromise.call(this);

		function createPromise(this: Stream): Promise<IteratorResult<HandlerValues>> {
			return new Promise((resolve) => {
				this.resolvePromise = (chunk) => {
					resolve(chunk);

					this.resolvePromise = null;
					this.pendingPromise = null;
				};
			});
		}
	}

	/**
	 *
	 */
	return(): Promise<IteratorReturnResult<undefined>> {
		const chunk: IteratorReturnResult<undefined> = {
			done: true,
			value: undefined
		};

		if (this.isDone) {
			return Promise.resolve(chunk);
		}

		this.resolvePromise?.(chunk);
		this.offAllListeners();

		this.queue.clear();
		this.forbiddenEvents.clear();
		this.listeners.clear();

		this.isDone = true;

		return Promise.resolve(chunk);
	}

	/**
	 *
	 */
	protected offAllListeners(): void {
		this.listeners.forEach((listener, event) => {
			this.emitter.off(event, listener);
		});
	}

	/**
	 *
	 */
	protected getNextAvailableQueueChunk(): Nullable<QueueChunk> {
		let
			chunk = this.queue.shift();

		while (chunk != null && this.forbiddenEvents.has(chunk.event)) {
			chunk = this.queue.shift()!;
		}

		return chunk;
	}
}
