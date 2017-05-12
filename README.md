# pequod

A lib and command line utility to help with manipulating the Docker CLI. Built to work nicely with [buildGoggles](https://github.com/arobson/buildGoggles).

Primary use case (for now) is to read the `.buildinfo.json` file and tag a Docker image with all the tags found. Yeah, it _is_ simple, but it turns out this is an immense pain in the neck to pull off in most CIs/bash and pretty simple in Node.

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

## Tagging

### Automatically tag according to what's in .buildinfo.json
```bash
pequod tag myImage
```

### Using a custom json file with a `tag` property
```bash
pequod tag myImage /path/to/tagFile.json
```

There's more to it than this, but give this is really the primary reason for its existence, I'm gonna keep things boring for now √

[travis-url]: https://travis-ci.org/arobson/pequod
[travis-image]: https://travis-ci.org/arobson/pequod.svg?branch=master
[coveralls-url]: https://coveralls.io/github/arobson/pequod?branch=master
[coveralls-image]: https://coveralls.io/repos/github/arobson/pequod/badge.svg?branch=master
