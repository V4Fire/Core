/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';
import type { LogEvent, LogMiddleware, NextCallback } from 'core/log/middlewares/interface';

interface LogOptions {
	patterns?: Array<RegExp | string>;
	removeDuplicates?: boolean;
}

interface NormalizedLogOptions {
	patterns?: RegExp[];
	removeDuplicates?: boolean;
}

class DuplicatesFilter {
	protected errorsSet: WeakSet<Error> = new WeakSet();

	check(event: LogEvent): boolean {
		//#if runtime has core/log

		if (event.error != null) {
			if (this.errorsSet.has(event.error)) {
				return false;
			}

			this.errorsSet.add(event.error);
		}

		//#endif

		return true;
	}
}

class LogOpts {
	protected ready: boolean = false;

	protected opts?: NormalizedLogOptions = {
		patterns: [/:error\\b/],
		removeDuplicates: true
	};

	protected filters: Array<(event: LogEvent) => boolean> = [];

	constructor(namespaceOrConfig: string | CanUndef<LogOptions>) {
		this.setConfig = this.setConfig.bind(this);

		if (Object.isString(namespaceOrConfig)) {
			// Хз как тут правильно namespace задать
			env.get(`${namespaceOrConfig}.log`).then(this.setConfig, this.setConfig);
			env.emitter.on(`set.${namespaceOrConfig}.log`, this.setConfig);
			env.emitter.on(`set.${namespaceOrConfig}.log`, this.setConfig);

		} else {
			this.setConfig(namespaceOrConfig);
		}
	}

	get isReady(): boolean {
		return this.ready;
	}

	checkEvent(event: LogEvent): boolean {
		if (this.filters.length > 0) {
			return this.filters.every((filter) => filter(event));
		}

		return true;
	}

	protected setConfig(opts?: LogOptions) {
		this.ready = true;
		this.opts = this.prepare(opts);
		this.initFilters();
	}

	protected prepare(opts?: LogOptions): CanUndef<NormalizedLogOptions> {
		if (!Object.isPlainObject(opts)) {
			return undefined;
		}

		if (Object.isArray(opts.patterns)) {
			opts.patterns = opts.patterns.map(
				(pattern) => Object.isRegExp(pattern) ? pattern : new RegExp(pattern)
			);
		}

		return Object.mixin({deep: true}, this.opts, opts);
	}

	protected initFilters(): void {
		this.filters = [];

		if (Object.isArray(this.opts?.patterns) && this.opts!.patterns.length > 0) {
			this.filters.push(this.filterContext);
		}

		if (Object.isTruly(this.opts?.removeDuplicates)) {
			this.filters.push((new DuplicatesFilter()).check);
		}
	}

	/**
	 * Returns true if config patterns allow to log a record with the specified context
	 * @param event
	 */
	protected filterContext(event: LogEvent): boolean {
		//#if runtime has core/log

		return this.opts!.patterns!.some((pattern) => pattern.test(event.context));

		//#endif

		return true;
	}

}

export class ConfigurableMiddleware implements LogMiddleware {
	protected queue: LogEvent[] = [];

	protected options: LogOpts;

	constructor(namespace: string) {
		this.options = new LogOpts(namespace);
	}

	exec(events: CanArray<LogEvent>, next: NextCallback): void {
		//#if runtime has core/log

		if (!this.options.isReady) {
			if (Array.isArray(events)) {
				this.queue.push(...events);

			} else {
				this.queue.push(events);
			}

			return;
		}

		if (this.queue.length > 0) {
			events = this.queue.concat(events);

			this.queue = [];
		}

		if (Object.isArray(events)) {
			events = events.filter((event) => this.options.checkEvent(event));

			if (events.length > 0) {
				next(events);
			}

		} else if (this.options.checkEvent(events)) {
			next(events);
		}

		//#endif
	}
}
