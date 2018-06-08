import {
  startInputDisplay,
  startDisplay,
  waitForChar,
  wait,
  retry
} from './index'

/*
 * These routines run when a Verse app starts.
 */

export default function *init() {
  yield startInputDisplay(() => [])
  yield startDisplay(() => {
    if (window.displayText) {
      try {
        return ['' + window.displayText()]
      } catch (e) {
        return ['ERROR: ' + e.message]
      }
    } else {
      return []
    }
  })
  if (window.run) {
    if (window.displayText) {
      yield waitForAnyKeyBeforeRunning
    }
    yield startDisplay(() => [])
    yield window.run
  } else {
    yield waitForever
  }
}

function *waitForAnyKeyBeforeRunning() {
  yield startInputDisplay(() => [
    'Press any key to start the *run() function'
  ])
  yield waitForChar()
}

function *waitForever() {
  yield wait(100)
  yield retry()
}
