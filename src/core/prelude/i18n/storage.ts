/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { LocaleKVStorage } from 'core/prelude/i18n/interface';

import { local } from 'core/kv-storage';

const
	storage: LocaleKVStorage = local.namespace('[[I18N]]');

export default storage;
