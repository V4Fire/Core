/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogEvent, LogMiddleware } from 'core/log/middlewares';
import { LogEngine } from 'core/log/engines';
import { LogLevel } from 'core/log/interface';
import { cmpLevels } from 'core/log/base';

export class LogPipeline {
	protected engine!: LogEngine;
	protected middlewares!: LogMiddleware[];
	protected nextCallback!: (events: CanArray<LogEvent>) => void;
	protected middlewareIndex: number = 0;
	protected minLevel!: LogLevel;

	constructor(engine: LogEngine, middlewares: LogMiddleware[], minLevel: LogLevel) {
		this.engine = engine;
		this.middlewares = middlewares;
		this.nextCallback = this.next.bind(this);
		this.minLevel = minLevel;
	}

	/**
	 * Carries events through a chain of middlewares and passes them to the engine in the end
	 * @param events
	 */
	run(events: CanArray<LogEvent>): void {
		//#if runtime has core/log

		if (Array.isArray(events)) {
			const
				filteredEvents = <LogEvent[]>[];

			for (let i = 0; i < events.length; i++) {
				const
					el = events[i];

				if (cmpLevels(this.minLevel, el.level) >= 0) {
					filteredEvents.push(el);
				}
			}

			if (!filteredEvents.length) {
				return;
			}

			events = filteredEvents;

		} else if (cmpLevels(this.minLevel, events.level) < 0) {
			return;
		}

		// ++ in next method
		this.middlewareIndex = -1;
		this.next(events);

		//#endif
	}

	protected next(events: CanArray<LogEvent>): void {
		//#if runtime has core/log

		this.middlewareIndex++;
		if (this.middlewareIndex < this.middlewares.length) {
			if (!this.middlewares[this.middlewareIndex]) {
				throw new ReferenceError(`Can't find a middleware at the index [${this.middlewareIndex}]`);
			}

			this.middlewares[this.middlewareIndex].exec(events, this.nextCallback);

		} else {
			if (Array.isArray(events)) {
				for (let i = 0; i < events.length; ++i) {
					this.engine.log(events[i]);
				}

			} else {
				this.engine.log(events);
			}
		}

		//#endif
	}
}
