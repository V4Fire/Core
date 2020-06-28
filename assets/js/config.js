'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

(function () {
	if (localStorage.getItem('visibility') == null) {
		localStorage.setItem('visibility', 'public');
	}

	document.title = document.title.replace(/['"]+|src\//g, '');
	document.body.style.display = 'none';
})();
