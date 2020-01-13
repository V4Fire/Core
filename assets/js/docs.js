'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable prefer-arrow-callback, no-var */

(function () {
	document.body.style.display = 'block';

	var
		isDTS = /([^/.]+)\.d/,
		isIndex = /\/index|\.d/,
		isNode = /(?:^|\b)node_modules(?:\b|$)/;

	var
		trimRgxp = /^\s+|[\n\v"']+|\s+$/g,
		normalizeRgxp = /(?:^|\b)src\//;

	var
		breadcrumbs = Array.from(document.querySelectorAll('.tsd-breadcrumb a')),
		headers = Array.from(document.querySelectorAll('h1'));

	breadcrumbs.forEach(function (el) {
		el.textContent = el.textContent.replace(trimRgxp, '').replace(normalizeRgxp, '');
	});

	headers.forEach(function (el) {
		el.textContent = el.textContent.replace(trimRgxp, '').replace(normalizeRgxp, '');
	});

	var
		navigation = Array.from(document.querySelectorAll('.tsd-navigation.primary .tsd-kind-external-module a')),
		globalIndex = Array.from(document.querySelectorAll('.tsd-index-list a'));

	[].concat(navigation, breadcrumbs.length <= 1 ? globalIndex : []).forEach(function (el) {
		var
			wrapper = el.parentNode,
			linkText = el.textContent.replace(trimRgxp, '');

		if (isIndex.test(linkText)) {
			if (isDTS.test(linkText)) {
				var
					nm = RegExp.$1;

				if (linkText === 'index.d') {
					el.innerHTML = '<b>prelude</b>';

				} else if (isNode.test(linkText)) {
					el.textContent = nm;

				} else {
					wrapper.parentNode.removeChild(wrapper);
				}

			} else {
				el.textContent = linkText.replace(isIndex, '').replace(normalizeRgxp, '');
			}

		} else {
			wrapper.parentNode.removeChild(wrapper);
		}
	});
})();
