/* Get the module */
const Route = require('./index')
/* Registering available routes */
Route.get('/', (req, res) => res.end('Hello world'))
/* Waiting for requests from clients */
Route.listen(4120, _ => console.log('Server running on port 4120'))