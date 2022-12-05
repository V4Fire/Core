/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/status-codes/README.md]]
 *
 * @packageDocumentation
 */

import { StatusCodes } from 'core/status-codes/interface';

export * from 'core/status-codes/interface';

/**
 * Enum-like structure of status codes
 */
const statusCodes = Object.createEnumLike(StatusCodes);
export default statusCodes;
