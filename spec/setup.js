var chai = require('chai')
chai.should()
chai.use(require('chai-as-promised'))

global.sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)
