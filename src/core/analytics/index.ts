/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import sendAnalyticsEvent from 'core/analytics/engines';

/**
 * Sends an analytic event with the specified parameters
 *
 * @param event - event name
 * @param [details] - event details
 */
export function send(event: string, details: Dictionary = {}): void {
	details = $C(details).filter((el) => el != null && (typeof el === 'object' ? $C(el).length() : el)).map();
	sendAnalyticsEvent(event, details);
}
