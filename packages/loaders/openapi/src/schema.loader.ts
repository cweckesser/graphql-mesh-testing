import loadGraphQLSchemaFromOpenAPI from '@omnigraph/openapi';

export async function loadSchema(source: string) {
	const schema = await loadGraphQLSchemaFromOpenAPI('TEST', {
		fetch,
		cwd: './',
		source,
	});
	return schema;
}
