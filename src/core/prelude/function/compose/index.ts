/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[FunctionConstructor.compose]] */
extend(Function, 'compose', (...fns: Array<Nullable<AnyFunction>>) => function wrapper(this: unknown): unknown {
	if (fns.length === 0) {
		return;
	}

	let
		i = fns.length,
		res;

	while (i-- > 0) {
		const
			fn = fns[i];

		if (fn != null) {
			res = fn.apply(this, arguments);
			break;
		}
	}

	while (i-- > 0) {
		const
			fn = fns[i];

		if (fn != null) {
			if (Object.isPromise(res)) {
				res = res.then((res) => fn.call(this, res));

			} else {
				res = fn.call(this, res);
			}
		}
	}

	return res;
});

/** @see [[Function.compose]] */
extend(Function.prototype, 'compose', function compose(
	this: AnyFunction,
	...fns: Array<Nullable<AnyFunction>>
): AnyFunction {
	const
		that = this;

	return function wrapper(this: unknown): unknown {
		let
			res = that.apply(this, arguments);

		for (let i = 0; i < fns.length; i++) {
			const
				fn = fns[i];

			if (fn != null) {
				if (Object.isPromise(res)) {
					res = res.then((res) => fn.call(this, res));

				} else {
					res = fn.call(this, res);
				}
			}
		}

		return res;
	};
});
