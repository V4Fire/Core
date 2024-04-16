/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { LogLevel } from '../../../core/log/interface';
import type { LogMiddlewares } from '../../../core/log/middlewares/interface';
import type { LogEngines } from '../../../core/log/engines/interface';
export interface LogConfig {
    pipelines: LogPipelineConfig[];
}
export interface LogPipelineConfig {
    engine: LogEngines;
    middlewares?: LogMiddlewares[];
    minLevel?: LogLevel;
    engineOptions?: Dictionary;
}
export declare type LogStylesConfig = {
    [key in LogLevel | 'default']?: Dictionary;
};
export interface StylesCache extends LogStylesConfig {
    getStyle(logLevel: LogLevel): CanUndef<Dictionary>;
}
