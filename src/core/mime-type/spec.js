/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { getDataType, getDataTypeFromURI } from 'core/mime-type';

describe('core/mime-type', () => {
	it('getDataType', () => {
		expect(getDataType('application/json')).toBe('json');
		expect(getDataType('application/x-protobuf;...')).toBe('arrayBuffer');
	});

	it('getDataTypeFromURI', () => {
		expect(getDataTypeFromURI('data:application/javascript;...')).toBe('text');
	});
});
