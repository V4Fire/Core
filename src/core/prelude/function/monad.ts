/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { Option, Result } from 'core/prelude/structures';

/** @see Function.option */
extend(Function.prototype, 'option', function (this: AnyFunction): AnyFunction {
	const wrapper = (...args) => {
		const
			fst = args[0];

		if (fst == null) {
			return Option.reject(null);
		}

		if (fst instanceof Option || fst instanceof Result) {
			return fst.then((value) => wrapper(value, ...args.slice(1)));
		}

		try {
			return Option.resolve(this(...args));

		} catch (err) {
			return Option.reject(err);
		}
	};

	return wrapper;
});

/** @see ObjectConstructor.Option */
extend(Object, 'Option', (value: unknown) => {
	if (value == null) {
		return Option.reject(null);
	}

	if (Object.isFunction(value)) {
		return value.option();
	}

	return Option.resolve(value);
});

/** @see Function.result */
extend(Function.prototype, 'result', function (this: AnyFunction): AnyFunction {
	const wrapper = (...args) => {
		const
			fst = args[0];

		if (fst instanceof Option || fst instanceof Result) {
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

/** @see ObjectConstructor.Result */
extend(Object, 'Result', (value: unknown) => {
	if (value == null) {
		return Result.reject(null);
	}

	if (Object.isFunction(value)) {
		return value.result();
	}

	return Result.resolve(value);
});
