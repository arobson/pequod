var docker = require( "../src/docker" )( false );
var adapter = require( "../src/adapter" )( docker );

describe( "Adapter", function() {
  describe( "explicit tag", function() {
    it( "should tag the docker image", function() {
      return adapter.tag( { _: [ "tag", "alpine:3.4" ], tag: "3.4_custom" } )
        .should.be.fulfilled;
    } );

    after( function() {
      return docker.removeImage( "alpine:3.4_custom" );
    } );
  } );

  describe( "abbreviated tag", function() {
    it( "should tag the docker image", function() {
      return adapter.tag( { _: [ "tag", "alpine:3.4" ], t: "3.4_custom" } )
        .should.be.fulfilled;
    } );

    after( function() {
      return docker.removeImage( "alpine:3.4_custom" );
    } );
  } );

  describe( "implicit tag", function() {
    it( "should tag the docker image", function() {
      return adapter.tag( { _: [ "tag", "alpine:3.4", "magic" ] } )
        .should.be.fulfilled;
    } );

    after( function() {
      return docker.removeImage( "alpine:magic" );
    } );
  } );
} );
