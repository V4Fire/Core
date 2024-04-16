/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { DataType } from '../../core/mime-type/interface';
export * from '../../core/mime-type/const';
export * from '../../core/mime-type/interface';
/**
 * Returns a type of data from the specified DATA:URI string
 * @param uri
 */
export declare function getDataTypeFromURI(uri: string): CanUndef<DataType>;
/**
 * @deprecated
 * @see [[getDataTypeFromURI]]
 */
export declare function getDataTypeFromURL(url: string): CanUndef<DataType>;
/**
 * Returns a type of data from the specified mime type string
 * @param str
 */
export declare function getDataType(str: string): DataType;
