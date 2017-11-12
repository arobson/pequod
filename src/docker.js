var when = require('when')
var format = require('util').format
var spawn = require('child_process').spawn
var path = require('path')

function exec (sudo, log, command, args) {
  return when.promise(function (res, rej) {
    var out = []
    var err = []
    var cmd = sudo ? 'sudo docker' : 'docker'
    var fullArgs = [ command ].concat(args || [])
    var pid = spawn(cmd, fullArgs)
    pid.stdout.on('data', function (data) {
      log(data.toString())
      out.push(data.toString())
    })
    pid.stderr.on('data', function (data) {
      log(data.toString())
      if (/^WARNING!/.test(data.toString())) {
        out.push(data.toString())
      } else {
        err.push(data.toString())
      }
    })
    pid.on('close', function (code) {
      if (code !== 0 || err.length > 0) {
        var error = new Error(format("docker command '%s', failed with\n %s", command, err.join('\n')))
        error.command = command
        error.args = args
        error.output = err
        error.code = code
        rej(error)
      } else {
        res(out)
      }
    })
  })
}

function build (sudo, log, tag, workingPath, file) {
  var dockerfilePath = path.join(workingPath, file || './Dockerfile')
  return exec(sudo, log, 'build', [ workingPath, '-f', dockerfilePath, '-t', tag ])
}

function info (sudo, log) {
  return exec(sudo, log, 'info')
}

function login (sudo, log, user, pass, server) {
  var argList = [ '-u', user, '-p', pass ]
  if (server) {
    argList.push(server)
  }
  return exec(sudo, log, 'login', argList)
}

function push (sudo, log, image) {
  return exec(sudo, log, 'push', image)
}

function tag (sudo, log, source, target) {
  return exec(sudo, log, 'tag', [ source, target ])
}

function removeImage (sudo, log, source) {
  return exec(sudo, log, 'rmi', source)
}

function version (sudo, log) {
  return exec(sudo, log, 'version')
}

module.exports = function (options) {
  var sudo = options.sudo
  var log = options.log || function () {}
  return {
    build: build.bind(null, sudo, log),
    info: info.bind(null, sudo, log),
    login: login.bind(null, sudo, log),
    push: push.bind(null, sudo, log),
    removeImage: removeImage.bind(null, sudo, log),
    tag: tag.bind(null, sudo, log),
    version: version.bind(null, sudo, log)
  }
}
