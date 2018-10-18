var Tags = require('./tags')

module.exports = function (options) {
  var docker = require('../src/docker.js')(options)
  var tagImpl = Tags(docker)
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
    removeImage: docker.removeImage,
    tag: docker.tag,
    tagImage: tagImpl.tagImage,
    version: docker.version
  }
}
