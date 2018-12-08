/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { AsyncNamespace } from 'core/kv-storage';

let
	engine: Promise<AsyncNamespace>;

//#if runtime has kv-storage
engine = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[SESSION]]'));
//#endif

//#unless runtime has kv-storage
engine = <any>import('core/cache/cache').then(({default: Cache}) => new Cache());
//#endunless

export default engine;
