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
import engineFactory from 'core/log/engines';
import middlewareFactory, { LogMiddleware } from 'core/log/middlewares';
import { DEFAULT_LEVEL } from 'core/log/base';

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
		{middlewares, engine, engineOptions, minLevel} = pipelineConfig;

	if (middlewares !== undefined) {
		for (let i = 0; i < middlewares.length; ++i) {
			if (!middlewareFactory[middlewares[i]]) {
				console.error(`Can't find middleware '${middlewares[i]}'`);
				return undefined;
			}
		}
	}

	if (!engineFactory[engine]) {
		console.error(`Can't find engine '${engine}'`);
		return undefined;
	}

	const
		engineInstance = engineFactory[engine](engineOptions),
		middlewareInstances: LogMiddleware[] = [];

	if (middlewares !== undefined) {
		for (let i = 0; i < middlewares.length; ++i) {
			middlewareInstances.push(middlewareFactory[middlewares[i]]());
		}
	}

	return new LogPipeline(engineInstance, middlewareInstances, minLevel || DEFAULT_LEVEL);
}
