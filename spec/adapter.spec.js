require('./setup')
var docker = require('../src/docker')({ sudo: false })
var adapter = require('../src/adapter')(docker)

describe('Adapter', function () {
  describe('login', function () {
    it('should fail to login with invalid credentials', function () {
      this.timeout(8000)
      return docker.login('testuser', 'passw0rd', 'localhost:5080')
        .should.be.rejectedWith(Error, 'docker command \'login\', failed with\n Error response from daemon: login attempt to http://localhost:5080/v2/ failed with status: 401 Unauthorized\n')
    })

    it('should login successfully with valid credentials', function () {
      this.timeout(8000)
      return adapter.login('testuser', 'testpass', 'localhost:5080')
        .should.be.fulfilled
    })
  })

  describe('build', function () {
    it('should build image with hash argv', function () {
      this.timeout(20000)
      return adapter.build({tag: 'test-image', working: './spec', file: 'Dockerfile.test'})
        .should.be.fulfilled
    })

    it('should build image with hash argv and cacheFrom', function () {
      this.timeout(20000)
      return adapter.build(
        {
          tag: 'test-image',
          working: './spec',
          file: 'Dockerfile.test',
          cacheFrom: 'test-image:latest'
        }
      ).should.be.fulfilled
    })

    it('should build image with hash argv, build args and cacheFrom', function () {
      this.timeout(20000)
      return adapter.build(
        {
          tag: 'test-image',
          working: './spec',
          file: 'Dockerfile.args',
          cacheFrom: 'test-image:latest',
          args: {
            package: 'curl'
          }
        }
      ).should.be.fulfilled
    })

    it('should build image with array argv', function () {
      this.timeout(20000)
      return adapter.build(['test-image', './spec', 'Dockerfile.test'])
        .should.be.fulfilled
    })

    it('should get details back from inspection', function () {
      this.timeout(10000)
      return docker.inspect('test-image:latest')
        .should.partiallyEql({
          Config: {
            User: 'root',
            Env: [
              'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
              'ONE=uno',
              'TWO=dos'
            ],
            Cmd: [ '/bin/sh', '-c', 'this is a ./test' ],
            WorkingDir: '/my/path',
            Entrypoint: [ '/bin/sh', '-c', '= [ \'node\', \'/src/server.js\' ]' ]
          }
        })
    })
  })

  describe('container commands', function () {
    it('should create container', function () {
      this.timeout(10000)
      return adapter.create(['test-image:latest', 'temp'])
        .should.be.fulfilled
    })

    it('should export container and import to new image', function () {
      this.timeout(20000)
      return docker.export('temp')
        .then(pipe => {
          return docker.import('pipe', 'test-image:flat', { pipe })
        })
        .should.be.fulfilled
    })

    it('should remove container', function () {
      return adapter.removeContainer(['temp'])
        .should.be.fulfilled
    })

    it('should remove image', function () {
      return adapter.removeImage(['test-image:flat', '-f'])
        .should.be.fulfilled
    })
  })

  describe('explicit tag', function () {
    it('should tag the docker image', function () {
      return adapter.tag({ _: [ 'tag', 'alpine:3.4' ], tag: '3.4_custom' })
        .should.be.fulfilled
    })

    after(function () {
      return docker.removeImage('alpine:3.4_custom')
    })
  })

  describe('abbreviated tag', function () {
    it('should tag the docker image', function () {
      return adapter.tag({ _: [ 'tag', 'alpine:3.4' ], t: '3.4_custom' })
        .should.be.fulfilled
    })

    after(function () {
      return docker.removeImage('alpine:3.4_custom')
    })
  })

  describe('implicit tag', function () {
    it('should tag the docker image', function () {
      return adapter.tag({ _: [ 'tag', 'alpine:3.4', 'magic' ] })
        .should.be.fulfilled
    })

    after(function () {
      return docker.removeImage('alpine:magic')
    })
  })

  describe('push tag', function () {
    it('should push tag', function () {
      this.timeout(8000)
      return adapter.tag({ _: [ 'tag', 'alpine:3.4', 'localhost:5080/alpine:custom' ] })
        .then(function () {
          return adapter.pushTags({ _: [ 'pushTags', 'localhost:5080/alpine', 'custom' ] })
        }).should.be.fulfilled
    })
  })

  describe('push from build json', function () {
    it('should push tag', function () {
      this.timeout(8000)
      return adapter.tag({ _: [ 'tag', 'alpine:3.4' ] })
        .then(function () {
          return adapter.pushTags({ _: [ 'pushTags', 'localhost:5080/test' ] })
            .then(function (result) {
              console.log(result.join('\n'))
            })
        }).should.be.fulfilled
    })
  })

  describe('pull image', function () {
    before(function () {
      return docker.removeImage('localhost:5080/alpine:custom')
    })

    it('should pull image', function () {
      return adapter.pull('localhost:5080/alpine:custom')
        .should.be.fulfilled
    })

    after(function () {
      return docker.removeImage('localhost:5080/alpine:custom')
    })
  })
})
