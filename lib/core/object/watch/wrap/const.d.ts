/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { WrapParams, WrapResult, StructureWrappers } from '../../../../core/object/watch/wrap/interface';
export declare const iterators: {
    keys: {
        type: string;
        value(target: unknown[], opts: WrapParams): IterableIterator<unknown>;
    };
    entries: {
        type: string;
        value(target: unknown[], opts: WrapParams): IterableIterator<[
            unknown,
            unknown
        ]>;
    };
    values: {
        type: string;
        value(target: unknown[]): IterableIterator<unknown>;
    };
    [Symbol.iterator]: {
        type: string;
        value: (target: unknown[]) => IterableIterator<unknown>;
    };
};
export declare const deleteMethods: {
    delete: (target: Map<unknown, unknown> | Set<unknown>, opts: WrapParams, key: unknown) => Nullable<WrapResult>;
};
export declare const clearMethods: {
    clear: (target: Set<unknown>, opts: WrapParams) => Nullable<WrapResult>;
};
export declare const weakMapMethods: {
    get: {
        type: string;
        value: (target: WeakMap<any, any>, opts: WrapParams, key: unknown) => unknown;
    };
    set: (target: WeakMap<any, any>, opts: WrapParams, key: unknown, value: unknown) => Nullable<WrapResult>;
    delete: (target: Map<unknown, unknown> | Set<unknown>, opts: WrapParams, key: unknown) => Nullable<WrapResult>;
};
export declare const weakSetMethods: {
    add: (target: WeakMap<any, any>, opts: WrapParams, value: unknown) => Nullable<WrapResult>;
    delete: (target: Map<unknown, unknown> | Set<unknown>, opts: WrapParams, key: unknown) => Nullable<WrapResult>;
};
export declare const structureWrappers: Pick<StructureWrappers, keyof StructureWrappers>;
