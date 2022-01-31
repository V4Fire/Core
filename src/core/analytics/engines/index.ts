/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { unimplement } from 'core/functools/implementation';
import type { AnalyticEngine } from 'core/analytics/interface';

/**
 * Sends the specified analytic event
 * @abstract
 */
const sendEvent: AnalyticEngine = () => {
	unimplement({
		type: 'function',
		name: 'sendAnalyticsEvent'
	});
};

export default sendEvent;
