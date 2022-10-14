/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { __ } from 'core/prelude/function/const';

/** @see [[Function.curry]] */
export const curry = extend(Function.prototype, 'curry', function curry(this: AnyFunction): AnyFunction {
	const
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		fn = this;

	return createWrapper(this.length, [], []);

	function createWrapper(length: number, filteredArgs: unknown[], gaps: number[]): AnyFunction {
		return wrapper;

		function wrapper(this: unknown, ...args: unknown[]): unknown {
			const
				localFilteredArgs = filteredArgs.slice(),
				localGaps = gaps.slice();

			let
				i = 0;

			if (localGaps.length > 0 && args.length > 0) {
				const
					tmp = localGaps.slice();

				for (let j = args.length, d = 0; i < tmp.length; i++) {
					if (j-- === 0) {
						break;
					}

					const
						el = args[i];

					if (el !== __) {
						localFilteredArgs[tmp[i]] = el;
						localGaps.splice(i - d, 1);
						d++;
					}
				}
			}

			for (; i < args.length; i++) {
				const
					el = args[i];

				if (el === __) {
					localGaps.push(i);
				}

				localFilteredArgs.push(el);
			}

			const
				newLength = length - args.length + localGaps.length;

			if (newLength <= 0 && localGaps.length === 0) {
				return fn.apply(this, localFilteredArgs);
			}

			return createWrapper(newLength, localFilteredArgs, localGaps);
		}
	}
});

//#if standalone_prelude
/** @see [[FunctionConstructor.curry]] */
extend(Function, 'curry', (fn: AnyFunction) => fn.curry());

/** @see [[FunctionConstructor.__]] */
extend(Function, '__', {
	get(): typeof __ {
		return __;
	}
});
//#endif
