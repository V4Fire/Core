import type { SyncStorageNamespace } from 'core/kv-storage';

let
	storage: CanUndef<SyncStorageNamespace>;

//#if runtime has core/kv-storage
// eslint-disable-next-line import/first
import { local } from 'core/kv-storage';

// eslint-disable-next-line prefer-const
storage = local.namespace('[[I18N]]');
//#endif

export default storage;
