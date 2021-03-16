# core/request/error

This module provides a class for any request error and its details extractor.

## RequestError

A constructor of the class accepts two parameters: required `type` and optional `details`.

```
throw new RequestError('invalidStatus', details);
```

Now we support the following types of `RequestError`:

* `invalidStatus` - the response status from a server isn't considered as ok
* `abort` - the request was aborted
* `timeout` - the response from a server wasn't received for the expected amount of time
* `offline` - no network

The second parameter could contain `request` and `response` objects and the `error` object that is caused the problem.

## RequestErrorDetailsExtractor

The extractor gets details from `RequestError`. A constructor of the class accepts one optional parameter: `headerSettings`.
These settings allow filtering headers from request and response objects of the error's details object. It helps to hide
sensitive information.

The settings itself look like this:

```
const settings = {
  include: [...],
  exclude: [...]
};

const extractor = new RequestErrorDetailsExtractor(settings);
```

If the `include` array is defined, the extractor gets only headers from this array.
If the `exclude` array is defined, the extractor gets all available headers except the specified ones.
If both arrays are defined, then only `inlcude` array is using.
