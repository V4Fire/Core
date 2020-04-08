/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
*
* Released under the MIT license
* https://github.com/V4Fire/Core/blob/master/LICENSE
*/

/**
 * [[include:core/mime-type/README.md]]
 * @packageDocumentation
 */

import { mimeTypes, normalizeTypeRgxp, dataURIRgxp, isTextType, isXMLType } from 'core/mime-type/const';
import { DataType } from 'core/mime-type/interface';

export * from 'core/mime-type/const';
export * from 'core/mime-type/interface';

/**
 * Returns a type of data from the specified DATA:URI string
 * @param url
 */
export function getDataTypeFromURL(url: string): CanUndef<DataType> {
	const mime = dataURIRgxp.exec(url)?.[1];
	return mime != null ? getDataType(mime) : undefined;
}

/**
 * Returns a type of data from the specified mime type
 * @param mime
 */
export function getDataType(mime: string): DataType {
	const
		type = mime.toLowerCase().replace(normalizeTypeRgxp, ''),
		predefinedType = mimeTypes[type];

	if (predefinedType) {
		return predefinedType;
	}

	if (isTextType.test(type)) {
		return 'text';
	}

	if (isXMLType.test(type)) {
		return 'document';
	}

	return 'blob';
}
