'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

(function () {
	document.body.style.display = 'block';

	var
		isDTS = /\.d$/,
		isIndex = /^(?:(?!(?:^|\/)(?:interface|modules|prelude|engines)\/).)*?(?:^|\/)index$/,
		isNode = /(?:^|\/)node_modules(?:\/|$)/;

	var
		trimRgxp = /^\s+|[\n\v"']+|\s+$/g,
		normalizeRgxp = /(?:^|\b)src\/|\/index$/g;

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
		navigation = Array.from(document.querySelectorAll('.tsd-navigation.primary .tsd-kind-module a')),
		globalIndex = Array.from(document.querySelectorAll('.tsd-kind-module a'));

	[].concat(breadcrumbs.length <= 1 ? globalIndex : navigation).forEach(function (el) {
		var
			wrapper = el.parentNode,
			linkText = el.textContent.replace(trimRgxp, '');

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

		} else if (isIndex.test(linkText)) {
			el.textContent = linkText.replace(normalizeRgxp, '');

		} else {
			wrapper.parentNode.removeChild(wrapper);
		}
	});
})();
