/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { LogPipeline } from '../../../core/log/curator/pipeline';
import type { LogPipelineConfig } from '../../../core/log/config/interface';
/**
 * Creates a pipeline by using the config
 * (returns undefined if there are not enough data to create one)
 *
 * @param pipelineConfig
 */
export declare function createPipeline(pipelineConfig: LogPipelineConfig): CanUndef<LogPipeline>;
