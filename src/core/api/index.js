import { action } from '../action'
import * as v from '..'
import '../../ensureWindowGlobal'

/*
 * Functional utilities
 */
def(v.doWith,    'doWith')
def(v.doWith,    '_')
def(v.uppercase, 'uppercase')
def(v.lowercase, 'lowercase')
def(v.reverse,   'reverse')
def(v.replace,   'replace')
def(v.firstOf,   'firstOf')
def(v.restOf,    'restOf')
def(v.lastOf,    'lastOf')
def(v.get,       'get')
def(v.count,     'count')
def(v.range,     'range')
def(v.startsWith,
                 'startsWith')
def(v.hasKey,    'hasKey')
def(v.hasEntry,  'hasEntry')
def(v.has,       'has')
def(v.isIn,      'isIn')
def(v.equals,    'equals')
def(v.isExactly, 'is')
def(v.isTruthy,  'isTruthy')
def(v.isEmpty,   'isEmpty')
def(v.not,       'not')
def(v.or,        'or')
def(v.mapObject, 'mapObject')
def(v.contains,  'contains')

/*
 * Type checkers
 */
def(v.assert,    'assert')
def(v.satisfies, 'satisfies')
def(v.isString,  'isString')
def(v.isNumber,  'isNumber')
def(v.isGeneratorFunction,
                 'isGeneratorFunction')
def(v.isIterator,
                 'isIterator')
def(v.isObject,  'isObject')
def(v.isFunction,
                 'isFunction')
def(v.isArrayOf, 'isArrayOf')
def(v.isNullOr,  'isNullOr')

/*
 * Procedural utilities
 */
def(action,      'action')
def(v.waitForEvent,
                 'waitForEvent')
def(v.wait,      'wait')
def(v.waitForChar,
                 'waitForChar')
def(v.startDisplay,
                 'startDisplay')
def(v.output,    'output')
def(v.jump,      'jump')
def(v.retry,     'retry')
def(v.perform,   'perform')
def(v.form,      'form')
def(v.lineInput, 'lineInput')
def(v.textInput, 'textInput')

/*
 * Test Framework
 */
def(v.Simulator(window),
                 'simulate')
def(v.keyDown,   'keyDown')
def(v.animationFrame,
                 'animationFrame')
def(v.formFieldChange,
                 'formFieldChange')
def(v.formSubmission,
                 'formSubmission')

function def(x, name) {
  // guard against non-existent functions being added to
  // the window object
  if (typeof x === 'undefined') {
    throw new Error('Tried to add undefined value ' + name + ' to the API')
  }
  window[name] = v.renameFunction(x, () => name)
}
