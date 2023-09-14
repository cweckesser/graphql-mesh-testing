import express from 'express';

import { createBuiltMeshHTTPHandler } from './.mesh';

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(
	'/graphql',
	createBuiltMeshHTTPHandler(),
);

app.listen(PORT, () => {
	console.info(`Application listening on port ${PORT}`);
});
