/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';

import type { MockOptions } from 'core/data/middlewares/attach-mock/interface';

export const mockOpts: { value: CanUndef<MockOptions> } = {value: undefined};

export const setConfig = (opts: CanUndef<Dictionary>): void => {
	const p: MockOptions = {
		patterns: [],
		...opts
	};

	mockOpts.value = p;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (mockOpts.value == null) {
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	p.patterns = (p.patterns ?? []).map((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

export const optionsInitializer = env.get('mock').then(setConfig, setConfig);
