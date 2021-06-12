const Tags = require('./tags')

module.exports = function (options) {
  const docker = require('../src/docker.js')(options)
  const tagImpl = Tags(docker)
  return {
    build: docker.build,
    create: docker.create,
    export: docker.export,
    import: docker.import,
    info: docker.info,
    inspect: docker.inspect,
    login: docker.login,
    pull: docker.pull,
    push: docker.push,
    pushTags: tagImpl.pushTags,
    removeContainer: docker.removeContainer,
    removeImage: docker.removeImage,
    tag: docker.tag,
    tagImage: tagImpl.tagImage,
    version: docker.version
  }
}
