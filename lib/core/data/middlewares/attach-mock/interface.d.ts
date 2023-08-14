/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Mock } from '../../../../core/data';
import type { MiddlewareParams } from '../../../../core/request';
export interface MockOptions {
    patterns: RegExp[];
}
export declare type RequestMatchingData = Partial<Pick<MiddlewareParams['opts'], 'query' | 'body' | 'headers'>>;
export interface MockBestMatch {
    score: number;
    mismatches: number;
    mock: Mock | null;
}
