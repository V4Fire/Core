/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export function log(id: string, ns: string, duration: number, additional?: Dictionary): void {
	const
		args: unknown[] = [`${ns} took ${duration} ms`];

	if (additional != null) {
		args.push(additional);
	}

	console.warn(...args);
}
