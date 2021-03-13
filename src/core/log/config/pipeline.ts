/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { DEFAULT_LEVEL } from 'core/log/base';
import { LogPipeline } from 'core/log/curator/pipeline';

import type { LogPipelineConfig } from 'core/log/config/interface';

import middlewareFactory, { LogMiddleware } from 'core/log/middlewares';
import engineFactory from 'core/log/engines';

/**
 * Creates a pipeline by using the config
 * (returns undefined if there are not enough data to create one)
 *
 * @param pipelineConfig
 */
export function createPipeline(pipelineConfig: LogPipelineConfig): CanUndef<LogPipeline> {
	//#if runtime has core/log

	const
		{middlewares, engine, engineOptions, minLevel} = pipelineConfig,
		middlewareInstances: LogMiddleware[] = [];

	if (middlewares) {
		for (let i = 0; i < middlewares.length; ++i) {
			const
				nameOrTuple = middlewares[i];

			if (Object.isString(nameOrTuple)) {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (middlewareFactory[nameOrTuple] == null) {
					console.error(`Can't find the middleware "${nameOrTuple}"`);
					continue;
				}

				middlewareInstances.push(middlewareFactory[nameOrTuple]());

			} else {
				const
					[name, params] = nameOrTuple;

				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (middlewareFactory[name] == null) {
					console.error(`Can't find the middleware "${name}"`);
					continue;
				}

				middlewareInstances.push(middlewareFactory[name](...params));
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (engineFactory[engine] == null) {
		console.error(`Can't find the engine "${engine}"`);
		return;
	}

	const
		engineInstance = engineFactory[engine](engineOptions);

	return new LogPipeline(engineInstance, middlewareInstances, minLevel ?? DEFAULT_LEVEL);

	//#endif
}
