import { isString, isObject, isFunction, isArrayOf } from '../types'
import { assertArgs } from '../assert'

export function equals(a, b) {
  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      return false
    }

    if (a.length !== b.length) {
      return false
    }

    return a.every((elem, i) => equals(elem, b[i]))
  }

  if (a instanceof Object) {
    let aKeys = Object.keys(a)

    if (aKeys.length !== Object.keys(b).length) {
      return false
    }

    return aKeys.every(key => equals(a[key], b[key]))
  }

  return a === b
}

export function doWith(subject, ...fns) {
  assertArgs({
    '...fns': [fns, isArrayOf(isFunction)]
  })

  return fns.reduce((value, f) => {
    return f(value)
  }, subject)
}

export function uppercase(s) {
  return ('' + s).toUpperCase()
}

export function lowercase(s) {
  return ('' + s).toLowerCase()
}

export function reverse(s) {
  s = '' + s
  if (s.length < 2) return s
  return reverse(restOf(s)) + firstOf(s)
}

export let replace = curryable(3,
  function replace(pattern, replacement, subject) {
    return subject.split(pattern).join(replacement)
  }
)

export function firstOf(a) {
  return a[0]
}

export function restOf(a) {
  return a.slice(1)
}

export function curryable(nArgs, fn) {
  return renameFunction(function curryableFn() {
    return arguments.length < nArgs ?
      partialApply(curryableFn, arguments)
      : fn(...arguments)
  }, () => fn.name)
}

export function partialApply(fn, firstArgs) {
  let restOfFn = (...remainingArgs) =>
    fn(...firstArgs, ...remainingArgs)

  let lazyName = () => nameWithArgs(fn.name, firstArgs)
  return renameFunction(restOfFn, lazyName)
}

export function nameWithArgs(baseName, args) {
  let baseNameStr = baseName && isString(baseName) ?
    baseName
    : '<function>'

  if (args.length) {
    let prettyArgs = [...args].map(abbreviate).join(', ')
    return baseNameStr + '(' + prettyArgs + ')'
  } else {
    return baseNameStr
  }
}

export function abbreviate(a) {
  if (isString(a)) {
    return quote(
      a.length > 10 ?
        a.slice(0, 10) + '...'
        : a
    )
  } else if (isObject(a)) {
    for (let k in a) return '{...}'
    return '{}'
  } else if (Array.isArray(a)) {
    if (a.length) return '[...]'
    return '[]'
  } else if (typeof a === 'symbol') {
    return 'Symbol()'
  } else if (isFunction(a)) {
    return a.name
  }
  return '' + a
}

function quote(s) {
  return '"' + escape(s) + '"'
}

function escape(s) {
  return s
    .split('\\').join('\\\\')
    .split('\n').join('\\n')
    .split('"').join('\\"')
}

export function renameFunction(fn, nameCreator) {
  let cache = null
  Object.defineProperty(fn, 'name', {
    get() {
      if (cache === null) {
        cache = nameCreator()
      }
      return cache
    }
  })
  return fn
}

export function get(key, collection) {
  if (arguments.length < 2) {
    return partialApply(get, arguments)
  }
  return collection[key]
}

export function range(start, end) {
  if (end === undefined) return [start]

  if (end > start) {
    let items = []
    for (let i = start; i <= end; i++) items.push(i)
    return items
  } else {
    // descending order
    let items = []
    for (let i = start; i >= end; i--) items.push(i)
    return items
  }
}

export function count(collection) {
  return collection.length
}


export function isTruthy(a) {
  return !!a
}

export function isExactly(a, b) {
  return a === b
}

export function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
}

export function tuple(transformers, value) {
  if (arguments.length < 2) {
    return partialApply(tuple, arguments)
  }
  return transformers.map(t => t(value))
}

export function identity(a) {
  return a
}

export function contains(needle, haystack) {
  if (arguments.length < 2) {
    return partialApply(contains, arguments)
  }
  return haystack.indexOf(needle) > -1
}
