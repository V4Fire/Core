# core/xml

This module provides a bunch of helper functions to work with XML documents.

```js
import { toDataURI } from 'core/xml';
import { getDataTypeFromURI } from 'core/mime-type';

const node = document.createElement('foo');
node.innerHTML = 'hello';

// "data:image/svg+xml;%3Cfoo xmlns='http://www.w3.org/1999/xhtml'%3Ehello%3C/foo%3E"
console.log(toDataURI(node));

// document
console.log(getDataTypeFromURI(toDataURI(node)));
```
