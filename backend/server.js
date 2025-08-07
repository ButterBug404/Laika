import http from 'http';
import {app} from './src/app.js';

const PORT = 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
