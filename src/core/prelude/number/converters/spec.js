/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/number/converters', () => {
	it('seconds', () => {
		const res = 1000;
		expect((1).second()).toBe(res);
		expect((1).seconds()).toBe(res);
		expect(Number.seconds(1)).toBe(res);
	});

	it('minutes', () => {
		const res = 1000 * 60;
		expect((1).minute()).toBe(res);
		expect((1).minutes()).toBe(res);
		expect(Number.minutes(1)).toBe(res);
	});

	it('hours', () => {
		const res = 1000 * 60 * 60;
		expect((1).hour()).toBe(res);
		expect((1).hours()).toBe(res);
		expect(Number.hours(1)).toBe(res);
	});

	it('days', () => {
		const res = 1000 * 60 * 60 * 24;
		expect((1).day()).toBe(res);
		expect((1).days()).toBe(res);
		expect(Number.days(1)).toBe(res);
	});

	it('weeks', () => {
		const res = 1000 * 60 * 60 * 24 * 7;
		expect((1).week()).toBe(res);
		expect((1).weeks()).toBe(res);
		expect(Number.weeks(1)).toBe(res);
	});

	it('css helpers', () => {
		expect((1).em).toBe('1em');
		expect((1).rem).toBe('1rem');
		expect((1).px).toBe('1px');
		expect((1).per).toBe('1per');
		expect((1).vh).toBe('1vh');
		expect((1).vw).toBe('1vw');
		expect((1).vw).toBe('1vw');
		expect((1).vmin).toBe('1vmin');
		expect((1).vmax).toBe('1vmax');
	});
});
