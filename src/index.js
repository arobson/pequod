var Tags = require( "./tags" );

module.exports = function( sudo ) {
  var docker = require( "../src/docker.js" )( sudo );
  var tagImpl = Tags( docker );
  return {
    build: docker.build,
    info: docker.info,
    login: docker.login,
    push: docker.push,
    pushTags: tagImpl.pushTags,
    removeImage: docker.removeImage,
    tag: docker.tag,
    tagImage: tagImpl.tagImage,
    version: docker.version
  };
}
