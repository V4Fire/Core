/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * The function implements the logic of chaining promises flatly using the `Proxy` object.
 * It creates a chain of promises where each next promise takes a value from the previous one.
 *
 * @param getPrevPromiseLike - the function that returns the previous `PromiseLike` in chain
 */
export function proxymify<T>(getPrevPromiseLike: (...args: unknown[]) => PromiseLike<T>): unknown {
	return new Proxy(getPrevPromiseLike, {
		get(_: unknown, nextProp: string): unknown {
			const prevPromiseLike = getPrevPromiseLike();
			return handleNativePromise(prevPromiseLike, nextProp) ?? proxymifyNextValue(prevPromiseLike, nextProp);
		},

		apply(target: (...args: unknown[]) => PromiseLike<Function>, _: unknown, args: unknown[]): unknown {
			return proxymifyNextValueFromMethodCall(target, args);
		}
	});
}

/**
 * Checks if the passed prop is in the `Promise.prototype` and tries to get value by this prop.
 *
 * @param prevPromiseLike - previous `PromiseLike`
 * @param nextProp - possible key from `Promise.prototype`
 */
function handleNativePromise<T>(prevPromiseLike: PromiseLike<T>, nextProp: string | symbol): unknown {
	if (!Object.hasOwnProperty(Promise.prototype, nextProp)) {
		return;
	}

	const value = prevPromiseLike[nextProp];
	return Object.isFunction(value) ? value.bind(prevPromiseLike) : value;
}

/**
 * Creates next promise in chain that gets a value from the previous one by accessing it using the specified prop.
 *
 * @param prevPromiseLike - previous `PromiseLike`
 * @param nextProp - key to get next value
 */
function proxymifyNextValue<Data>(prevPromiseLike: PromiseLike<Data>, nextProp: string | symbol): unknown {
	return proxymify(async () => {
		const data = await prevPromiseLike;
		const value = data[nextProp];
		return Object.isFunction(value) ? value.bind(data) : value;
	});
}

/**
 * Creates next promise in chain that gets value from the previous one by calling the function.
 * This function is called when we try to call a method on the previous proxied object.
 *
 * @param getMethod - the function that returns `PromiseLike` with currently calling method
 * @param args - arguments for the method
 */
function proxymifyNextValueFromMethodCall(getMethod: () => PromiseLike<Function>, args: unknown[]): unknown {
	return proxymify(async () => {
		const method = await getMethod();
		return method(...args);
	});
}
