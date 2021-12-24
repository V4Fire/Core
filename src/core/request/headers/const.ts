import type { HeaderName } from 'core/request/headers/interface';

export const maxValueLength = 128;

/* TODO:
* For Accept and Content-Type: can't contain a CORS-unsafe request header byte: 0x00-0x1F
* (except for 0x09 (HT), which is allowed), "():<>?@[\]{}, and 0x7F (DEL).
*/
export const simpleHeaders = {
	Accept: /[():<>?@[\\\]{}]+/,
	'Accept-Language': /[0-9A-Za-z *,\-.;=]+/,
	'Content-Language': /[0-9A-Za-z *,\-.;=]+/,
	'Content-Type': ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']
};

export const forbiddenHeaderNames = [
	'Accept-Charset',
	'Accept-Encoding',
	'Access-Control-Request-Headers',
	'Access-Control-Request-Method',
	'Connection',
	'Content-Length',
	'Cookie',
	'Cookie2',
	'Date',
	'DNT',
	'Expect',
	'Feature-Policy',
	'Host',
	'Keep-Alive',
	'Origin',
	'Proxy-',
	'Sec-',
	'Referer',
	'TE',
	'Trailer',
	'Transfer-Encoding',
	'Upgrade',
	'Via'
];

export const forbiddenResponseHeaderNames = [
	'Set-Cookie',
	'Set-Cookie2'
];

export const HeadersProperties: HeaderName[] = [
	'append',
	'delete',
	'get',
	'has',
	'set',
	'forEach'
];
