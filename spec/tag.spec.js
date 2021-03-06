require('./setup')
const Tags = require('../src/tags.js')

const docker = {
  push: function () {},
  tag: function () {}
}

describe('Tags', function () {
  describe('when tagging with a full image spec', function () {
    let dockerMock
    let tags
    before(function () {
      dockerMock = sinon.mock(docker)
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'repo/image:tag2')
        .once()
      tags = Tags(docker)
    })

    it('should tag the full source and target', function () {
      tags.tagImage('repo/image:tag1', 'repo/image:tag2')
      dockerMock.verify()
    })
  })

  describe('when tagging with a tag only', function () {
    let dockerMock
    let tags
    before(function () {
      dockerMock = sinon.mock(docker)
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'repo/image:tag2')
        .once()
      tags = Tags(docker)
    })

    it('should derive the target from the source spec', function () {
      tags.tagImage('repo/image:tag1', 'tag2')
      dockerMock.verify()
    })
  })

  describe('when tagging with multiple tags', function () {
    let dockerMock
    let tags
    before(function () {
      dockerMock = sinon.mock(docker)
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'repo/image:tag2')
        .once()
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'repo/image:tag3')
        .once()
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'repo/image:tag4')
        .once()
      tags = Tags(docker)
    })

    it('should derive the target from the source spec', function () {
      return tags.tagImage('repo/image:tag1', ['tag2', 'tag3', 'tag4'])
        .then(function () {
          return dockerMock.verify()
        })
    })
  })

  describe('when tagging from file with single tag', function () {
    let dockerMock
    let tags
    before(function () {
      dockerMock = sinon.mock(docker)
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'repo/image:test_tag')
        .once()
      tags = Tags(docker)
    })

    it('should derive the target from the source spec', function () {
      return tags.tagImage('repo/image:tag1', './spec/tag_file1.json')
        .then(function () {
          return dockerMock.verify()
        })
    })
  })

  describe('when tagging from buildinfo.json file', function () {
    let dockerMock
    let tags
    before(function () {
      dockerMock = sinon.mock(docker)
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'localhost:5080/test:tag2')
        .once()
      dockerMock.expects('tag')
        .withArgs('repo/image:tag1', 'localhost:5080/test:tag3')
        .once()
      tags = Tags(docker)
    })

    it('should derive the target from the source spec', function () {
      return tags.tagImage('repo/image:tag1')
        .then(function () {
          return dockerMock.verify()
        })
    })
  })

  describe('when pushing tags from tag_file1.json file', function () {
    let dockerMock
    let tags
    before(function () {
      dockerMock = sinon.mock(docker)
      dockerMock.expects('push')
        .withArgs('repo/a_test:test_tag')
        .once()
      tags = Tags(docker)
    })

    it('should derive the target from the source spec', function () {
      return tags.pushTags('repo/a_test', './spec/tag_file1.json')
        .then(function () {
          return dockerMock.verify()
        })
    })
  })

  describe('when pushing tags from buildinfo.json file', function () {
    let dockerMock
    let tags
    before(function () {
      dockerMock = sinon.mock(docker)
      dockerMock.expects('push')
        .withArgs('localhost:5080/test:tag2')
        .once()
      dockerMock.expects('push')
        .withArgs('localhost:5080/test:tag3')
        .once()
      tags = Tags(docker)
    })

    it('should derive the target from the source spec', function () {
      return tags.pushTags('localhost:5080/test')
        .then(function () {
          return dockerMock.verify()
        })
    })
  })
})
