import { combineReducers } from 'redux'

export default combineReducers({
  evalAllowed,
  appUi: combineReducers({
    screenLines,
    form,
    formId
  }),
  files,
  currentlyEditingFile,
  syntaxErrorLocations,
  testResults,
  crash,
  currentlyInspectingStage,
})

function evalAllowed(curr=false, action) {
  switch (action.type) {
    case 'allowJsToRun':
    return true

    default:
    return curr
  }
}

function screenLines(curr=[], action) {
  switch (action.type) {
    case 'display':
    return action.displayLines

    default:
    return curr
  }
}

function form(curr=[], action) {
  switch (action.type) {
    case 'display':
    return action.form

    default:
    return curr
  }
}

function formId(curr=-1, action) {
  switch (action.type) {
    case 'display':
    return action.formId

    default:
    return curr
  }
}

function files(curr={}, action) {
  switch (action.type) {
    case 'loadFiles':
    return mapObj(text => ({text, syntaxError: null}), action.files)

    case 'changeEditorText': {
      const {file, text} = action
      return {
        ...curr,
        [file]: {
          ...curr[file],
          text
        }
      }
    }

    case 'display':
    return mapObj((file, name) => {
      let error = action.syntaxErrors[name] || null
      return {
        ...file,
        syntaxError: error
      }
    }, curr)

    default:
    return curr
  }
}

function currentlyEditingFile(curr='main.js', action) {
  return curr
}

function syntaxErrorLocations(curr=[], action) {
  switch (action.type) {
    case 'changeEditorText':
    return []

    case 'markSyntaxErrors':
    return action.syntaxErrorLocations

    default:
    return curr
  }
}

function testResults(curr={}, action) {
  switch (action.type) {
    case 'display':
    return action.testResults

    default:
    return curr
  }
}

function crash(curr=null, action) {
  switch (action.type) {
    case 'display':
    return action.error

    default:
    return curr
  }
}

function currentlyInspectingStage(curr='run', action) {
  switch (action.type) {
    case 'inspectStage':
    return action.stage

    default:
    return curr
  }
}

function mapObj(fn, object) {
  let result = {}
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      result[prop] = fn(object[prop], prop)
    }
  }
  return result
}
