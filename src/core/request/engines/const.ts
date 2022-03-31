/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from 'core/prelude/env';

export const FormData: typeof globalThis.FormData = (() => {
	if (IS_NODE) {
		//#if node_js

		const
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			FormData = require('form-data');

		FormData.prototype.toString = function toString() {
			return this.getBuffer().toString();
		};

		return FormData;

		//#endif
	}

	return globalThis.FormData;
})();

export const Blob: typeof globalThis.Blob = (() => {
	if (IS_NODE) {
		//#if node_js
		return require('node-blob');
		//#endif
	}

	return globalThis.Blob;
})();
