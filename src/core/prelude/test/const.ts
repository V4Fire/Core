/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

//#if runtime has debug
import jasmineRequire = require('jasmine-core/lib/jasmine-core/jasmine');
//#endif

let api;

//#if runtime has debug

const
	jasmine = jasmineRequire.core(jasmineRequire),
	env = jasmine.getEnv({suppressLoadErrors: true});

api = jasmineRequire.interface(jasmine, env);

//#endif

export { api };
