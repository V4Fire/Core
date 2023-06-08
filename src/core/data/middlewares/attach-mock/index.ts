/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/middlewares/attach-mock/README.md]]
 */

import * as env from 'core/env';

import { setConfig } from 'core/data/middlewares/attach-mock/const';

export type { MockOptions } from 'core/data/middlewares/attach-mock/interface';
export * from 'core/data/middlewares/attach-mock/attach-mock';

env.emitter.on('set.mock', setConfig);
env.emitter.on('remove.mock', setConfig);
