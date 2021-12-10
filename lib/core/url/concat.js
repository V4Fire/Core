"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatURLs = concatURLs;
exports.concatUrls = concatUrls;

var _deprecation = require("../../core/functools/deprecation");

var _const = require("../../core/url/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Concatenates the specified parts of URL-s with correctly arranging of slashes and returns a new string
 *
 * @param urls
 *
 * @example
 * ```js
 * // 'foo/baz/bar/bla'
 * concatURLs('foo/baz', '/bar', 'bla');
 *
 * // 'http://foo.bar/bla'
 * concatURLs('http://foo.bar', 'bla');
 * ```
 */
function concatURLs(...urls) {
  let res = '';

  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];

    if (url == null || url === '') {
      continue;
    }

    url = url.replace(_const.endSlashesRgxp, '/');

    if (_const.isStrictAbsURL.test(url)) {
      res = url;
      continue;
    }

    if (i === 0) {
      res = url.replace(_const.startSlashesRgxp, str => str.slice(0, 2));
      continue;
    }

    url = url.replace(_const.startSlashesRgxp, '/');

    if (res === '') {
      res += url;
    } else {
      url = url.replace(_const.startSlashesRgxp, '');
      res += res.endsWith('/') ? url : `/${url}`;
    }
  }

  return res;
}
/**
 * @deprecated
 * @see [[concatURLs]]
 * @param urls
 */


function concatUrls(...urls) {
  (0, _deprecation.deprecate)({
    name: 'concatUrls',
    type: 'function',
    renamedTo: 'concatURLs'
  });
  return concatURLs(...urls);
}