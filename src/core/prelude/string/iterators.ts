/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { isCombinable, isConcatChar, isFlagLetters } from 'core/prelude/string/const';

/** @see [[String.letters]] */
extend(String.prototype, 'letters', function* letters(this: string): IterableIterator<string> {
	let
		needConcat = false;

	let
		baseStr,
		prevChar;

	for (const char of this) {
		if (isCombinable.test(char)) {
			if (isConcatChar.test(char)) {
				needConcat = true;
			}

			if (baseStr != null) {
				baseStr += char;
			}

		} else {
			if (prevChar != null && isFlagLetters.test(prevChar) && isFlagLetters.test(char)) {
				needConcat = true;
			}

			if (!needConcat && baseStr != null) {
				yield baseStr;
				baseStr = null;
			}

			needConcat = false;

			if (baseStr != null) {
				baseStr += char;

			} else {
				baseStr = char;
			}
		}

		prevChar = char;
	}

	if (baseStr != null) {
		yield baseStr;
	}
});

/** @see [[StringConstructor.letters]] */
extend(String, 'letters', (str: string) => str.letters());
