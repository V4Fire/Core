/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createStyleCache } from 'core/log/config/styles';
import { LogLevel } from 'core/log/interface';
import { LogEngine } from 'core/log/engines/types';
import { LogEvent } from 'core/log/loggers';
import { LogStylesConfig, StylesCache } from 'core/log/config';

export class ConsoleEngine implements LogEngine {
	private stylesCache?: StylesCache;
	private stringifiedStylesCache: Dictionary<string> = Object.createDict();

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
		if (!event.details && !event.error) {
			console.log(`%c${event.context}`, this.getStringifiedStyle(event.level));

		} else {
			const
				details = [...event.details];

			if (!!event.error) {
				details.concat(event.error);
			}

			console.log(`%c${event.context}`, this.getStringifiedStyle(event.level), ...details);
		}
	}

	/**
	 * Returns a string representing style for the specific logLevel
	 * @param logLevel - level of log which needs a style
	 */
	private getStringifiedStyle(logLevel: LogLevel): string {
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

		const stringifiedStyle = Object.keys(style)
			.reduce((res, key) => res + `${key.dasherize()}:${style[key]};`, '');

		if (!stringifiedStyle) {
			return '';
		}

		return this.stringifiedStylesCache[logLevel] = stringifiedStyle;
	}
}
