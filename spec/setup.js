const chai = require('chai')
chai.should()
chai.use(require('chai-as-promised'))

global.sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

function isObject (value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

function deepCompare (a, b, k) {
  let diffs = []
  if (b === undefined && a !== undefined) {
    diffs.push('expected ' + k + ' to equal ' + a + ' but was undefined ')
  } else if (isObject(a) || Array.isArray(a)) {
    for (const c in a) {
      const key = k ? [k, c].join('.') : c
      diffs = diffs.concat(deepCompare(a[c], b[c], key))
    }
  } else {
    const equal = a == b // eslint-disable-line eqeqeq
    if (!equal) {
      diffs.push('expected ' + k + ' to equal ' + a + ' but got ' + b)
    }
  }
  return diffs
}

chai.Assertion.addMethod('partiallyEql', function (partial) {
  let obj = this._obj
  if (!obj.then) {
    obj = Promise.resolve(obj)
  }
  const self = this
  return obj.then(function (actual) {
    const diffs = deepCompare(partial, actual)
    return self.assert(
      diffs.length === 0,
      diffs.join('\n\t')
    )
  })
})
