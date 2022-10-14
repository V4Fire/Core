/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createDict } from 'core/prelude/object/create';

export const
	formatCache = createDict<Intl.NumberFormat>();

export const
	decPartRgxp = /\.\d+/;

export const globalFormatOpts = createDict({
	init: false,
	decimal: '.',
	thousands: ','
});

export const formatAliases = createDict({
	$: 'currency',
	$d: 'currencyDisplay',
	'%': 'percent',
	'.': 'decimal'
});

export const boolAliases = createDict({
	'+': true,
	'-': false
});

export const defaultFormats = createDict(<Intl.NumberFormatOptions>{
	style: 'decimal',
	currency: 'USD',
	currencyDisplay: 'symbol'
});
