/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { MockOptions } from '../../../../core/data/middlewares/attach-mock/interface';
export declare const mockOpts: {
    value: CanUndef<MockOptions>;
};
export declare const setConfig: (opts: CanUndef<Dictionary>) => void;
export declare const optionsInitializer: Promise<void>;
