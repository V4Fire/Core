/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { NormalizedRequestBody } from '../../../core/request/interface';
/**
 * Converts the specified data to send via request engines.
 * The function returns a tuple, where on the first position is converted data and its new content type on
 * the second position.
 *
 * @param data
 * @param [contentType]
 */
export declare function convertDataToSend(data: unknown, contentType?: string): [NormalizedRequestBody?, string?];
