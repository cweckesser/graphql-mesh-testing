# Test cases for Mesh Config

This module contains a collection of test cases for GraphQL Mesh's config package.

## Existing test cases

### Should be possible to resolve a custom fetch function when building a GraphQL Mesh project

**Description**

A GraphQL Mesh project that defines a custom fetch can only successfully resolve it when the project is executed using the `mesh dev` command.
If the project is first built (`mesh build`) and then executed (`mesh start`), then the file containing the custom fetch function, specified via the `customFetch` configuration property, will fail to be resolved.

To reproduce this issue, from the project's root folder navigate to the `config` sub-project folder:

```sh
cd ./packages/config
```

Then build the project using Yarn and then run it in development mode:

```sh
yarn
yarn mesh:dev
```

The config project should be accessible on `http://localhost:3000/graphql` (the port value can be changed in the `.env` file).
Notice that no errors are logged in the console and that the application runs with no issues.

Now, if the project is built in production mode and then executed via the following commands:

```sh
yarn mesh:build
yarn mesh:start
```

Then the project will fail to start logging the following error message:

```sh
Mesh Error: Cannot find module '../src/utils/custom-fetch.ts'
```
