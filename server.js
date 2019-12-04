const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); // allows the request to continue to the next middleware or route handler
}

// write a gatekeeper middleware that reads a password from the headers and if the password is 'mellon' let it continue
// if not send back status code 401 and a message

function gatekeeper(req, res, next) {
  const password = req.headers.password;
  if(password === 'mellon'){
    next();
  } else {
    res.status(401).json({ message: "Incorrect password."})
  }
}


server.use(helmet());
server.use(express.json());
server.use(logger)

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/area51", gatekeeper(), (req, res) => {
  res.send(req.headers);
});

module.exports = server;
