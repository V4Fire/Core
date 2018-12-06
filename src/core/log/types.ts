/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogStyles extends Dictionary {
	default: Dictionary;
}

export interface LogPreferences extends Dictionary {
	styles?: LogStyles;
}
