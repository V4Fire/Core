/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { AsyncOptions } from 'core/async/interface';

/**
 * Takes an object with async options and returns a new one with a modified group to support task suspension.
 * To prevent suspension, provide a group with the `:!suspend` modifier.
 *
 * @param opts
 * @param [groupMod] - additional group modifier
 *
 * @example
 * ```js
 * // {label: 'foo'}
 * console.log(wrapWithSuspending({label: 'foo'}));
 *
 * // {group: ':baz:suspend', label: 'foo'}
 * console.log(wrapWithSuspending({label: 'foo'}), 'baz');
 *
 * // {group: 'bar:suspend'}
 * console.log(wrapWithSuspending({group: 'bar'}));
 *
 * // {group: 'bar:baz:suspend'}
 * console.log(wrapWithSuspending({group: 'bar'}, 'baz'));
 *
 * // {group: 'bar:!suspend'}
 * console.log(wrapWithSuspending({group: 'bar:!suspend'}, 'baz'))
 * ```
 */
export function wrapWithSuspending<T extends AsyncOptions>(opts: T, groupMod?: string): T {
	let group = Object.isPlainObject(opts) ? opts.group : null;

	if (groupMod != null) {
		group = `${group ?? ''}:${groupMod}`;
	}

	if (group == null || group.includes(':!suspend')) {
		return opts;
	}

	return {...opts, group: `${group}:suspend`};
}
