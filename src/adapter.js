var Tag = require( "./tag" );

function tag( tagImpl, argv ) {
  var source;
  var tags;
  if( argv._.length > 1 ) {
    source = argv._[ 1 ];
  } else {
    source = argv.source || argv.s || argv.image || argv.i;
  }

  if( argv._.length > 2 ) {
    tags = argv._[ 2 ];
  } else {
    tags = argv.tag || argv.tags || argv.t;
  }
  return tagImpl( source, tags );
}

module.exports = function( docker ) {
  var tagImpl = Tag( docker );

  return {
    info: docker.info,
    tag: tag.bind( null, tagImpl ),
    version: docker.version
  }
}
