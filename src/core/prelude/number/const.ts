/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	formatCache = Object.createDict<Intl.NumberFormat>();

export const
	decPartRgxp = /\.\d+/;

export const globalOpts = Object.createDict({
	init: false,
	decimal: '.',
	thousands: ','
});

export const formatAliases = Object.createDict({
	$: 'currency',
	$d: 'currencyDisplay',
	'%': 'percent',
	'.': 'decimal'
});

export const boolAliases = Object.createDict({
	'+': true,
	'-': false
});

export const defaultFormats = Object.createDict(<Intl.NumberFormatOptions>{
	style: 'decimal',
	currency: 'USD',
	currencyDisplay: 'symbol'
});
