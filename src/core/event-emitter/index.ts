import { isEmitterEvent } from 'core/event-emitter/helpers';

import { defaultOptions } from 'core/event-emitter/const';

import Stream from 'core/event-emitter/modules/stream';

import { createsAsyncSemaphore } from 'core/event';

import type {

	EmitterEngine,
	EmitterEngineFactory,

	EmitterOptions,
	EmitterEvent,

	EventHandler,
	HandlerValues

} from 'core/event-emitter/interface';

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
	on(events: CanIterable<EmitterEvent>, handler: EventHandler): void;

	/**
	 *
	 */
	on(events: CanIterable<EmitterEvent>): AsyncIterableIterator<HandlerValues>;

	on(events: CanIterable<EmitterEvent>, handler?: EventHandler): CanVoid<AsyncIterableIterator<HandlerValues>> {
		const
			eventsArr = this.normalizeEvents(events);

		if (handler == null) {
			return new Stream(this, eventsArr);
		}

		eventsArr.forEach((event) => this.engine.on(event, handler));
	}

	/**
	 *
	 */
	once(events: CanIterable<EmitterEvent>, handler: EventHandler): void;

	/**
	 *
	 */
	once(events: CanIterable<EmitterEvent>): AsyncIterableIterator<HandlerValues>;

	/**
	 *
	 */
	once(events: CanIterable<EmitterEvent>, handler?: EventHandler): CanVoid<AsyncIterableIterator<HandlerValues>> {
		const
			eventsArr = this.normalizeEvents(events);

		const
			// Creating the stream here so that it can subscribe to the "off.event" event
			stream = handler == null ? new Stream(this, eventsArr) : null;

		for (const event of eventsArr) {
			const wrapper: EventHandler = (...params) => {
				if (handler == null) {
					this.emit(`off.${event}`);
				} else {
					handler(...params);
				}

				this.off(event, wrapper);
			};

			this.on(event, wrapper);
		}

		if (stream != null) {
			return stream;
		}
	}

	/**
	 *
	 */
	any(events: CanIterable<EmitterEvent>, handler: EventHandler): void;

	/**
	 *
	 */
	any(events: CanIterable<EmitterEvent>): AsyncIterableIterator<HandlerValues>;

	/**
	 *
	 */
	any(events: CanIterable<EmitterEvent>, handler?: EventHandler): CanVoid<AsyncIterableIterator<HandlerValues>> {
		const
			eventsArr = this.normalizeEvents(events),
			map = new Map<string, EventHandler>();

		const
			// Creating the stream here so that it can subscribe to the "off.event" event
			stream = handler == null ? new Stream(this, eventsArr) : null;

		for (const event of eventsArr) {
			const wrapper: EventHandler = (...params) => {
				if (handler == null) {
					void stream?.return();
				} else {
					handler(...params);
				}

				map.forEach((handler, event) => this.off(event, handler));
			};

			this.on(event, wrapper);
			map.set(event, wrapper);
		}

		if (stream != null) {
			return stream;
		}
	}

	/**
	 *
	 */
	off(events?: CanIterable<EmitterEvent>, handler?: EventHandler): void {
		const
			emitOff = (e: string) => this.emit(`off.${e}`);

		if (events == null) {
			this.engine.getEvents().forEach(emitOff);

			this.engine.offAll();

			return;
		}

		for (const event of this.normalizeEvents(events)) {
			if (handler == null) {
				emitOff(event);

				this.engine.offAll(event);
			} else {
				this.engine.off(event, handler);

				if (!this.engine.hasListeners(event)) {
					emitOff(event);
				}
			}
		}

	}

	/**
	 *
	 */
	emit(events: CanIterable<EmitterEvent>, ...values: HandlerValues): void {
		for (const event of this.normalizeEvents(events)) {
			this.engine.emit(event, ...values);
		}
	}

	/**
	 *
	 */
	protected normalizeEvents(event: CanIterable<EmitterEvent>): EmitterEvent[] {
		return isEmitterEvent(event) ? [event] : [...event];
	}
}
