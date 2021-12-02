/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from '@src/config';

import { createPipeline } from '@src/core/log/config';
import type { LogPipeline } from '@src/core/log/curator/pipeline';

const
	pipelines: LogPipeline[] = [];

//#if runtime has core/log

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (config.log?.pipelines != null) {
	for (let i = 0; i < config.log.pipelines.length; ++i) {
		const
			pipeline = createPipeline(config.log.pipelines[i]);

		if (pipeline !== undefined) {
			pipelines.push(pipeline);
		}
	}
}

//#endif

export default pipelines;
