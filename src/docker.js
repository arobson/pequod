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

function build (sudo, log, tag, options = {}) {
  const workingPath = options.working || process.cwd()
  const file = options.file || 'Dockerfile'
  const cacheFrom = options.cacheFrom
  const buildArgs = getBuildArgs(options.args)
  const dockerfilePath = path.resolve(workingPath, file)
  var args = [ workingPath, '-f', dockerfilePath, '-t', tag ]
  if (cacheFrom) {
    args = args.concat(['--cache-from', cacheFrom])
  }
  if (buildArgs) {
    args = buildArgs.concat(args)
  }
  return exec(sudo, log, 'build', args)
}

function getBuildArgs (args) {
  if (args) {
    const keys = Object.keys(args)
    return keys.reduce((acc, k) => {
      acc.push('--build-arg')
      acc.push(`${k}=${args[k]}`)
      return acc
    }, [])
  }
  return undefined
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

function pull (sudo, log, image) {
  return exec(sudo, log, 'pull', image)
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
    pull: pull.bind(null, sudo, log),
    push: push.bind(null, sudo, log),
    removeImage: removeImage.bind(null, sudo, log),
    tag: tag.bind(null, sudo, log),
    version: version.bind(null, sudo, log)
  }
}
