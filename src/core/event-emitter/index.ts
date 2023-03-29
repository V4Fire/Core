import { EventEmitter2 } from 'eventemitter2';

import { isEmitterEvent } from 'core/event-emitter/helpers';

import { defaultOptions } from 'core/event-emitter/const';

import Stream from 'core/event-emitter/modules/stream';

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

	/**
	 *
	 */
	protected readonly localEmitter: EventEmitter2 = new EventEmitter2();

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
			return new Stream(this, this.localEmitter, eventsArr);
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
			eventsArr = this.normalizeEvents(events),
			stream = this.getStream(handler, eventsArr);

		eventsArr.forEach((event) => {
			const wrapper: EventHandler = (...params) => {
				if (handler == null) {
					this.localEmitter.emit(`off.${event}`, {forbid: true});
				} else {
					handler(...params);
				}

				this.off(event, wrapper);
			};

			this.on(event, wrapper);
		});

		if (stream != null) {
			return stream;
		}
	}

	/**
	 *
	 */
	any(events: Iterable<EmitterEvent>, handler: EventHandler): void;

	/**
	 *
	 */
	any(events: Iterable<EmitterEvent>): AsyncIterableIterator<HandlerValues>;

	/**
	 *
	 */
	any(events: Iterable<EmitterEvent>, handler?: EventHandler): CanVoid<AsyncIterableIterator<HandlerValues>> {
		const
			eventsArr = this.normalizeEvents(events),
			handlers = new Map<string, EventHandler>(),
			stream = this.getStream(handler, eventsArr);

		eventsArr.forEach((event) => {
			const wrapper: EventHandler = (...params) => {
				if (handler == null) {
					void stream?.return();
				} else {
					handler(...params);
				}

				handlers.forEach((handler, event) => this.off(event, handler));
			};

			this.on(event, wrapper);
			handlers.set(event, wrapper);
		});

		if (stream != null) {
			return stream;
		}
	}

	/**
	 *
	 */
	off(events?: CanIterable<EmitterEvent>, handler?: EventHandler): void {
		const emitOff = (e: string) => {
			this.localEmitter.emit(`off.${e}`);
		};

		if (events == null) {
			this.engine.getEvents().forEach(emitOff);

			this.engine.offAll();

			return;
		}

		this.normalizeEvents(events).forEach((event) => {
			if (handler == null) {
				emitOff(event);

				this.engine.offAll(event);
			} else {
				this.engine.off(event, handler);

				if (!this.engine.hasListeners(event)) {
					emitOff(event);
				}
			}
		});
	}

	/**
	 *
	 */
	emit(events: CanIterable<EmitterEvent>, ...values: HandlerValues): void {
		this.normalizeEvents(events).forEach((event) => {
			this.engine.emit(event, ...values);
		});
	}

	/**
	 *
	 */
	protected normalizeEvents(event: CanIterable<EmitterEvent>): EmitterEvent[] {
		return isEmitterEvent(event) ? [event] : [...new Set(event)];
	}

	/**
	 *
	 */
	protected getStream(handler: Nullable<EventHandler>, eventsArr: EmitterEvent[]): Nullable<Stream> {
		if (handler != null) {
			return;
		}

		return new Stream(this, this.localEmitter, eventsArr);
	}
}
