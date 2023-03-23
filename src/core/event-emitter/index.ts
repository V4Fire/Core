import type {

	EmitterEngine,
	EmitterEngineFactory,

	EmitterOptions,
	EmitterEvent,

	EventHandler,
	HandlerParameters

} from 'core/event-emitter/interface';

import { defaultOptions } from 'core/event-emitter/const';

import Stream from 'core/event-emitter/modules/stream';

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
	on(events: CanArray<EmitterEvent>, handler: EventHandler): void {
		this.normalizeEvents(events).forEach((event) => this.engine.on(event, handler));
	}

	/**
	 *
	 */
	stream(events: CanArray<EmitterEvent>): AsyncIterableIterator<HandlerParameters> {
		return new Stream(this, this.normalizeEvents(events));
	}

	/**
	 *
	 */
	off(events?: CanArray<EmitterEvent>, handler?: EventHandler): void {
		if (events == null) {
			this.engine.getEvents().forEach((event) => this.emit(`off.${event}`));

			this.engine.offAll();

			return;
		}

		for (const event of this.normalizeEvents(events)) {
			this.emit(`off.${event}`);

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
	emit(events: CanArray<EmitterEvent>, data?: unknown): void {
		for (const event of this.normalizeEvents(events)) {
			this.engine.emit(event, {data, event});
		}
	}

	/**
	 *
	 */
	protected normalizeEvents(event: CanArray<EmitterEvent>): EmitterEvent[] {
		return Array.isArray(event) ? event : [event];
	}
}
