var Tags = require('./tags')

function build (docker, argv) {
  if (Array.isArray(argv)) {
    return docker.build.apply(null, argv)
  } else {
    return docker.build(argv.tag, argv.working, argv.file, argv.cacheFrom)
  }
}

function pushTags (tagImpl, argv) {
  var source
  var tags
  if (argv._.length > 1) {
    source = argv._[ 1 ]
  } else {
    source = argv.source || argv.s || argv.image || argv.i
  }

  if (argv._.length > 2) {
    tags = argv._[ 2 ]
  } else {
    tags = argv.tag || argv.tags || argv.t
  }
  return tagImpl.pushTags(source, tags)
}

function tag (tagImpl, argv) {
  var source
  var tags
  if (argv._.length > 1) {
    source = argv._[ 1 ]
  } else {
    source = argv.source || argv.s || argv.image || argv.i
  }

  if (argv._.length > 2) {
    tags = argv._[ 2 ]
  } else {
    tags = argv.tag || argv.tags || argv.t
  }
  return tagImpl.tagImage(source, tags)
}

module.exports = function (docker) {
  var tagImpl = Tags(docker)
  return {
    build: build.bind(null, docker),
    info: docker.info,
    login: docker.login,
    push: docker.push,
    pushTags: pushTags.bind(null, tagImpl),
    removeImage: docker.removeImage,
    tag: tag.bind(null, tagImpl),
    version: docker.version
  }
}
