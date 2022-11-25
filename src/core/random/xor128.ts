/* eslint-disable no-bitwise */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export class Xor128 implements IterableIterator<number> {
	protected x: number;

	protected y: number = 0;
	protected z: number = 0;
	protected w: number = 0;

	constructor(seed: number) {
		this.x = seed;

		for (let i = 0; i < 64; i++) {
			this.next();
		}
	}

	[Symbol.iterator](): IterableIterator<number> {
		return this;
	}

	next(): IteratorResult<number> {
		const
			t = this.x ^ (this.x << 11);

		this.x = this.y;
		this.y = this.z;
		this.z = this.w;
		this.w ^= (this.w >> 19) ^ t ^ (t >> 8);

		return {
			done: false,
			value: this.w
		};
	}
}

const generator = new Xor128(19881989);

export default function random(): number {
	return (generator.next().value >>> 0) / ((1 << 30) * 4);
}
