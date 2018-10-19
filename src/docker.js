const when = require('when')
const format = require('util').format
const spawn = require('child_process').spawn
const path = require('path')

function exec (sudo, log, pipe, command, args, inputPipe) {
  return when.promise(function (res, rej) {
    const out = []
    const err = []
    const cmd = sudo ? 'sudo docker' : 'docker'
    const fullArgs = [ command ].concat(args || [])
    const options = {
      stdio: [
        inputPipe ? 'pipe' : 'ignore',
        'pipe',
        'pipe'
      ]
    }
    const pid = spawn(cmd, fullArgs, options)
    if (inputPipe) {
      inputPipe.pipe(pid.stdin)
    }
    if (pipe) {
      pid.once('error', data => {
        err.push(data.toString())
      })
      pid.stderr.on('data', (data) => {
        log(data.toString())
        if (/^WARNING!/.test(data.toString())) {
          out.push(data.toString())
        } else {
          err.push(data.toString())
        }
      })
      res(pid.stdout)
    } else {
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
    }
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
  return exec(sudo, log, false, 'build', args)
}

function create (sudo, log, image, options = {}) {
  const argList = [ image ]
  if (options.name) {
    argList.unshift(`--name=${options.name}`)
  }
  if (options.entrypoint) {
    argList.unshift(`--entrypoint ${options.entrypoint}`)
  }
  if (options.env) {
    Object.keys(options.env).forEach(e => {
      const val = options.env[e]
      argList.unshift(`-e ${e}="${val}"`)
    })
  }
  if (options.links) {
    options.links.forEach(l => {
      argList.unshift(`--link ${l}`)
    })
  }
  if (options.ports) {
    Object.keys(options.ports).forEach(p => {
      const val = options.ports[p]
      argList.unshift(`-p ${p}:${val}`)
    })
  }
  if (options.volumes) {
    options.mounts.forEach(v => {
      argList.unshift(`-v ${v.host}:${v.path}`)
    })
  }
  return exec(sudo, log, false, 'create', argList)
}

function exportContainer (sudo, log, container, options = {}) {
  const argList = [ container ]
  let pipe = true
  if (options.output) {
    pipe = false
    argList.unshift(`--output=${options.output}`)
  }
  return exec(sudo, log, pipe, 'export', argList)
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
  return exec(sudo, log, false, 'info')
}

function importContainer (sudo, log, source, target, options = {}) {
  const argList = [ target ]
  if (source && source !== 'pipe') {
    argList.unshift(source)
  } else {
    argList.unshift('-')
  }
  if (options.changes) {
    options.changes.forEach(change => {
      argList.unshift(`${change}`)
      argList.unshift(`--change`)
    })
  }
  if (options.message) {
    argList.unshift(`"${options.message}"`)
    argList.unshift(`--message`)
  }
  return exec(sudo, log, false, 'import', argList, options.pipe)
}

function inspect (sudo, log, image) {
  return exec(sudo, log, false, 'inspect', image)
    .then(result => {
      return JSON.parse(result.join(''))[0]
    })
}

function login (sudo, log, user, pass, server) {
  const argList = [ '-u', user, '-p', pass ]
  if (server) {
    argList.push(server)
  }
  return exec(sudo, log, false, 'login', argList)
}

function pull (sudo, log, image) {
  return exec(sudo, log, false, 'pull', image)
}

function push (sudo, log, image) {
  return exec(sudo, log, false, 'push', image)
}

function tag (sudo, log, source, target) {
  return exec(sudo, log, false, 'tag', [ source, target ])
}

function removeContainer (sudo, log, container, options = {}) {
  const argList = [ container ]
  if (options.force) {
    argList.unshift(`-f`)
  }
  if (options.volumes) {
    argList.unshift(`-v`)
  }
  return exec(sudo, log, false, 'rm', argList)
}

function removeImage (sudo, log, source) {
  return exec(sudo, log, false, 'rmi', source)
}

function version (sudo, log) {
  return exec(sudo, log, false, 'version')
}

module.exports = function (options) {
  const sudo = options.sudo
  const log = options.log || function () {}
  return {
    build: build.bind(null, sudo, log),
    create: create.bind(null, sudo, log),
    export: exportContainer.bind(null, sudo, log),
    import: importContainer.bind(null, sudo, log),
    info: info.bind(null, sudo, log),
    inspect: inspect.bind(null, sudo, log),
    login: login.bind(null, sudo, log),
    pull: pull.bind(null, sudo, log),
    push: push.bind(null, sudo, log),
    removeContainer: removeContainer.bind(null, sudo, log),
    removeImage: removeImage.bind(null, sudo, log),
    tag: tag.bind(null, sudo, log),
    version: version.bind(null, sudo, log)
  }
}
