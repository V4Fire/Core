/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createStyleCache } from 'core/log/config/styles';
import { LogLevel } from 'core/log/interface';
import { LogEngine } from 'core/log/engines/interface.js';
import { LogEvent } from 'core/log/middlewares';
import { LogStylesConfig, StylesCache } from 'core/log/config';

export class ConsoleEngine implements LogEngine {
	protected stylesCache?: StylesCache;
	protected stringifiedStylesCache: Dictionary<string> = Object.createDict();

	constructor(styles?: LogStylesConfig) {
		if (styles) {
			this.stylesCache = createStyleCache(styles);
		}
	}

	/**
	 * Prints the specified event to a console
	 * @param event - log event to print
	 */
	log(event: LogEvent): void {
		//#if runtime has core/log

		if (!event.details && !event.error) {
			console.log(`%c${event.context}`, this.getStringifiedStyle(event.level));

		} else {
			const
				details = [...event.details];

			if (event.error) {
				details.push(event.error);
			}

			console.log(`%c${event.context}`, this.getStringifiedStyle(event.level), ...details);
		}

		//#endif
	}

	/**
	 * Returns a string representing of a style for the specified log level
	 * @param logLevel - level of logging which needs a style
	 */
	protected getStringifiedStyle(logLevel: LogLevel): string {
		//#if runtime has core/log

		if (!this.stylesCache) {
			return '';
		}

		const
			val = this.stringifiedStylesCache[logLevel];

		if (val !== undefined) {
			return val;
		}

		const
			style = this.stylesCache.getStyle(logLevel);

		if (!style) {
			return '';
		}

		let
			stringifiedStyle = '';

		for (let keys = Object.keys(style), i = 0; i < keys.length; i++) {
			const key = keys[i];
			stringifiedStyle += `${key.dasherize()}:${style[key]};`;
		}

		if (!stringifiedStyle) {
			return '';
		}

		return this.stringifiedStylesCache[logLevel] = stringifiedStyle;

		//#endif
	}
}
