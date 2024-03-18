/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { LogStylesConfig, StylesCache } from '../../../core/log/config/interface';
/**
 * Creates an object of styles where each log level property merged with the default property of a log styles config
 * @param styles
 */
export declare function createStyleCache(styles: LogStylesConfig): StylesCache;
