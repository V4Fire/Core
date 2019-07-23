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

//#if runtime has core/kv-storage
engine = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[SESSION]]'));
//#endif

//#unless runtime has core/kv-storage
engine = <any>import('simple.ts').then(({Simple: Cache}) => new Simple());
//#endunless

export default engine;
