/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import express from 'express';
export declare function createServer(): {
    handles: {
        json1: {
            response: (statusCode: number, body: object) => any;
            /**
             * @param {number} statusCode
             * @param {object} body
             */
            responseOnce: (statusCode: number, body: object) => any;
            clear: () => void;
            responder: () => any;
            respond: () => Promise<express.Response<any, Record<string, any>>>;
            calls: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
        };
        json2: {
            response: (statusCode: number, body: object) => any;
            /**
             * @param {number} statusCode
             * @param {object} body
             */
            responseOnce: (statusCode: number, body: object) => any;
            clear: () => void;
            responder: () => any;
            respond: () => Promise<express.Response<any, Record<string, any>>>;
            calls: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
        };
    };
    server: import("http").Server;
    clearHandles: () => void;
    destroy: () => Promise<void>;
};
