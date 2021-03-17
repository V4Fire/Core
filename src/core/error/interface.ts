/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type ErrorCtor<E extends Error> = new (...args: any[]) => E;

/**
 * Extractor that gets details from an error of type `E`
 */
export interface ErrorDetailsExtractor<E extends Error> {
	/**
	 * Constructor function of an error
	 */
	target: ErrorCtor<E>;

	/**
	 * Extracts details from the passed error
	 * @param error - an error, which details should be extracted
	 */
	extract(error: E): unknown;
}
