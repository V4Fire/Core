/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { Option as OptionStructure, Result as OptionResult } from 'core/prelude/structures';

/** @see [[Function.option]] */
export const option = extend(Function.prototype, 'option', function option(this: AnyFunction): AnyFunction {
	const wrapper = (...args) => {
		const
			fst = args[0];

		if (fst == null) {
			return OptionStructure.reject(null);
		}

		if (fst instanceof OptionStructure || fst instanceof OptionResult) {
			return fst.then((value) => wrapper(value, ...args.slice(1)));
		}

		try {
			return OptionStructure.resolve(this(...args));

		} catch (err) {
			return OptionStructure.reject(err);
		}
	};

	return wrapper;
});

/** @see [[ObjectConstructor.Option]] */
export const Option = extend(Object, 'Option', (value: unknown) => {
	if (value == null) {
		return OptionStructure.reject(null);
	}

	if (Object.isFunction(value)) {
		return value.option();
	}

	return OptionStructure.resolve(value);
});

/** @see [[Function.result]] */
export const result = extend(Function.prototype, 'result', function result(this: AnyFunction): AnyFunction {
	const wrapper = (...args) => {
		const
			fst = args[0];

		if (fst instanceof OptionStructure || fst instanceof OptionResult) {
			return fst.then((value) => wrapper(value, ...args.slice(1)));
		}

		try {
			return OptionResult.resolve(this(...args));

		} catch (err) {
			return OptionResult.reject(err);
		}
	};

	return wrapper;
});

/** @see [[ObjectConstructor.Result]] */
export const Result = extend(Object, 'Result', (value: unknown) => {
	if (value instanceof Error) {
		return OptionResult.reject(value);
	}

	if (Object.isFunction(value)) {
		return value.result();
	}

	return OptionResult.resolve(value);
});
