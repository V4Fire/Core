/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '@src/core/prelude/extend';
import { unicode } from '@src/core/prelude/string/const';

/** @see [[String.letters]] */
extend(String.prototype, 'letters', function* letters(this: string): IterableIterator<string> {
	let
		baseStr: Nullable<string> = null,
		prevChar: Nullable<string> = null;

	let
		needConcat = false;

	for (const char of this) {
		let
			saveConcat = false;

		if (unicode.modifiers.test(char) || unicode.textModifiers.test(char)) {
			needConcat = true;

			if (unicode.zeroWidthJoiner.test(char)) {
				saveConcat = true;
			}

		} else if (prevChar != null) {
			const
				isColor = unicode.colorModifiers.test(char);

			if (isColor && unicode.zeroWidthJoiner.test(prevChar)) {
				needConcat = true;
				saveConcat = true;

			} else if (!needConcat) {
				needConcat =
					isColor && unicode.emojiWithColorModifiers.test(prevChar) ||
					unicode.regionalIndicators.test(char) && unicode.regionalIndicators.test(prevChar);
			}
		}

		if (needConcat) {
			baseStr = (baseStr ?? '') + char;

		} else {
			if (baseStr != null) {
				yield baseStr;
			}

			baseStr = char;
		}

		prevChar = char;

		if (!saveConcat) {
			needConcat = false;
		}
	}

	if (baseStr != null) {
		yield baseStr;
	}
});

/** @see [[StringConstructor.letters]] */
extend(String, 'letters', (str: string) => str.letters());
