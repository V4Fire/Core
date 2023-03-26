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

		for (const event of eventsArr) {
			const wrapper: EventHandler = (...params) => {
				handler?.(...params);

				this.off(event, wrapper);
			};

			this.on(event, wrapper);
		}

		if (handler == null) {
			return new Stream(this, eventsArr);
		}
	}

	/**
	 *
	 */
	off(events?: CanIterable<EmitterEvent>, handler?: EventHandler): void {
		const emitOff = (e: string) => this.emit(`off.${e}`);

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
