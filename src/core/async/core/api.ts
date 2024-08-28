/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Super from 'core/async/core/core';

import { isPromisifyNamespace } from 'core/async/core/const';

import type { ClearOptions } from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Clears all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	clearAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((used, i) => {
			if (!used) {
				return;
			}

			const
				key = this.Namespaces[i],
				alias = `clear-${key}`.camelize(false);

			if (Object.isFunction(this[alias])) {
				this[alias](opts);

			} else if (!isPromisifyNamespace.test(i)) {
				throw new ReferenceError(`The method "${alias}" is not defined`);
			}
		});

		return this;
	}

	/**
	 * Mutes all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	muteAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((used, i) => {
			if (!used) {
				return;
			}

			const
				key = this.Namespaces[i],
				alias = `mute-${key}`.camelize(false);

			if (!isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

		return this;
	}

	/**
	 * Unmutes all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	unmuteAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((used, i) => {
			if (!used) {
				return;
			}

			const
				key = this.Namespaces[i],
				alias = `unmute-${key}`.camelize(false);

			if (!isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

		return this;
	}

	/**
	 * Suspends all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	suspendAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((used, i) => {
			if (!used) {
				return;
			}

			const
				key = this.Namespaces[i],
				alias = `suspend-${key}`.camelize(false);

			if (!isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

		return this;
	}

	/**
	 * Unsuspends all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	unsuspendAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((used, i) => {
			if (!used) {
				return;
			}

			const
				key = this.Namespaces[i],
				alias = `unsuspend-${key}`.camelize(false);

			if (!isPromisifyNamespace.test(i) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

		return this;
	}
}
