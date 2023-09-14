# Test cases for Mesh CLI

This module contains a collection of test cases for GraphQL Mesh's CLI package.

## Existing test cases

### Should be possible to resolve Mesh configuration in TS format when building the project sources

**Description**

A GraphQL Mesh project having its configuration in a TS file fails to execute after being compiled. In this case, the project builds the Mesh configuration and the main application file. The latter starts an Express application and mounts Mesh as a route.

To reproduce this issue, from the project's root folder navigate to the `config` sub-project folder:

```sh
cd ./packages/cli
```

Then build the project using Yarn and then start it:

```sh
yarn
yarn mesh:build
yarn ts:build
yarn start
```

The application will fail to start and will output the following error:

```sh
Error: Cannot find module './../.meshrc.ts'
Require stack:
- /<PATH_TO_PROJECT>/graphql-mesh-testing/packages/cli/dist/.mesh/index.js
- /<PATH_TO_PROJECT>/graphql-mesh-testing/packages/cli/dist/index.js
...
```

**Cause of the issue**

When building Mesh typically a `.mesh` folder will be created (unless changed via configuration) and within this folder a `index.ts` file will be created, along with schema and type files.

The mentioned index file should be found at `packages/cli/src/.mesh/index.ts` and its contents will have references to the Mesh configuration file that will include the `.ts` extension:

```ts
...

import * as importedModule$0 from "./../.meshrc.ts"; // <--- Extension included for the Mesh configuration file!

...

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".meshrc.ts": // <--- Extension included for the Mesh configuration file!
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

...
```

The issue with this is that, when compiled, the reference to a `.ts` file will still be present in the compiled `.js` file. This causes the file (or module) not to be found.
