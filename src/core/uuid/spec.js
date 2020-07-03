/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { generate, serialize, parse, validate } from 'core/uuid';

describe('core/uuid', () => {
	const
		uuid = new Uint8Array([174, 42, 253, 26, 185, 60, 17, 234, 179, 222, 2, 66, 172, 19, 0, 4]);

	it('generate', () => {
		expect(generate()).toBeInstanceOf(Uint8Array);
	});

	it('serialize', () => {
		expect(serialize(uuid)).toEqual('ae2afd1a-b93c-11ea-b3de-0242ac130004');
	});

	it('parse', () => {
		expect(parse('ae2afd1a-b93c-11ea-b3de-0242ac130004')).toEqual(uuid);
	});
});
