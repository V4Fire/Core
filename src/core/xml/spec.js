/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { toDataURI } from 'core/xml';
import { getDataTypeFromURL } from 'core/mime-type';

describe('core/xml', () => {
	it('toDataURI', () => {
		let
			doc;

		if (IS_NODE) {
			//#if node_js

			const
				{JSDOM} = require('jsdom'),
				{document} = new JSDOM().window;

			doc = document;

			//#endif

		} else if (typeof document !== 'undefined') {
			doc = document;
		}

		if (doc == null) {
			return;
		}

		const node = doc.createElement('foo');
		node.innerHTML = 'hello';

		expect(toDataURI(node)).toBe("data:image/svg+xml;%3Cfoo xmlns='http://www.w3.org/1999/xhtml'%3Ehello%3C/foo%3E");
		expect(getDataTypeFromURL(toDataURI(node))).toBe('document');
	});
});
