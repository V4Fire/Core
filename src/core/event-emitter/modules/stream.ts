import type EventEmitter from 'core/event-emitter';

import type { HandlerParameters, EmitterEvent, EventHandler } from 'core/event-emitter/interface';

/**
 *
 */
export default class Stream implements AsyncIterableIterator<HandlerParameters> {
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
	protected resolvePromise: Nullable<(params: IteratorResult<HandlerParameters>) => void> = null;

	/**
	 *
	 */
	protected pendingPromise: Nullable<Promise<IteratorResult<HandlerParameters>>> = null;

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

		for (const event of events) {
			const handler: EventHandler = (params) => {
				this.resolvePromise?.({done: false, value: params});

				this.resolvePromise = null;
				this.pendingPromise = null;
			};

			this.handlers.set(event, handler);

			this.emitter.on(event, handler);

			this.emitter.on(`off.${event}`, () => {
				this.events.delete(event);
				this.emitter.off(event, handler);

				if (this.events.size === 0) {
					void this.return();
				}
			});
		}
	}

	/**
	 *
	 */
	[Symbol.asyncIterator](): AsyncIterableIterator<HandlerParameters> {
		return this;
	}

	/**
	 *
	 */
	next(): Promise<IteratorResult<HandlerParameters>> {
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
