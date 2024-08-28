/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Namespaces } from '../../../core/async/const';
export declare const asyncCounter: unique symbol;
export declare const isZombieGroup: {
    test(group: string): boolean;
};
export declare const isPromisifyNamespace: {
    test(namespace: Namespaces): boolean;
};
