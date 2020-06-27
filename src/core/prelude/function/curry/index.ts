/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { __ } from 'core/prelude/function/const';

/** @see [[FunctionConstructor.__]] */
extend(Function, '__', {
	get(): typeof __ {
		return __;
	}
});

/** @see [[Function.curry]] */
extend(Function.prototype, 'curry', function curry(this: AnyFunction): AnyFunction {
	let
		{length} = this;

	const
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		fn = this;

	const
		filteredArgs = <unknown[]>[],
		gaps = <number[]>[];

	return wrapper;

	function wrapper(this: unknown, ...args: unknown[]): unknown {
		let
			i = 0;

		if (gaps.length > 0 && args.length > 0) {
			const
				tmp = gaps.slice();

			for (let j = args.length, d = 0; i < tmp.length; i++) {
				if (j-- === 0) {
					break;
				}

				const
					el = args[i];

				if (el !== __) {
					filteredArgs[tmp[i]] = el;
					gaps.splice(i - d, 1);
					d++;
				}
			}
		}

		for (; i < args.length; i++) {
			const
				el = args[i];

			if (el === __) {
				gaps.push(i);
			}

			filteredArgs.push(el);
		}

		length -= args.length - gaps.length;

		if (length <= 0 && gaps.length === 0) {
			return fn.apply(this, filteredArgs);
		}

		return wrapper;
	}
});

/** @see [[FunctionConstructor.curry]] */
extend(Function, 'curry', (fn: AnyFunction) => fn.curry());
