/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token } from 'core/json/stream/parser';

import Super from 'core/json/stream/filters/abstract-filter';
import type { TokenFilter, FilterOptions } from 'core/json/stream/filters/interface';

export default class Pick extends Super {
	public constructor(filter: TokenFilter, opts?: FilterOptions) {
		super(filter, opts);
	}

	/** @inheritDoc */
	protected*checkToken(chunk: Token): Generator<boolean | Token> {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				if (this.filter(this.stack, chunk)) {
					yield chunk;

					this.processToken = this.passObject;
					this.depth = 1;

					return true;
				}

				break;

			case 'startString':
				if (this.filter(this.stack, chunk)) {
					yield chunk;
					this.processToken = this.passString;

					return true;
				}

				break;

			case 'startNumber':
				if (this.filter(this.stack, chunk)) {
					yield chunk;
					this.processToken = this.passNumber;

					return true;
				}

				break;

			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
			case 'stringValue':
			case 'numberValue':
				if (this.filter(this.stack, chunk)) {
					yield chunk;

					this.processToken = this.multiple ? this.check : this.skip;

					return true;
				}

				break;

			default:
				// Do nothing
		}

		return false;
	}
}
