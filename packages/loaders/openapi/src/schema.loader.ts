import loadGraphQLSchemaFromOpenAPI from '@omnigraph/openapi';

export async function loadSchema(source: string) {
	const schema = await loadGraphQLSchemaFromOpenAPI('TEST', {
		cwd: './',
		source,
	});
	return schema;
}
