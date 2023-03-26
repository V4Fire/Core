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
	protected readonly events: EmitterEvent[];

	/**
	 *
	 */
	protected readonly queue: Queue<HandlerValues> = new Queue();

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
	protected returnAfterEmptyQueue: boolean = false;

	constructor(emitter: EventEmitter, events: EmitterEvent[]) {
		this.emitter = emitter;
		this.events = events;

		const terminateStream = () => {
			if (this.queue.length > 0) {
				this.returnAfterEmptyQueue = true;
			} else {
				void this.return();
			}
		};

		const
			semaphore = createsAsyncSemaphore(terminateStream, ...this.events);

		for (const event of this.events) {
			this.emitter.on(event, this.onEvent);
			this.emitter.once(`off.${event}`, () => semaphore(event));
		}
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
			const value = this.queue.shift()!;
			return Promise.resolve({done: false, value});
		}

		if (this.returnAfterEmptyQueue) {
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

		this.isDone = true;

		return Promise.resolve(chunk);
	}

	/**
	 *
	 */
	protected offAllListeners(): void {
		this.emitter.off(this.events, this.onEvent);
	}

	/**
	 *
	 */
	protected onEvent: EventHandler = (...value) => {
		if (this.pendingPromise == null) {
			this.queue.push(value);
		} else {
			this.resolvePromise?.({done: false, value});
		}
	};
}
