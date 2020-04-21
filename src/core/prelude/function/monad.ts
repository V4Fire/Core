/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { Result } from 'core/prelude/structures';

/** @see Function.optional */
extend(Function.prototype, 'optional', function (this: AnyFunction): AnyFunction {
	const wrapper = (...args) => {
		const
			fst = args[0];

		if (fst == null) {
			return Result.reject(null);
		}

		if (fst instanceof Result) {
			return fst.then((value) => wrapper(value, ...args.slice(1)));
		}

		try {
			return Result.resolve(this(...args));

		} catch (err) {
			return Result.reject(err);
		}
	};

	return wrapper;
});

/** @see ObjectConstructor.optional */
extend(Object, 'optional', (value: unknown) => {
	if (value == null) {
		return Result.reject(null);
	}

	if (Object.isFunction(value)) {
		return value.optional();
	}

	return Result.resolve(value);
});

/** @see Function.result */
extend(Function.prototype, 'result', function (this: AnyFunction): AnyFunction {
	const wrapper = (...args) => {
		const
			fst = args[0];

		if (fst instanceof Result) {
			return fst.then((value) => wrapper(value, ...args.slice(1)));
		}

		try {
			return Result.resolve(this(...args));

		} catch (err) {
			return Result.reject(err);
		}
	};

	return wrapper;
});

/** @see ObjectConstructor.result */
extend(Object, 'result', (value: unknown) => {
	if (value == null) {
		return Result.reject(null);
	}

	if (Object.isFunction(value)) {
		return value.result();
	}

	return Result.resolve(value);
});
