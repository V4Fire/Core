/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogLevel } from 'core/log';

export const DEFAULT_LEVEL: LogLevel = 'info';

type LogLevelOrder = Record<LogLevel, number>;

const order: LogLevelOrder = {
	error: 1,
	warn: 2,
	info: 3
};

/**
 * Compares log levels.
 * If left < right returns < 0.
 * If left > right returns > 0.
 * If left === right returns 0.
 * Non existing levels always lose.
 *
 * @param left
 * @param right
 */
export function cmpLevels(left: LogLevel, right: LogLevel): number {
	if (!order[left] && !order[right]) {
		return 0;

	} else if (!order[left]) {
		return -1;

	} else if (!order[right]) {
		return 1;
	}

	return order[left] - order[right];
}
