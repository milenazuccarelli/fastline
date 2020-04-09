# fastline
Architectural foundation for a website lifecycle. From local setup to continuos deployment.

## Contributing

If you want to require @fastline/core locally in order to test it before publishing it you need to follow these steps:

- go to `packages/core` and run `npm run prepare`. This will ensure you generate/update the `lib/bundle.js` file.
- go to `you/test/app/path` and add the following script to your `main.js` (or whatever is your application main file).

```javascript
const fastline = require("path/to/fastline/packages/core");

fastline();
```
