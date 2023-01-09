/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { SyncStorageNamespace } from 'core/kv-storage';

import { local } from 'core/kv-storage';

const
	storage: SyncStorageNamespace = local.namespace('[[I18N]]');

export default storage;
