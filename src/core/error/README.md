# core/error

The module provides the base class for an error. All classes of errors should extend this one.

## Reason
When TypeScript's target is < ES6, the transpiled code breaks inheritance from built-in classes.
For example:

```ts
class MyError extends Error {}
const error = new MyError();
if (error instanceof MyError) {  // false
}
if (error instanceof Error) {  // true
}
```

So `instanceof` won't work as expected. The same goes to a class that extends `MyError`: `instanceof` returns `true`
only for `Error` class.

`BaseError` fixes this problem. Moreover, `BaseError` takes care of `name` field and sets it correctly
in the constructor.

## How to use

```ts
import { BaseError } from 'core/error';

class ValidationError extends BaseError {}
```

## Additional abilities

### Message format

You can define error's message via first argument in `BaseError` constructor. Additionally `BaseError` allows you
to define a message format. It means that message can be generated based on arguments, passed to the error's class
constructor. To achieve this you need to override protected `format` method in an inheriting class.

`message` field always returns result of `format` method. And by default the method return string that is passed
to `BaseError`'s constructor as the first argument.

```ts
class ValidationError extends BaseError {
  fieldName: string;

  constructor(fieldName: string) {
    super();
    this.fieldName = fieldName;
  }

  format(): string {
    return `Invalid field: ${this.fieldName}`;
  }
}

const error = new ValidationError('FullName');
console.log(error.message); // Invalid field: FullName
```

### Causing error

It's possible to pass an error as the second argument to `BaseError` constructor. In this case it's considered
as the error that caused the new one. After this caused error can be accessed via readonly `cause` field.

```ts
class ExternalLibError extends BaseError {
  constructor(cause: Error) {
    super('External lib failed', cause);
  }
}

try {
  // calls of a lib functions
} catch (e) {
  const error = new ExternalLibError(e);
  // error.cause === e
  throw error;
}
```
