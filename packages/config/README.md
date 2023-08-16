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

**Cause of the issue**

When a Mesh project is built, a `.mesh` directory is created in the same path where the `.meshrc.yml` file is found. E.g.:

```sh
<PATH_TO_MY_MESH_PROJECT>/graphql/.meshrc.yml
<PATH_TO_MY_MESH_PROJECT>/graphql/.mesh # File created by the `mesh build` command
```

The `.mesh` directory will contain a `schemas` folder (containing the definitions for all the schemas listed in the `sources` section of the `.meshrc.yml` file) and a `index.ts` file.

If the Mesh project requires a custom fetch function, it can be implemented in a JS/TS file, and then that file can be specified in the `.meshrc.yml` configuration file via the `customFetch` property. Afterwards, when the project is built, the above-mentioned `.mesh/index.ts` file will contain an `import` statement with the path to the file implementing the custom fetch.

The issue occurs when the path to the custom fetch is specified as a **relative path**, because that path is not adjusted properly when included in the `index.ts` file. This is, the path specified in the `.meshrc.yml` file cannot be used verbatim in the `index.ts` file, due to the latter being located in a different folder:

```sh
<PATH_TO_MY_MESH_PROJECT>/graphql/.meshrc.yml
<PATH_TO_MY_MESH_PROJECT>/graphql/.mesh/index.ts # Located in a sub-folder from the .meshrc.yml file (i.e. on a "1st level" sub-folder)
```

The path needs, therefore, to be adjusted by navigating "one level up", this is, by prepending `../` to the relative path of the custom fetch file.

In the current implementation that generates the `import` statement that [loads custom fetch file](https://github.com/Urigo/graphql-mesh/blob/1cb22ee63e13910c249587bd7fecacbc7d6dae87/packages/config/src/utils.ts#L66), it can be observed that relative paths are not being adjusted. Here, the `resolveCustomFetch` function loads the custom fetch by invoking the `getPackage` function.

On the other hand, in the implementation that generates the code that [dynamically loads envelop plugins](https://github.com/Urigo/graphql-mesh/blob/1cb22ee63e13910c249587bd7fecacbc7d6dae87/packages/config/src/process.ts#L567-L571) the relative paths are adjusted accordingly.
