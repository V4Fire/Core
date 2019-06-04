/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { LogPipelineConfig } from 'core/log/config/types';
import { LogPipeline } from 'core/log/curator/pipeline';
import middlewareFactory, { LogMiddleware } from 'core/log/middlewares';
import engineFactory from 'core/log/engines';
import { DEFAULT_LEVEL } from 'core/log/base';

/**
 * Creates pipeline using config
 * @param pipelineConfig
 */
export function createPipeline(pipelineConfig: LogPipelineConfig): CanUndef<LogPipeline> {
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
