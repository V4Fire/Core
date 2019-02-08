/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { getStyle } from 'core/log/engines/styles';
import { LogLevel } from 'core/log/types';

/**
 * Prints the specified parameters to a console
 *
 * @param context - logging context
 * @param [logLevel] - level of a current logging record
 * @param [details] - additional details
 */
export function log(context: string, logLevel?: LogLevel, ...details: unknown[]): void {
	const
		style = getStyle(logLevel);

	console.log(
		`%c${context}`,

		$C(style).to('')
			.reduce((res, value, key) => res + `${key.dasherize()}:${value};`),

		...details
	);
}
