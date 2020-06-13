/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { AnalyticEngine } from 'core/analytics/interface';

/**
 * Sends an analytic event with the specified details
 *
 * @abstract
 * @param event - event name
 * @param [details] - event details
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
const sendAnalyticsEvent: AnalyticEngine = (event, details) => {
	// Need some implementation
};

export default sendAnalyticsEvent;
