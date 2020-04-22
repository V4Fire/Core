/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { __ } from 'core/prelude/function/const';

/** @see FunctionConstructor.__ */
extend(Function, '__', {
	get(): typeof __ {
		return __;
	}
});

/** @see Function.curry */
extend(Function.prototype, 'curry', function (this: AnyFunction): AnyFunction {
	let
		{length} = this;

	const
		// tslint:disable-next-line:no-this-assignment
		fn = this;

	const
		args = <unknown[]>[],
		gaps = <number[]>[];

	// tslint:disable-next-line:only-arrow-functions
	const wrapper = function (): unknown {
		let
			i = 0;

		if (gaps.length && arguments.length) {
			const
				tmp = gaps.slice();

			for (let j = arguments.length, d = 0; i < tmp.length; i++) {
				if (!j--) {
					break;
				}

				const
					el = arguments[i];

				if (el !== __) {
					args[tmp[i]] = el;
					gaps.splice(i - d, 1);
					d++;
				}
			}
		}

		for (; i < arguments.length; i++) {
			const
				el = arguments[i];

			if (el === __) {
				gaps.push(i);
			}

			args.push(el);
		}

		length -= arguments.length - gaps.length;

		if (length <= 0 && !gaps.length) {
			return fn.apply(null, args);
		}

		return wrapper;
	};

	return wrapper;
});

/** @see FunctionConstructor.curry */
extend(Function, 'curry', (fn: AnyFunction) => fn.curry());
