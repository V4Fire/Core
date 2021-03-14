/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Recurrent structure that represents detailed error information
 */
export interface ErrorInfo {
	/**
	 * General info about an error.
	 * Using only for cause errors and not for the root one
	 */
	error?: {
		name: string;
		message: string;
	};

	/**
	 * Error's details that could be extracted from it via error details extractors
	 */
	details?: unknown;

	/**
	 * Information of cause error
	 */
	cause?: ErrorInfo;
}
