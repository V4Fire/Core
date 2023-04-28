/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * The function implements the logic of chaining promises flatly usign the `Proxy` object.
 * It creates a chain of promises where each next promises takes a value from the previous one.
 *
 * @param getPromiseLike - the function that returns the previous promise in chain
 */
export function proxymify<T>(getPromiseLike: (...args: unknown[]) => PromiseLike<T>): unknown {
	return new Proxy(getPromiseLike, {
		get(_: unknown, prop: string): unknown {
			const promiseLike = getPromiseLike();
			return handleNativePromise(promiseLike, prop) ?? proxymifyNextValue(promiseLike, prop);
		},

		apply(target: (...args: unknown[]) => PromiseLike<Function>, _: unknown, args: unknown[]): unknown {
			return proxymifyNextValueFromFunctionCall(target, args);
		}
	});
}

/**
 *
 */
function handleNativePromise<T>(promiseLike: PromiseLike<T>, prop: string | symbol): unknown {
	if (!Object.hasOwnProperty(Promise.prototype, prop)) {
		return;
	}

	const value = promiseLike[prop];

	if (Object.isFunction(value)) {
		return value.bind(promiseLike);
	}

	return value;
}

/**
 *
 */
function proxymifyNextValue<Data>(promiseLike: PromiseLike<Data>, prop: string | symbol): unknown {
	return proxymify(async () => {
		const data = await promiseLike;
		const value = data[prop];
		return Object.isFunction(value) ? value.bind(data) : value;
	});
}

/**
 *
 */
function proxymifyNextValueFromFunctionCall(getFn: () => PromiseLike<Function>, args: unknown[]): unknown {
	return proxymify(async () => {
		const fn = await getFn();
		return fn(...args);
	});
}
