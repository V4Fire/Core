/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/uuid/README.md]]
 * @packageDocumentation
 */

import { serializeFilter } from 'core/uuid/const';

/**
 * Converts the specified binary UUID to a string and returns it
 * @param uuid
 */
export function serialize(uuid: Uint8Array): string {
	let
		res = '';

	for (let i = 0; i < uuid.length; ++i) {
		let
			chunk = uuid[i].toString(16);

		if (chunk.length < 2) {
			chunk = `0${chunk}`;
		}

		res += chunk + (serializeFilter[i] === true ? '-' : '');
	}

	return res;
}

/**
 * Converts the specified UUID string to a binary sequence and returns it
 * @param uuid
 */
export function parse(uuid: string): Uint8Array {
	const
		arr = new Uint8Array(16);

	for (let i = 0, byteIndex = 0; i < uuid.length; i++) {
		if (uuid[i] === '-') {
			continue;
		}

		arr[byteIndex++] = parseInt(uuid[i] + uuid[++i], 16);
	}

	return arr;
}
