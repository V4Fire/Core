# core/request/error

This module provides a class for any request error and its details' extractor.

## RequestError

A constructor of the class accepts two parameters: required `type` and optional `details`.

```
throw new RequestError(RequestError.InvalidStatus, details);
```

Now we support the following types of `RequestError`:

* `RequestError.InvalidStatus` - a server has responded with a non-ok status;
* `RequestError.Abort` - a request was aborted;
* `RequestError.Timeout` - a request was aborted because of a timeout;
* `RequestError.Offline` - a request was failed because there is no connection to a network;
* `RequestError.Engine` - a request was failed because of an internal request engine' error.

The second parameter could contain `request` and `response` objects and an `error` object that is caused the problem.

## RequestErrorDetailsExtractor

The extractor gets details from `RequestError`. A constructor of the class accepts one optional parameter with extra options.
These options allow filtering headers from request and response objects of the error's details object. It helps to hide
sensitive information.

The options itself look like this:

```js
const opts = {
  headers: {
    include: [/*...*/],
    exclude: [/*...*/]
  }
};

const extractor = new RequestErrorDetailsExtractor(opts);
```

If `include` is defined, the extractor gets only headers from this array.
If `exclude` is defined, the extractor gets all available headers except the specified ones.
If both options are defined, then only `inlcude` option will be used.
