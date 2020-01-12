/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/analytics/README.md]]
 * @packageDocumentation
 */

import sendAnalyticsEvent from 'core/analytics/engines';

/**
 * Sends an analytic event with the specified details
 *
 * @param event - event name
 * @param [details] - event details
 */
export function send(event: string, details: Dictionary = {}): void {
	const
		finalDetails = {};

	for (let keys = Object.keys(details), i = 0; i < keys.length; i++) {
		const
			key = keys[i],
			el = details[key];

		if (el != null && el !== '' && (typeof el === 'object' ? Object.size(el) : true)) {
			finalDetails[key] = el;
		}
	}

	sendAnalyticsEvent(event, finalDetails);
}
