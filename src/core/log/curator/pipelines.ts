/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import { LogPipelineConfig } from 'core/log/config';
import { LogPipeline } from 'core/log/curator/pipeline';
import engineStrategy from 'core/log/engines';
import middlewareStrategy, { LogMiddleware } from 'core/log/middlewares';

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

/**
 * Creates pipeline using config
 * @param pipelineConfig
 */
function createPipeline(pipelineConfig: LogPipelineConfig): CanUndef<LogPipeline> {
	const
		{middlewares, engine, engineOptions} = pipelineConfig;

	if (middlewares !== undefined) {
		for (let i = 0; i < middlewares.length; ++i) {
			if (!middlewareStrategy[middlewares[i]]) {
				console.error(`Can't find middleware '${middlewares[i]}'`);
				return undefined;
			}
		}
	}

	if (!engineStrategy[engine]) {
		console.error(`Can't find engine '${engine}'`);
		return undefined;
	}

	const
		engineInstance = engineStrategy[engine](engineOptions),
		middlewareInstances: LogMiddleware[] = [];

	if (middlewares !== undefined) {
		for (let i = 0; i < middlewares.length; ++i) {
			middlewareInstances.push(middlewareStrategy[middlewares[i]]());
		}
	}

	return new LogPipeline(engineInstance, middlewareInstances);
}
