/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export interface AssemblerOptions {
    /**
     * Should or not parse numeric values as string literals
     * @default `false`
     */
    numberAsString?: boolean;
    /**
     * Reviver function similar to `JSON.parse`
     */
    reviver?: JSONCb;
}
