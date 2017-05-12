var Tags = require( "./tags" );

function pushTags( tagImpl, argv ) {
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
  return tagImpl.pushTags( source, tags );
}

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
  return tagImpl.tagImage( source, tags );
}

module.exports = function( docker ) {
  var tagImpl = Tags( docker );

  return {
    info: docker.info,
    pushTags: pushTags.bind( null, tagImpl ),
    tag: tag.bind( null, tagImpl ),
    version: docker.version
  }
}
