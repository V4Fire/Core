/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { ClearFilter } from '../../../../core/kv-storage/interface';
import type { StorageOptions, DataSeparators } from '../../../../core/kv-storage/engines/string/interface';
export default class StringEngine {
    /**
     * Serialized storage data
     */
    get serializedData(): string;
    /**
     * Serialized storage data
     */
    protected data: string;
    /**
     * Separators for keys and values for serialization into a string
     */
    protected separators: DataSeparators;
    /**
     * Replaces serialized storage data with new ones
     */
    protected set serializedData(data: string);
    /**
     * @param [opts] - additional options
     */
    constructor(opts?: StorageOptions);
    /**
     * Returns true if a value by the specified key exists in the storage
     * @param key
     */
    has(key: string): boolean;
    /**
     * Returns a value from the storage by the specified key
     * @param key
     */
    get(key: string): CanUndef<string>;
    /**
     * Stores a value to the storage by the specified key
     *
     * @param key
     * @param value
     * @throws {TypeError} if forbidden characters are used in the key or value when storing data
     */
    set(key: string, value: string): void;
    /**
     * Removes a value from the storage by the specified key
     * @param key
     */
    remove(key: string): void;
    /**
     * Returns a list of keys that are stored in the storage
     */
    keys(): string[];
    /**
     * Clears either the entire data storage or records that match the specified filter
     * @param filter
     */
    clear(filter?: ClearFilter<string>): void;
    /**
     * Update the data in the storage with the data passed from the dictionary
     * @param data - the dictionary with the data to be added to the storage
     */
    protected updateData(data: Dictionary<CanUndef<string>>): void;
    /**
     * Overwrites the data in the storage with the new data from the passed dictionary
     * @param data - the dictionary with the data to be saved in the storage
     */
    protected overwriteData(data: Dictionary<string>): void;
    /**
     * Returns data parsed as a dictionary from the serialized data string
     */
    protected getDataFromRaw(): StrictDictionary<string>;
}
