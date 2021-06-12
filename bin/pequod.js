#!/usr/bin/env node
const format = require('util').format
const argv = require('yargs')
  .demandCommand(1)
  .argv

const docker = require('../src/docker.js')({ sudo: argv.sudo, log: console.log })
const adapter = require('../src/adapter.js')(docker)

const commandName = argv._[0]
if (adapter[commandName]) {
  adapter[commandName](argv)
    .then(
      function (result) {
        console.log(format("Docker command '%s' completed with:", commandName))
        console.log(result.join('\n'))
      },
      function (err) {
        console.log(format("Docker command '%s' failed with code %d", err.command, err.code))
        console.log('Output:')
        console.log(err.output.join('\n'))
      }
    )
} else {
  console.log(format('No support for command %s', commandName))
}
