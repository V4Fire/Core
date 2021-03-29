/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface StorageManagerMemory {
	[key: string]: {
		value?: unknown;
		action: 'set' | 'remove';
		callback?(): void;
	};
}

export type StorageManagerChangeElementParams = {
	action: 'set';
	value: unknown;
	callback?(): void;
} | {
	action: 'remove';
	callback?(): void;
};
