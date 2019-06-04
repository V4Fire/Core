/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { LogPipeline } from 'core/log/curator/pipeline';
import { createPipeline } from 'core/log/config';

const
	pipelines: LogPipeline[] = [];

if (config && config.log && config.log.pipelines) {
	for (let i = 0; i < config.log.pipelines.length; ++i) {
		const
			pipeline = createPipeline(config.log.pipelines[i]);

		if (pipeline !== undefined) {
			pipelines.push(pipeline);
		}
	}
}

export default pipelines;
