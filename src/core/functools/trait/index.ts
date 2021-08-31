/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/functools/trait/README.md]]
 * @packageDocumentation
 */

/**
 * Derives the provided traits to a class.
 * The function is used to organize multiple implementing interfaces with the support of default methods.
 *
 * @decorator
 * @param traits
 *
 * @example
 * ```typescript
 * abstract class Interface1 {
 *   abstract bar(): string;
 *
 *   /**
 *    * The method that have the default implementation.
 *    * The implementation is placed as a static method.
 *    *\/
 *   bla(a: number): number {
 *     return <any>null;
 *   };
 *
 *   /**
 *    * The default implementation for `Interface1.bla`.
 *    * As the first parameter, the method is taken a context.
 *    *
 *    * @see Interface1.bla
 *    *\/
 *   static bla: AddSelf<iFoo['bla'], Baz> = (self, a) => a + 1;
 * }
 *
 * abstract class Interface2 {
 *   abstract bar2(): string;
 *
 *   bla2(a: number): string {
 *     return <any>null;
 *   };
 *
 *   /** @see Interface2.bla2 *\/
 *   static bla2: AddSelf<iFoo2['bla2'], Baz> = (self, a) => a.toFixed();
 * }
 *
 * interface Baz extends Trait<typeof iFoo>, Trait<typeof iFoo2> {
 *
 * }
 *
 * @derive(iFoo, iFoo2)
 * class Baz implements iFoo, iFoo2 {
 *   bar() {
 *     return '1';
 *   }
 *
 *   bar2() {
 *     return '1';
 *   }
 * }
 *
 * console.log(new Baz().bla2(2.9872));
 * ```
 */
export function derive(...traits: Function[]) {
	return (target: Function): void => {
		const
			proto = target.prototype;

		for (let i = 0; i < traits.length; i++) {
			const
				originalTrait = traits[i],
				chain = getTraitChain(originalTrait);

			for (let i = 0; i < chain.length; i++) {
				const
					[trait, keys] = chain[i];

				for (let i = 0; i < keys.length; i++) {
					const
						key = keys[i],
						defMethod = Object.getOwnPropertyDescriptor(trait, key),
						traitMethod = Object.getOwnPropertyDescriptor(trait.prototype, key);

					const canDerive =
						defMethod != null &&
						traitMethod != null &&
						!(key in proto) &&

						Object.isFunction(defMethod.value) && (
							Object.isFunction(traitMethod.value) ||

							// eslint-disable-next-line @typescript-eslint/unbound-method
							Object.isFunction(traitMethod.get) || Object.isFunction(traitMethod.set)
						);

					if (canDerive) {
						const newDescriptor: PropertyDescriptor = {
							enumerable: false,
							configurable: true
						};

						if (Object.isFunction(traitMethod.value)) {
							Object.assign(newDescriptor, {
								writable: true,

								// eslint-disable-next-line func-name-matching
								value: function defaultMethod(...args: unknown[]) {
									return originalTrait[key](this, ...args);
								}
							});

						} else {
							Object.assign(newDescriptor, {
								get() {
									return originalTrait[key](this);
								},

								set(value: unknown) {
									originalTrait[key](this, value);
								}
							});
						}

						Object.defineProperty(proto, key, newDescriptor);
					}
				}
			}
		}

		function getTraitChain<T extends Array<[Function, string[]]>>(trait: Nullable<object>, methods: T = <any>[]): T {
			if (!Object.isFunction(trait) || trait === Function.prototype) {
				return methods;
			}

			methods.push([trait, Object.getOwnPropertyNames(trait)]);
			return getTraitChain(Object.getPrototypeOf(trait), methods);
		}
	};
}
