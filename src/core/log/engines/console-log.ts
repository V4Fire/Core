/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { getStyle } from 'core/log/styles';
import { LogLevel } from 'core/log/interface';

const
	styleCache = Object.createDict<string>();

/**
 * Returns a string representing style for the specific logLevel
 * @param [logLevel] - level of log which needs a style
 */
function getStringifiedStyle(logLevel?: LogLevel): string {
	const
		level = logLevel || 'default',
		val = styleCache[level];

	if (val === undefined) {
		const
			style = getStyle(logLevel);

		const stringifiedStyle = Object.keys(style)
			.reduce((res, key) => res + `${key.dasherize()}:${style[key]};`, '');

		if (!stringifiedStyle) {
			return '';
		}

		return styleCache[level] = stringifiedStyle;
	}

	return val;
}

/**
 * Prints the specified parameters to a console
 *
 * @param context - logging context
 * @param [logLevel] - level of a current logging record
 * @param [details] - additional details
 */
export function log(context: string, logLevel?: LogLevel, ...details: unknown[]): void {
	console.log(`%c${context}`, getStringifiedStyle(logLevel), ...details);
}
