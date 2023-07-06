import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';

import { loadSchema } from './schema.loader';

const PORT = parseInt(process.env.PORT as string, 10);

(async () => {
	const schema = await loadSchema('./graphql/schemas/test-schema.json');

	const yoga = createYoga({ schema });

	const server = createServer(yoga);
	server.listen(PORT, () => {
		console.info(`Server is running on http://localhost:${PORT}/graphql`);
	});
})().catch(console.error);
