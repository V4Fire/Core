/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export enum Namespaces {
	proxy,
	promise,
	iterable,
	request,
	idleCallback,
	timeout,
	interval,
	immediate,
	worker,
	eventListener,
	animationFrame,
	proxyPromise,
	timeoutPromise,
	intervalPromise,
	immediatePromise,
	idleCallbackPromise,
	animationFramePromise,
	eventListenerPromise,
	length
}

export const enum PrimitiveNamespaces {
	proxy,
	promise,
	iterable,
	request,
	idleCallback,
	timeout,
	interval,
	immediate,
	worker,
	eventListener,
	animationFrame,
	length
}

export const enum PromiseNamespaces {
	first = PrimitiveNamespaces.length - 1,
	proxyPromise,
	timeoutPromise,
	intervalPromise,
	immediatePromise,
	idleCallbackPromise,
	animationFramePromise,
	eventListenerPromise,
	length
}

export const usedNamespaces = new Array(Namespaces.length).fill(false);

export const namespacesCache = new Array(Namespaces.length).fill(null);
