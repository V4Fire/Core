/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const GROUPS = ['network', 'components', 'tools', 'manual'] as const;

export type PerfGroup = typeof GROUPS[number];
