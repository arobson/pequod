const Tags = require('./tags')

function build (docker, argv) {
  if (Array.isArray(argv)) {
    const tag = argv[0]
    const options = {
      working: argv[1],
      file: argv[2],
      cacheFrom: argv[3],
      args: argv[4]
    }
    return docker.build(tag, options)
  } else {
    return docker.build(argv.tag, argv)
  }
}

function create (docker, argv) {
  if (Array.isArray(argv)) {
    const image = argv[0]
    const options = {
      name: argv[1]
    }
    return docker.create(image, options)
  } else {
    return docker.create(argv.image, argv)
  }
}

function exportContainer (docker, argv) {
  if (Array.isArray(argv)) {
    const container = argv[0]
    const options = {
      output: argv[1]
    }
    const onOut = pipe => {
      if (!options.output) {
        pipe.pipe(process.stdout)
        return process.stdout
      }
    }
    return docker.export(container, options)
      .then(onOut)
  } else {
    return docker.export(argv.container, argv)
  }
}

function importContainer (docker, argv, pipe) {
  if (Array.isArray(argv)) {
    const source = argv[0]
    const container = argv[1]
    const options = {
      message: argv[2],
      changes: argv.slice(3)
    }
    if (source === 'pipe') {
      options.pipe = pipe || process.stdin
      return docker.import('pipe', container, options)
    } else {
      return docker.import(source, container, options)
    }
  } else {
    return docker.import(argv.source, argv.container, argv)
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

function removeContainer (docker, argv) {
  if (Array.isArray(argv)) {
    const container = argv[0]
    const options = {
      force: argv[1],
      volumes: argv[2]
    }
    return docker.removeContainer(container, options)
  } else {
    return docker.removeContainer(argv.container, argv)
  }
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
  const tagImpl = Tags(docker)
  return {
    build: build.bind(null, docker),
    create: create.bind(null, docker),
    export: exportContainer.bind(null, docker),
    import: importContainer.bind(null, docker),
    info: docker.info,
    login: docker.login,
    pull: docker.pull,
    push: docker.push,
    pushTags: pushTags.bind(null, tagImpl),
    removeContainer: removeContainer.bind(null, docker),
    removeImage: docker.removeImage,
    tag: tag.bind(null, tagImpl),
    version: docker.version
  }
}
