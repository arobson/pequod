var Tags = require( "./tags" );

module.exports = function( sudo, log ) {
  var docker = require( "../src/docker.js" )( sudo, log );
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
