/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from 'core/env';
import type { RequestBody } from 'core/request/interface';

/**
 * Converts the specified data to send via request engines.
 * The function returns a tuple, where on the first position is converted data and its new content type on
 * the second position.
 *
 * @param data
 * @param [contentType]
 */
export function convertDataToSend<T = RequestBody>(data: unknown, contentType?: string): [Nullable<T>, string?] {
	if (Object.isPlainObject(data)) {
		const
			keys = Object.keys(data);

		let
			needForm = false;

		for (let i = 0; i < keys.length; i++) {
			if (needFormToSend(data[keys[i]])) {
				needForm = true;
				break;
			}
		}

		if (needForm) {
			let
				formData;

			if (IS_NODE) {
				//#if node_js
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const FormData = require('form-data');
				formData = new FormData();
				//#endif

			} else {
				formData = new FormData();
			}

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

			data = formData;

		} else {
			data = JSON.stringify(data);

			if (contentType == null) {
				contentType = 'application/json;charset=UTF-8';
			}
		}

	} else if (Object.isNumber(data) || Object.isBoolean(data)) {
		data = String(data);
	}

	return [<any>data, contentType];

	function needFormToSend(val: unknown): boolean {
		if (IS_NODE) {
			//#if node_js
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			return val instanceof Buffer || val instanceof require('stream').Readable;
			//#endif
		}

		return val instanceof File || val instanceof FileList;
	}
}
