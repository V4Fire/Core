import type {

	EmitterEngine,
	EmitterEngineFactory,

	EmitterOptions,
	EmitterEvent,

	EventHandler,
	HandlerValues,
	HandlerParameters,

	OffOptions

} from 'core/event-emitter/interface';

import { defaultOptions } from 'core/event-emitter/const';

import Stream from 'core/event-emitter/modules/stream';
import createEmitterPromise from 'core/event-emitter/modules/promise';

export * from 'core/event-emitter/interface';

/**
 *
 */
export default class EventEmitter<T extends EmitterEngineFactory = typeof defaultOptions.engine> {
	/**
	 *
	 */
	protected readonly options: Required<EmitterOptions>;

	/**
	 *
	 */
	protected readonly engine: EmitterEngine;

	constructor(options: EmitterOptions<T> = {}) {
		this.options = Object.mixin(true, defaultOptions, options);
		this.engine = this.options.engine(this.options.engineOptions);
	}

	/**
	 *
	 */
	on(events: CanArray<EmitterEvent>, handler: EventHandler): void;

	/**
	 *
	 */
	on(events: CanArray<EmitterEvent>): AsyncIterableIterator<HandlerValues>;

	on(events: CanArray<EmitterEvent>, handler?: EventHandler): CanVoid<AsyncIterableIterator<HandlerValues>> {
		events = this.normalizeEvents(events);

		if (handler == null) {
			return new Stream(this, events);
		}

		events.forEach((event) => this.engine.on(event, handler));
	}

	/**
	 *
	 */
	promifisy(events: CanArray<EmitterEvent>): Promise<HandlerParameters> {
		return createEmitterPromise(this, this.normalizeEvents(events));
	}

	/**
	 *
	 */
	once(events: CanArray<EmitterEvent>, handler: EventHandler): void;

	/**
	 *
	 */
	once(events: CanArray<EmitterEvent>): AsyncIterableIterator<HandlerValues>;

	/**
	 *
	 */
	once(events: CanArray<EmitterEvent>, handler?: EventHandler): CanVoid<AsyncIterableIterator<HandlerValues>> {
		events = this.normalizeEvents(events);

		for (const event of events) {
			const wrapper: EventHandler = (...params) => {
				handler?.(...params);

				this.off(event, wrapper);
			};

			this.on(event, wrapper);
		}

		if (handler == null) {
			return new Stream(this, events);
		}
	}

	/**
	 *
	 */
	off(events?: CanArray<EmitterEvent>, handler?: EventHandler, options?: OffOptions): void {
		const
			{emit = true} = options ?? {};

		if (events == null) {
			if (emit) {
				this.engine.getEvents().forEach((event) => this.emit(`off.${event}`));
			}

			this.engine.offAll();

			return;
		}

		for (const event of this.normalizeEvents(events)) {
			if (emit) {
				this.emit(`off.${event}`);
			}

			if (handler == null) {
				this.engine.offAll(event);
			} else {
				this.engine.off(event, handler);
			}
		}
	}

	/**
	 *
	 */
	emit(events: CanArray<EmitterEvent>, ...params: HandlerValues): void {
		for (const event of this.normalizeEvents(events)) {
			this.engine.emit(event, ...params, {event});
		}
	}

	/**
	 *
	 */
	protected normalizeEvents(event: CanArray<EmitterEvent>): EmitterEvent[] {
		return Array.isArray(event) ? event : [event];
	}
}

