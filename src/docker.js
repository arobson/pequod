var when = require( "when" );
var spawn = require( "child_process" ).spawn;

function exec( sudo, command, args ) {
  return when.promise( function( res, rej ) {
    var out = [];
    var err = [];
    var cmd = sudo ? "sudo docker" : "docker";
    var fullArgs = [ command ].concat( args || [] );
    var pid = spawn( cmd, fullArgs );
    pid.stdout.on( "data", function( data ) {
      out.push( data );
    } );
    pid.stderr.on( "data", function( data ) {
      err.push( data );
    } );
    pid.on( "close", function( code ) {
      if( code != 0 || err.length > 0 ) {
        var error = new Error( "docker command failed with" );
        error.command = command;
        error.args = args;
        error.output = err;
        error.code = code;
        rej( error );
      } else {
        res( out );
      }
    } );
  } );
}

function info( sudo ) {
  return exec( sudo, "info" );
}

function tag( sudo, source, target ) {
  return exec( sudo, "tag", [ source, target ] );
}

function removeImage( sudo, source ) {
  return exec( sudo, "rmi", source );
}

function version( sudo ) {
  return exec( sudo, "version" );
}

module.exports = function( sudo ) {
  return {
    info: info.bind( null, sudo ),
    removeImage: removeImage.bind( null, sudo ),
    tag: tag.bind( null, sudo ),
    version: version.bind( null, sudo )
  }
};
