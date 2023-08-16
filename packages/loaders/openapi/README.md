# Test cases for OpenAPI loader

This module contains a collection of test cases for the OmniGraph OpenAPI loader package.

## Existing test cases

### [FIXED] Should be possible to load a schema with components having any overlapping properties merged

**Test file location**

`packages/loaders/openapi/src/schema.loader.test.ts`

**Description**

For a component combining properties of different objects via the "allOf" keyword, if any property of these objects exists in more than one of them and this property is also an object, then these object-like overlapping properties will not be merged into one single object, combining all their different sub-properties. Instead, only the sub-properties of the last object-like overlapping property will be included in the resulting object.

To understand this better, let's consider the following example extracted from the files used to reproduce the issue.

The `packages/loaders/openapi/graphql/schemas/test-schema.json` schema contains a `Person` structure, which has been simplified a bit so as to make it easier to grasp:

```json
"Person": {
	"data": {
		"allOf": [{
			"attributes": {
				"description": "Address fields",
				"properties": {
					"street_name": { "type": "string" },
					"street_number": { "type": "string" },
					"postal_code": { "type": "string" },
					"city": { "type": "string" },
					"state": { "type": "string" },
					"country": { "type": "string" }
				}
			}
		}, {
			"attributes": {
				"description": "Contact fields",
				"properties": {
					"personal_email": { "type": "string" },
					"work_email": { "type": "string" },
					"personal_phone_number": { "type": "string" },
					"work_phone_number": { "type": "string" }
				}
			}
		}]
	}
}
```

When processing this schema, it should be expected that the `Person.data.attributes` sub-property resulted in the combination of all the `attributes` object-properties corresponding to the objects listed in the `allOf` operator:

```json
{
	"Person": {
		"data": {
			"attributes": {
				"street_name": {...},
				"street_number": {...},
				"postal_code": {...},
				"city": {...},
				"state": {...},
				"country": {...},
				"personal_email": {...},
				"work_email": {...},
				"personal_phone_number": {...},
				"work_phone_number": {...}
			}
		}
	}
}
```

Instead, only the last occurrence of `attributes` takes precedence in the resulting object:

```json
{
	"Person": {
		"data": {
			"attributes": {
				"personal_email": {...},
				"work_email": {...},
				"personal_phone_number": {...},
				"work_phone_number": {...}
			}
		}
	}
}
```

**Update**

- This issue was reported in the GraphQL Mesh GitHub repository [here](https://github.com/Urigo/graphql-mesh/issues/5641) and a [PR](https://github.com/Urigo/graphql-mesh/pull/5643) with a proposed fix has already been merged.
- The package [@graphql-mesh/json-schema@0.95.3](https://github.com/Urigo/graphql-mesh/releases/tag/release-1692058418907) containing the fix was released on August 15, 2023.
