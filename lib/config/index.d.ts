/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Config } from '../config/interface';
export * from '../config/interface';
export declare const $$: StrictDictionary<symbol>;
declare const config: Config;
/**
 * Extends the config object with additional objects
 * @param objects
 */
export declare function extend<T extends Config>(...objects: Array<CanUndef<Dictionary>>): T;
export default config;
