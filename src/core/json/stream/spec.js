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
	'.cio.gov/v1.1/schema/catalog.jsonld",\n\t"@type": "dcat:Catalog"\n},\n{\n\t"фальшивые данные чтобы добавить',
	'разных типов": [1, null, true, false, "текст на русском"]\n}]\n'
];

const asyncIterable = {
	async*[Symbol.asyncIterator]() {
		let i = 0;

		while (i < data.length) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			yield data[i++];
		}
	}
};

describe('core/json/stream', () => {
	describe('json stream parser', () => {

	});

	describe('json stream assembler', () => {

	});

	describe('json stream filters', () => {

	});

	describe('json stream streams', () => {

	});
});
