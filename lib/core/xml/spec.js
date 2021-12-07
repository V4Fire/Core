"use strict";

var _xml = require("../../core/xml");

var _mimeType = require("../../core/mime-type");

var _env = require("../../core/env");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/xml', () => {
  it('`toDataURI`', () => {
    let doc;

    if (_env.IS_NODE) {
      const {
        JSDOM
      } = require('jsdom'),
            {
        document
      } = new JSDOM().window;

      doc = document;
    } else if (typeof document !== 'undefined') {
      doc = document;
    }

    if (doc == null) {
      return;
    }

    const node = doc.createElement('foo');
    node.innerHTML = 'hello';
    expect((0, _xml.toDataURI)(node)).toBe("data:image/svg+xml;%3Cfoo xmlns='http://www.w3.org/1999/xhtml'%3Ehello%3C/foo%3E");
    expect((0, _mimeType.getDataTypeFromURI)((0, _xml.toDataURI)(node))).toBe('document');
  });
});