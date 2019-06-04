/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogEvent, LogMiddleware } from 'core/log/middlewares';
import { LogEngine } from 'core/log/engines';
import { LogLevel } from 'core/log';
import { cmpLevels } from 'core/log/base';

export class LogPipeline {
	private engine!: LogEngine;
	private middlewares!: LogMiddleware[];
	private nextCallback!: (events: LogEvent | LogEvent[]) => void;
	private middlewareIndex: number = 0;
	private minLevel!: LogLevel;

	constructor(engine: LogEngine, middlewares: LogMiddleware[], minLevel: LogLevel) {
		this.engine = engine;
		this.middlewares = middlewares;
		this.nextCallback = this.next.bind(this);
		this.minLevel = minLevel;
	}

	/**
	 * Carries events through the chain of middlewares and passes them to the engine in the end
	 * @param events
	 */
	run(events: LogEvent | LogEvent[]): void {
		if (Array.isArray(events)) {
			events = events.filter((e) => cmpLevels(this.minLevel, e.level) >= 0);
			if (!events.length) {
				return;
			}

		} else {
			if (cmpLevels(this.minLevel, events.level) < 0) {
				return;
			}
		}

		this.middlewareIndex = -1; // ++ in next method
		this.next(events);
	}

	private next(events: LogEvent | LogEvent[]): void {
		this.middlewareIndex++;
		if (this.middlewareIndex < this.middlewares.length) {
			if (!this.middlewares[this.middlewareIndex]) {
				throw new Error(`Can't find middleware at index [${this.middlewareIndex}]`);
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
	}
}
