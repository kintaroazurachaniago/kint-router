# kint-router
This package is made to make it easier to use the **http** module in **nodejs**

# Usage

## index.js
```javascript
/* Get the module */
const Route = require('kint-router')

/* Registering available routes */
Route.get('/', (req, res) => res.end('Hello world'))
/*
  Register another route here
  use ":" symbol in url to get parameter from client url e.g.,
  
  Route.get('/:username', ...
  // request.params.username will contain 'kintaro' if client gives request to url '/kintaro'
  
  Or
  
  Route.post('/post/:slug', ...
  // request.params.slug will contain 'lorem-ipsum' if client gives request to url '/post/lorem-ipsum'
  // if the request method from the client is 'POST' then the data sent by the client can be retrieved from request.body with object data type
/*

/* Waiting for requests from clients */
Route.listen(4120/* port */, _ => console.log('Server running on port 4120')/* callback */)
```
