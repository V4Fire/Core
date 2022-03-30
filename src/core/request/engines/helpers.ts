/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from 'core/env';
import { FormData } from 'core/request/engines/const';

import type { NormalizedRequestBody } from 'core/request/interface';

/**
 * Converts the specified data to send via request engines.
 * The function returns a tuple, where on the first position is converted data and its new content type on
 * the second position.
 *
 * @param data
 * @param [contentType]
 */
export function convertDataToSend(
	data: unknown,
	contentType?: string
): [NormalizedRequestBody?, string?] {
	if (data == null) {
		return [undefined, contentType];
	}

	if (Object.isPrimitive(data)) {
		return [String(data), contentType];
	}

	if (Object.isDictionary(data)) {
		const
			keys = Object.keys(data);

		let
			needFormData = false;

		for (let i = 0; i < keys.length; i++) {
			if (needFormToSend(data[keys[i]])) {
				needFormData = true;
				break;
			}
		}

		if (needFormData) {
			const
				formData = new FormData();

			const append = (key, val) => {
				if (Object.isIterable(val)) {
					Object.forEach(val, (val) => append(key, val));
					return;
				}

				if (needFormToSend(val)) {
					formData.append(key, val);

				} else {
					formData.append(key, JSON.stringify(val));
				}
			};

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				append(key, data[key]);
			}

			return [formData, contentType];
		}

		if (contentType == null) {
			contentType = 'application/json;charset=UTF-8';
		}

		return [JSON.stringify(data), contentType];
	}

	return [Object.cast(data), contentType];

	function needFormToSend(val: unknown): boolean {
		if (Object.isArray(val)) {
			return val.some(needFormToSend);
		}

		if (IS_NODE) {
			//#if node_js
			// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-nodejs-modules
			return val instanceof Buffer || val instanceof require('stream').Readable;
			//#endif
		}

		return val instanceof File || val instanceof FileList;
	}
}
