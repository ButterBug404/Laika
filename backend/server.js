import http from 'http';
import {app} from './src/app.js';
import { initSockets } from './src/sockets.js';

const PORT = 3001;

const server = http.createServer(app);

initSockets(server);

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});


