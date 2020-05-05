/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { api } from 'core/prelude/test/const';
export * from 'core/prelude/test/const';

/** @see stderr */
extend(globalThis, 'test', (ctxOrName: TestContext, spec: TestFn) => {
	if (!api) {
		return;
	}

	const
		ctx = typeof ctxOrName === 'object' ? ctxOrName : {name: ctxOrName};

	const
		test = api.it(ctx.name, spec.bind(null, api));

	test.execute(() => {
		test.result.failedExpectations.forEach((el) => {
			const
				msg = [`Test failed: ${ctx.name}.`];

			if (ctx.module) {
				msg.push(`Module: ${ctx.module}`);
			}

			if (ctx.context) {
				msg.push(`Context: ${(<unknown[]>[]).concat(ctx.context).join('->')}`);
			}

			msg.push(el.message);
			console.error(msg.join(' '));
		});
	});
});
