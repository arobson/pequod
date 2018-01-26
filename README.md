# pequod

A lib and command line utility to help with manipulating the Docker CLI. Built to work nicely with [buildGoggles](https://github.com/arobson/buildGoggles).

Primary use case (for now) is to read the `.buildinfo.json` file and tag a Docker image with all the tags found. Yeah, it _is_ simple, but it turns out this is an immense pain in the neck to pull off in most CIs/bash and pretty simple in Node.

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

## Testing
A local Docker registry for the push integration tests.

__Start local registry__
```bash
./setup-registry.sh
```

__Tear down local registry__
```bash
./kill-registry.sh
```

## API
All calls return promises which resolve or reject with the output of the command.

```js
var pequod = require( "pequod" )( false, logger ); // sets sudo to false
```

 * logger - optional log call that accepts string output from Docker process

#### build( tag, _workingPath_, _file_, _cacheFrom_ )

#### `build ( tag, [options] )`

`options` is a hash of fields:

 * `working` - default: "./"
 * `file` - default: "Dockerfile"
 * `cacheFrom` - provide a image specification for Docker to build off of
 * `args` - a hash of key/values used to populate `ARG`s defined in the Dockerfile

```js
pequod
  .build( "test-image" )
  .then( function( list ) {
    // the list of console lines output
  } );
```

#### info()

```js
pequod
  .info()
  .then( function( list ) {
    // the list of console lines output
  } );
```

#### login( user, pass, _server_ )
`server` is optional and defaults to the official Docker hub.

```js
pequod
  .login( "$DOCKER_USER", "$DOCKER_PASS" )
  .then( function( list ) {
    // the list of console lines output
  } );
```

#### pull( image )
Pulls an image.

```js
pequod
  .pull( "test-image" )
  .then( function( list ) {
    // the list of console lines output
  } );
```

#### push( image )
Pushes the image.

```js
pequod
  .push( "test-image" )
  .then( function( list ) {
    // the list of console lines output
  } );
```

#### pushTags( image )
Pushes all tags specified in `./.buildinfo.json`.

```js
pequod.pushTags( "test-image" );
```

#### tag( source, target )
Tags the source image with the specified target tag.

```js
pequod
  .tag( "test-image", "test-image:1.1" )
  .then( function( list ) {
    // the list of console lines output
  } );
```

#### tagImage( source )
Tags the source image according to a `./.buildinfo.json`.

```js
pequod.tagImage( "test-image" );
```

#### removeImage( source )
Removes the image (or untags it).

```js
pequod
  .removeImage( "test-image" )
  .then( function( list ) {
    // the list of console lines output
  } );
```

#### version()
```js
pequod
  .version()
  .then( function( list ) {
    // the list of console lines output
  } );
```

There's more to it than this, but give this is really the primary reason for its existence, I'm gonna keep things boring for now √

[travis-url]: https://travis-ci.org/npm-wharf/pequod
[travis-image]: https://travis-ci.org/npm-wharf/pequod.svg?branch=master
[coveralls-url]: https://coveralls.io/github/npm-wharf/pequod?branch=master
[coveralls-image]: https://coveralls.io/repos/github/npm-wharf/pequod/badge.svg?branch=master
