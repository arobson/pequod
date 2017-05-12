var when = require( "when" );
var fs = require( "fs" );
var path = require( "path" );

function applyTag( docker, source, target ) {
  return docker.tag( source, target );
}

function buildInfoExists( file ) {
  return fs.existsSync( file );
}

function getImageTag( source, tag ) {
  var sourceImage = source.split( ":" )[ 0 ];
  return [ sourceImage, tag ].join( ":" );
}

function loadTagsFrom( file ) {
  return when.promise( function( resolve, reject ) {
    fs.readFile( file, 'utf8', function( err, content ) {
      if( err ) {
        reject( err );
      } else {
        var json = JSON.parse( content );
        resolve( json.tag );
      }
    } );
  } );
}

function selectTags( docker, source, tag ) {
  if( tag ) {
    if( buildInfoExists( tag ) ) {
      return loadTagsFrom( tag )
        .then( function( tags ) {
          return tagImage( docker, source, tags );
        } );
    } else {
      return tagImage( docker, source, tag );
    }
  } else {
    return selectTags( docker, source, "./.buildinfo.json" );
  }
}

function tagImage( docker, source, tag ) {
  if( Array.isArray( tag ) ) {
    return when.all( tag.map( tagImage.bind( null, docker, source ) ) );
  } else {
    var target = tag;
    if( tag.indexOf( ":" ) < 0 ) {
      target = getImageTag( source, tag );
    }
    return applyTag( docker, source, target );
  }
}

module.exports = function( docker ) {
  return selectTags.bind( null, docker );
};
