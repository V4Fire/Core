/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see FunctionConstructor.compose */
extend(Function, 'compose', (...fns: Nullable<AnyFunction>[]) => function (): unknown {
	if (!fns.length) {
		return;
	}

	let
		i = fns.length,
		res;

	while (i--) {
		const
			fn = fns[i];

		if (fn != null) {
			res = fn.apply(this, arguments);
			break;
		}
	}

	while (i--) {
		const
			fn = fns[i];

		if (fn != null) {
			// tslint:disable-next-line:prefer-conditional-expression
			if (Object.isPromise(res)) {
				res = res.then((res) => fn.call(this, res));

			} else {
				res = fn.call(this, res);
			}
		}
	}

	return res;
});

/** @see Function.compose */
extend(Function.prototype, 'compose', function (
	this: AnyFunction,
	...fns: Nullable<AnyFunction>[]
): AnyFunction {
	const
		that = this;

	return function (): unknown {
		let
			res = that.apply(this, arguments);

		for (let i = 0; i < fns.length; i++) {
			const
				fn = fns[i];

			if (fn != null) {
				// tslint:disable-next-line:prefer-conditional-expression
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
