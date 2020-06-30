/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

let
	xmlSerializer;

/**
 * Serializes the specified XML node to a string
 * @param node
 */
export function serialize(node: Node): string {
	xmlSerializer = xmlSerializer ?? require('w3c-xmlserializer');
	return serialize(node);
}
