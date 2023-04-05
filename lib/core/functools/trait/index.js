"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.derive = derive;
function derive(...traits) {
  return target => {
    const proto = target.prototype;
    for (let i = 0; i < traits.length; i++) {
      const originalTrait = traits[i],
        chain = getTraitChain(originalTrait);
      for (let i = 0; i < chain.length; i++) {
        const [trait, keys] = chain[i];
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i],
            defMethod = Object.getOwnPropertyDescriptor(trait, key),
            traitMethod = Object.getOwnPropertyDescriptor(trait.prototype, key);
          const canDerive = defMethod != null && traitMethod != null && !(key in proto) && Object.isFunction(defMethod.value) && (Object.isFunction(traitMethod.value) || Object.isFunction(traitMethod.get) || Object.isFunction(traitMethod.set));
          if (canDerive) {
            const newDescriptor = {
              enumerable: false,
              configurable: true
            };
            if (Object.isFunction(traitMethod.value)) {
              Object.assign(newDescriptor, {
                writable: true,
                value: function defaultMethod(...args) {
                  return originalTrait[key](this, ...args);
                }
              });
            } else {
              Object.assign(newDescriptor, {
                get() {
                  return originalTrait[key](this);
                },
                set(value) {
                  originalTrait[key](this, value);
                }
              });
            }
            Object.defineProperty(proto, key, newDescriptor);
          }
        }
      }
    }
    function getTraitChain(trait, methods = Object.cast([])) {
      if (!Object.isFunction(trait) || trait === Function.prototype) {
        return methods;
      }
      methods.push([trait, Object.getOwnPropertyNames(trait)]);
      return getTraitChain(Object.getPrototypeOf(trait), methods);
    }
  };
}