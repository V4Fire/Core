/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { notImplement } from '@src/core/functools/not-implemented';
import type { AnalyticEngine } from '@src/core/analytics/interface';

/**
 * Sends the specified analytic event
 * @abstract
 */
const sendEvent: AnalyticEngine = () => {
	notImplement({
		type: 'function',
		name: 'sendAnalyticsEvent'
	});
};

export default sendEvent;
