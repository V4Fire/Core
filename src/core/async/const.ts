/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export enum Namespaces {
	proxy,
	proxyPromise,
	promise,
	iterable,
	request,
	idleCallback,
	idleCallbackPromise,
	timeout,
	timeoutPromise,
	interval,
	intervalPromise,
	immediate,
	immediatePromise,
	worker,
	eventListener,
	eventListenerPromise,
	animationFrame,
	animationFramePromise
}

export const usedNamespaces = Object.values(Namespaces).filter((val) => Object.isNumber(val)).map(() => false);

export const namespacesCache = new Array(usedNamespaces.length).fill(null);
