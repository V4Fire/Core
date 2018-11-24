/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Converts the specified binary UUID to a string and returns it
 * @param uuid
 */
export function serialize(uuid: Buffer | Uint8Array): string {
	const
		HEX = 16;

	let
		res = '';

	for (let i = 0; i < uuid.length; ++i) {
		let
			chunk = uuid[i].toString(HEX);

		if (chunk.length < 2) {
			chunk = `0${chunk}`;
		}

		res += chunk;

		// tslint:disable-next-line:prefer-switch
		if (i === 3 || i === 5 || i === 7 || i === 9) {
			res += '-';
		}
	}

	return res;
}

/**
 * Converts the specified string UUID to binary and returns it
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
