/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
*
* Released under the MIT license
* https://github.com/V4Fire/Core/blob/master/LICENSE
*/

import { DataType } from 'core/mime-type/interface';

export const
	normalizeTypeRgxp = /;.*/,
	dataURIRgxp = /^data:([^;]+);/;

export const
	isTextType = /^text(?:\/|$)/,
	isXMLType = /^application\/\w+-xml\b/;

export const mimeTypes: Dictionary<DataType> = Object.createDict({
	'application/json': 'json',
	'application/javascript': 'text',
	'application/xml': 'document',
	'application/x-www-form-urlencoded': 'text',
	'application/x-msgpack': 'arrayBuffer',
	'application/x-protobuf': 'arrayBuffer',
	'application/vnd.google.protobuf': 'arrayBuffer'
});
