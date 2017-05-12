require( "./setup" );
var Tag = require( "../src/tag.js" );

var docker = {
  tag: function() {}
};

describe( "Tag", function() {
  describe( "when tagging with a full image spec", function() {
    var dockerMock;
    var tag;
    before( function() {
      dockerMock = sinon.mock( docker );
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:tag2" )
        .once();
      tag = Tag( docker );
    } );

    it( "should tag the full source and target", function() {
      tag( "repo/image:tag1", "repo/image:tag2" );
      dockerMock.verify();
    } );
  } );

  describe( "when tagging with a tag only", function() {
    var dockerMock;
    var tag;
    before( function() {
      dockerMock = sinon.mock( docker );
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:tag2" )
        .once();
      tag = Tag( docker );
    } );

    it( "should derive the target from the source spec", function() {
      tag( "repo/image:tag1", "tag2" );
      dockerMock.verify();
    } );
  } );

  describe( "when tagging with multiple tags", function() {
    var dockerMock;
    var tag;
    before( function() {
      dockerMock = sinon.mock( docker );
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:tag2" )
        .once();
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:tag3" )
        .once();
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:tag4" )
        .once();
      tag = Tag( docker );
    } );

    it( "should derive the target from the source spec", function() {
      return tag( "repo/image:tag1", [ "tag2", "tag3", "tag4" ] )
        .then( function() {
          return dockerMock.verify();
        } );
    } );
  } );

  describe( "when tagging from file", function() {
    var dockerMock;
    var tag;
    before( function() {
      dockerMock = sinon.mock( docker );
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:test_tag" )
        .once();
      tag = Tag( docker );
    } );

    it( "should derive the target from the source spec", function() {
      return tag( "repo/image:tag1", "./spec/tag_file1.json" )
        .then( function() {
          return dockerMock.verify();
        } );
    } );
  } );

  describe( "when tagging from buildinfo.json file", function() {
    var dockerMock;
    var tag;
    before( function() {
      dockerMock = sinon.mock( docker );
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:tag2" )
        .once();
      dockerMock.expects( "tag" )
        .withArgs( "repo/image:tag1", "repo/image:tag3" )
        .once();
      tag = Tag( docker );
    } );

    it( "should derive the target from the source spec", function() {
      return tag( "repo/image:tag1" )
        .then( function() {
          return dockerMock.verify();
        } );
    } );
  } );
} );
