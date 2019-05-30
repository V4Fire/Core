/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogEvent, LogMiddleware } from 'core/log/middlewares';
import { LogEngine } from 'core/log/engines';

export class LogPipeline {
	private engine!: LogEngine;
	private middlewares!: LogMiddleware[];
	private nextCallback!: (events: LogEvent | LogEvent[]) => void;
	private middlewareIndex: number = 0;

	constructor(engine: LogEngine, middlewares: LogMiddleware[]) {
		this.engine = engine;
		this.middlewares = middlewares;
		this.nextCallback = this.next.bind(this);
	}

	/**
	 * Carries events through the chain of middlewares and passes them to the engine in the end
	 * @param events
	 */
	run(events: LogEvent | LogEvent[]): void {
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
