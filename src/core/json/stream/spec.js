/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { from, assemble, filter, pick, streamArray } from 'core/json/stream';

const data = [
	'[{\n\t"fields": "利点がある,利点はない,不詳",\n\t"data": [\n\t\t{\n\t\t\t"count": 314,\n\t\t\t"field": "利点がある",\n\t\t\t"age":',
	' "18-19",\n\t\t\t"investigation-year": 1987,\n\t\t\t"sex": "M"\n\t\t},\n\t\t{\n\t\t\t"count": 966,\n\t\t\t"field": "利点がある",\n\t\t\t"age": "20-24',
	'",\n\t\t\t"investigation-year": 1987,\n\t\t\t"sex": "M"\n\t\t},\n\t\t{\n\t\t\t"count": 680,\n\t\t\t"field": "利点がある",\n\t\t\t"age": "25-29",\n\t\t\t"',
	'investigation-year": 1987,\n\t\t\t"sex": "M"\n\t\t},\n\t\t{\n\t\t\t"count": 318,\n\t\t\t"field": "利点がある",\n\t\t\t"age": "30-34",\n\t\t\t"investi',
	'gation-year": 1987,\n\t\t\t"sex": "M"\n\t\t}\n\t],\n\t"id": "S007",\n\t"name": "調査別、男女年齢（５歳階級）別、結婚の利�',
	'��の有無および独身生活の利点の有無別、未婚者数"\n},\n{\n\t"conformsTo": "https://project-open-data.cio.gov/v1.',
	'1/schema",\n\t"describedBy": "https://project-open-data.cio.gov/v1.1/schema/catalog.json",\n\t"@context": "https://project-open-data',
	'.cio.gov/v1.1/schema/catalog.jsonld",\n\t"@type": "dcat:Catalog"\n},\n{\n\t"фальшивые данные чтобы добавить ',
	'разных типов": [1, null, true, false, "текст на русском"]\n}]\n'
];

const target = [
	{
		fields: '利点がある,利点はない,不詳',
		data: [
			{
				count: 314,
				field: '利点がある',
				age: '18-19',
				'investigation-year': 1987,
				sex: 'M'
			},
			{
				count: 966,
				field: '利点がある',
				age: '20-24',
				'investigation-year': 1987,
				sex: 'M'
			},
			{
				count: 680,
				field: '利点がある',
				age: '25-29',
				'investigation-year': 1987,
				sex: 'M'
			},
			{
				count: 318,
				field: '利点がある',
				age: '30-34',
				'investigation-year': 1987,
				sex: 'M'
			}
		],
		id: 'S007',
		name: '調査別、男女年齢（５歳階級）別、結婚の利���の有無および独身生活の利点の有無別、未婚者数'
	},
	{
		conformsTo: 'https://project-open-data.cio.gov/v1.1/schema',
		describedBy: 'https://project-open-data.cio.gov/v1.1/schema/catalog.json',
		'@context': 'https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld',
		'@type': 'dcat:Catalog'
	},
	{
		'фальшивые данные чтобы добавить разных типов': [1, null, true, false, 'текст на русском']
	}
];

const asyncIterable = {
	async*[Symbol.asyncIterator]() {
		let i = 0;

		while (i < data.length) {
			await new Promise((resolve) => setTimeout(resolve, 10));
			yield data[i++];
		}
	}
};

describe('core/json/stream', () => {
	describe('json stream parser', () => {
		it('should parse json from async iterator to tokens', async () => {
			const result = [];

			for await (const chunk of from(asyncIterable)) {
				result.push(chunk);
			}

			expect(result.length).toBe(268);
		});

	});

	describe('json stream assembler', () => {
		it('should assemble valid js structure from json tokens', async () => {
			let result;

			for await (const chunk of assemble(from(asyncIterable))) {
				result = chunk;
			}

			expect(result).toEqual(target);
		});

	});

	describe('json stream filters', () => {
		it('should filter json and take only data field with structure saving', async () => {
			let result;

			for await (const chunk of assemble(filter(from(asyncIterable), {filter: /data/}))) {
				result = chunk;
			}

			expect(result).toEqual([{data: target[0].data}]);
		});

		it('should filter json and take only data field without structure saving', async () => {
			let result;

			for await (const chunk of assemble(pick(from(asyncIterable), {filter: /data/}))) {
				result = chunk;
			}

			expect(result).toEqual(target[0].data);
		});
	});

	describe('json stream streams', () => {
		it('should stream array element in every iteration', async () => {
			let index = 0;

			for await (const chunk of streamArray(pick(from(asyncIterable), {filter: /data/}))) {
				expect(chunk).toEqual({key: index, value: target[0].data[index++]});
			}
		});
	});
});
