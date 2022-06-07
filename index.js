// require your server and launch it here
const port = process.env.PORT || 9000;

const server = require('./api/server');

server.listen(port, () => {
    console.log(`server is running at ${port}`);
});