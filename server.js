const http = require("http");
const app = require("./app");

/**
 * -----------USAGE FOR EACH MODULE----------
 *
 * http: Using it's Utilities that helps us to create a NodeJS WebServer
 * app: Exporting Our app.js as a module which consists of our express routing and other application related functions
 */

//Assigning a PORT on which our servver will listen
const PORT = 4000;

//Creating the server using the app module which we created in app.js
const server = http.createServer(app);

//Listening the server on the given port
server.listen(PORT, function () {
  console.log(`Server listening on PORT: ${PORT}`);
});
