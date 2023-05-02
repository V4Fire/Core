/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * The function implements the logic of chaining promises flatly usign the `Proxy` object.
 * It creates a chain of promises where each next promise takes a value from the previous one.
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
 * Checks if the passed prop is in the `Promise.prototype` and tries to get value by this prop.
 *
 * @param promiseLike - previos `PromiseLike`
 * @param prop - possible key from `Promise.prototype`
 */
function handleNativePromise<T>(promiseLike: PromiseLike<T>, prop: string | symbol): unknown {
	if (!Object.hasOwnProperty(Promise.prototype, prop)) {
		return;
	}

	const value = promiseLike[prop];
	return Object.isFunction(value) ? value.bind(promiseLike) : value;
}

/**
 * Creates next promise in chain that gets value from the previos one by accessing it using the specified prop.
 *
 * @param promiseLike - previos `PromiseLike`
 * @param prop - key to get next value
 */
function proxymifyNextValue<Data>(promiseLike: PromiseLike<Data>, prop: string | symbol): unknown {
	return proxymify(async () => {
		const data = await promiseLike;
		const value = data[prop];
		return Object.isFunction(value) ? value.bind(data) : value;
	});
}

/**
 * Creates next promise in chain that gets value from the previos one by calling the function.
 * This function is called when we try to call a method on the previos proxied object.
 *
 * @param getFn - the function that returns `PromiseLike` with currently calling function
 * @param args - arguments for the function
 */
function proxymifyNextValueFromFunctionCall(getFn: () => PromiseLike<Function>, args: unknown[]): unknown {
	return proxymify(async () => {
		const fn = await getFn();
		return fn(...args);
	});
}
