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

## Login
```bash

```

## Build
```bash

```

## Tagging

### Automatically tag according to what's in .buildinfo.json
```bash
pequod tag myImage
```

### Using a custom json file with a `tag` property
```bash
pequod tag myImage /path/to/tagFile.json
```

## Pushing Built Tags

### Automatically push according to what's in .buildinfo.json
```bash
pequod pushTags
```

### Using a custom json file with a `tag` property
```bash
pequod pushTags myImage /path/to/tagFile.json
```

## API
All calls return promises which resolve or reject with the output of the command.

```js
var pequod = require( "pequod" )( false ); // sets sudo to false
```

#### build( tag, _workingPath_, _file_ )
`workingPath` and `file` are optional.

 * `workingPath` - default: "./"
 * `file` - default: "Dockerfile"

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

[travis-url]: https://travis-ci.org/arobson/pequod
[travis-image]: https://travis-ci.org/arobson/pequod.svg?branch=master
[coveralls-url]: https://coveralls.io/github/arobson/pequod?branch=master
[coveralls-image]: https://coveralls.io/repos/github/arobson/pequod/badge.svg?branch=master
