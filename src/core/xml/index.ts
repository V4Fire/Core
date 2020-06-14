/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/xml/README.md]]
 * @packageDocumentation
 */

const
	xmlSerializer = new XMLSerializer(),
	normalizeRgxp = /"|(\s+)|[{}|\\^~[\]`"<>#%]/g;

/**
 * Converts the specified XML node to a DATA:URI string
 * @param node
 */
export function toDataURI(node: Node): string {
	return `data:image/svg+xml,${xmlSerializer.serializeToString(node).replace(normalizeRgxp, normalize)}`;
}

/**
 * Helper for XML string normalizing
 */
function normalize(str: string, sp?: string): string {
	if (str === '"') {
		return "'";
	}

	if (sp != null) {
		return ' ';
	}

	return `%${str[0].charCodeAt(0).toString(16).toUpperCase()}`;
}
