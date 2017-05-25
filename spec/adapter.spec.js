require( "./setup" );
var docker = require( "../src/docker" )( false );
var adapter = require( "../src/adapter" )( docker );

describe( "Adapter", function() {

  describe( "login", function() {
    it( "should fail to login with invalid credentials", function() {
      this.timeout( 8000 );
      return docker.login( "testuser", "passw0rd", "localhost:5080" )
        .should.be.rejectedWith( Error, "docker command \'login\', failed with\n Error response from daemon: login attempt to http://localhost:5080/v2/ failed with status: 401 Unauthorized\n" );
    } );

    it( "should login successfully with valid credentials", function() {
      this.timeout( 8000 );
      return adapter.login( "testuser", "testpass", "localhost:5080" )
        .should.be.fulfilled;
    } );
  } );

  describe( "build", function() {
    it( "should build image", function() {
      this.timeout( 20000 );
      return adapter.build( "./spec", "test-image", "Dockerfile.test" )
        .should.be.fulfilled;
    } );
  } );

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

  describe( "push tag", function() {
    it( "should push tag", function() {
      this.timeout( 8000 );
      return adapter.tag( { _: [ "tag", "alpine:3.4", "localhost:5080/alpine:custom" ] } )
        .then( function() {
          return adapter.pushTags( { _: [ "pushTags", "localhost:5080/alpine", "custom" ] } )
        } ).should.be.fulfilled;
    } );
  } );

  describe( "push from build json", function() {
    it( "should push tag", function() {
      this.timeout( 8000 );
      return adapter.tag( { _: [ "tag", "alpine:3.4" ] } )
        .then( function() {
          return adapter.pushTags( { _: [ "pushTags", "localhost:5080/test" ] } )
            .then( function( result ) {
              console.log( result.join( "\n" ) );
            } )
        } ).should.be.fulfilled;
    } );
  } );
} );
