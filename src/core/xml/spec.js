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
		const node = document.createElement('foo');
		node.innerHTML = 'hello';
		expect(toDataURI(node)).toBe("data:image/svg+xml;%3Cfoo xmlns='http://www.w3.org/1999/xhtml'%3Ehello%3C/foo%3E");
		expect(getDataTypeFromURL(toDataURI(node))).toBe('document');
	});
});
