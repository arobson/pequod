var when = require( "when" );
var format = require( "util" ).format;
var spawn = require( "child_process" ).spawn;
var path = require( "path" );

function exec( sudo, command, args ) {
  return when.promise( function( res, rej ) {
    var out = [];
    var err = [];
    var cmd = sudo ? "sudo docker" : "docker";
    var fullArgs = [ command ].concat( args || [] );
    var pid = spawn( cmd, fullArgs );
    pid.stdout.on( "data", function( data ) {
      out.push( data.toString() );
    } );
    pid.stderr.on( "data", function( data ) {
      err.push( data.toString() );
    } );
    pid.on( "close", function( code ) {
      if( code != 0 || err.length > 0 ) {
        var error = new Error( format( "docker command '%s', failed with\n %s", command, err.join( "\n" ) ) );
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

function build( sudo, tag, workingPath, file ) {
  var dockerfilePath = path.join( workingPath, file || "./Dockerfile" );
  return exec( sudo, "build", [ workingPath, "-f", dockerfilePath, "-t", tag ] );
}

function info( sudo ) {
  return exec( sudo, "info" );
}

function login( sudo, user, pass, server ) {
  var argList = [ "-u", user, "-p", pass ];
  if( server ) {
    argList.push( server );
  }
  return exec( sudo, "login", argList );
}

function push( sudo, image ) {
  return exec( sudo, "push", image );
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
    build: build.bind( null, sudo ),
    info: info.bind( null, sudo ),
    login: login.bind( null, sudo ),
    push: push.bind( null, sudo ),
    removeImage: removeImage.bind( null, sudo ),
    tag: tag.bind( null, sudo ),
    version: version.bind( null, sudo )
  }
};
