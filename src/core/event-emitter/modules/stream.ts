import type EventEmitter from 'core/event-emitter';

import type { HandlerValues, EmitterEvent, EventHandler } from 'core/event-emitter/interface';

import { createsAsyncSemaphore } from 'core/event';

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
	protected readonly events: Set<EmitterEvent>;

	/**
	 *
	 */
	protected resolvePromise: Nullable<(params: IteratorResult<HandlerValues>) => void> = null;

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
	protected handlers: Map<EmitterEvent, EventHandler> = new Map();

	constructor(emitter: EventEmitter, events: EmitterEvent[]) {
		this.emitter = emitter;
		this.events = new Set(events);

		const
			semaphore = createsAsyncSemaphore(this.return.bind(this), ...this.events);

		for (const event of this.events) {
			const resolveCurrentPromise: EventHandler = (...params) => {
				this.resolvePromise?.({done: false, value: params});

				this.resolvePromise = null;
				this.pendingPromise = null;
			};

			this.handlers.set(event, resolveCurrentPromise);

			this.emitter.on(event, resolveCurrentPromise);

			this.emitter.once(`off.${event}`, () => {
				this.emitter.off(event, resolveCurrentPromise);
				semaphore(event);
			});
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

		return this.pendingPromise ??= new Promise((resolve) => this.resolvePromise = resolve);
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
		this.offAllHandlers();

		this.resolvePromise = null;
		this.pendingPromise = null;
		this.isDone = true;

		return Promise.resolve(chunk);
	}

	/**
	 *
	 */
	throw(): any {
		return <any>null;
	}

	protected offAllHandlers(): void {
		for (const [event, handler] of this.handlers) {
			this.emitter.off(event, handler);
		}
	}
}
