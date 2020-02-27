# fastline
Architectural foundation for a website lifecycle. From local setup to continuous deployment.

## Quick start

TODO

## Contributing

Fork and clone the repository locally. 

From the root of the project run:

```bash
npm install
``` 

Then you should be able to use Lerna. Try bootstrapping Fastline packages:

```bash
lerna bootstrap
```

This command will install all packages dependencies. You need to run it only once. If the command doens't work you might need to install Lerna globally or make sure `lerna` is a available in your current bash configuration file (see [this thread](https://stackoverflow.com/questions/50522215/unable-to-run-lernas-command)).

To publish a new release use:

```bash
lerna publish
```

The above command generate a new version for all packages. (We might change this method in the future, but for now let's keep it)

Note: in order to release new version of the package you need to be part of the @fastline organization.