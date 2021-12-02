/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import '@src/core/prelude/date/create';
import '@src/core/prelude/date/compare';
import '@src/core/prelude/date/modify';
import '@src/core/prelude/date/other';

//#if runtime has prelude/date/relative
import '@src/core/prelude/date/relative';
//#endif

//#if runtime has prelude/date/format
import '@src/core/prelude/date/format';
//#endif
