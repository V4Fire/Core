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

import { deprecate } from '@src/core/functools/deprecation';

import { mimeTypes, normalizeMimeStrRgxp, dataURIRgxp, isTextType, isXMLType } from '@src/core/mime-type/const';
import type { DataType } from '@src/core/mime-type/interface';

export * from '@src/core/mime-type/const';
export * from '@src/core/mime-type/interface';

/**
 * Returns a type of data from the specified DATA:URI string
 * @param uri
 */
export function getDataTypeFromURI(uri: string): CanUndef<DataType> {
	const mime = dataURIRgxp.exec(uri)?.[1];
	return mime != null ? getDataType(mime) : undefined;
}

/**
 * @deprecated
 * @see [[getDataTypeFromURI]]
 */
export function getDataTypeFromURL(url: string): CanUndef<DataType> {
	deprecate({type: 'function', name: 'getDataTypeFromURL', renamedTo: 'getDataTypeFromURI'});
	return getDataTypeFromURI(url);
}

/**
 * Returns a type of data from the specified mime type string
 * @param str
 */
export function getDataType(str: string): DataType {
	const
		type = str.toLowerCase().replace(normalizeMimeStrRgxp, '').trim(),
		predefinedType = mimeTypes[type];

	if (predefinedType != null) {
		return predefinedType;
	}

	if (isXMLType.test(type)) {
		return 'document';
	}

	if (isTextType.test(type)) {
		return 'text';
	}

	return 'blob';
}
