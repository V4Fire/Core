/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/xml/README.md]]
 */

import { normalizeRgxp } from 'core/xml/const';
import { serialize } from 'core/xml/engines';

/**
 * Converts the specified XML node to a DATA:URI string
 * @param node
 */
export function toDataURI(node: Node): string {
	return `data:image/svg+xml;${serialize(node).replace(normalizeRgxp, normalize)}`;

	function normalize(str: string, sp?: string): string {
		if (str === '"') {
			return "'";
		}

		if (sp != null) {
			return ' ';
		}

		return `%${str[0].charCodeAt(0).toString(16).toUpperCase()}`;
	}
}
