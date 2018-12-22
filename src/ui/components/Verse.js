import React from 'react'
import './Verse.css'
import connectProps from './connectProps'
import Backdrop from './Backdrop'
import CenteredContainer from './CenteredContainer'
import Frame from './Frame'
import Tab from './Tab'
import Editor from './Editor'
import Hide from './Hide'
import Pane from './Pane'
import Terminal from './Terminal'
import DustCover from './DustCover'
import { anySyntaxErrors, getSyntaxErrors, anyTestFailures } from '../selectors'
import { get, isTruthy } from '../../core'

export default () =>
  (<div className="Verse">
    <Backdrop>
      <CenteredContainer height="654px" width="1038px">
        <Links/>
        <Frame>
          <div style={{position: 'absolute', height: '640px', width: '1024px'}}>
            <LeftPane/>
            <RightPane/>
          </div>
        </Frame>
      </CenteredContainer>
    </Backdrop>
  </div>)

let Links = () => {
  return (
    <div className="links">
      Verse DEVELOPMENT VERSION |&nbsp;
      <a href="https://benchristel.github.io/verse/docs">
        Documentation
      </a>
    </div>
  )
}

let LeftPane = connectProps(props => {
  return (
    <Pane style={{width: '512px'}}>
      <Editor/>
    </Pane>
  )
})

const RightPane = connectProps(props => {
  return (
    <Pane style={{width: '514px', left: '512px', backgroundColor: '#020', height: '100%'}}>
      <Pane style={{height: '32px', top: 0, backgroundColor: '#d8d2d0', zIndex: 10, padding: '4px 0 4px 13px'}}>
        <Tab
          color={loadButtonColor(props)}
          onClick={() => props.inspectStage('load')}
          className={isInspectingStage('load', props) ? 'selected' : ''}>
          Load
        </Tab>
        <Tab
          color={testButtonColor(props)}
          onClick={() => props.inspectStage('test')}
          className={isInspectingStage('test', props) ? 'selected' : ''}>
          Test
        </Tab>
        <Tab
          color={runButtonColor(props)}
          onClick={() => { props.runApp(); props.inspectStage('run') }}
          className={isInspectingStage('run', props) ? 'selected' : ''}>
          Run
        </Tab>
      </Pane>

      <Pane style={{top: '32px'}}>
        <Terminal/>

        <Hide If={!isInspectingStage('load', props)}>
          <Pane className="scroll" style={{backgroundColor: '#db6', zIndex: 20, padding: '12px'}}>
            <ErrorPanel />
          </Pane>
        </Hide>

        <Hide If={!isInspectingStage('test', props)}>
          <Pane className="scroll" style={{backgroundColor: '#022', zIndex: 20, padding: '12px'}}>
            <TestResultsPanel />
          </Pane>
        </Hide>

        <Hide If={!isInspectingStage('run', props) || !props.crash}>
          <Pane style={{backgroundColor: '#000', color: '#fff', zIndex: 20, padding: '12px'}}>
            <CrashPanel />
          </Pane>
        </Hide>
      </Pane>
      <DustCover/>
    </Pane>
  )
})

function loadButtonColor(state) {
  return anySyntaxErrors(state) ? '#b90' : '#099'
}

function testButtonColor(state) {
  return anyTestFailures(state) ? '#920' : '#099'
}

function runButtonColor(state) {
  return state.crash ? '#000' : '#099'
}

const ErrorPanel = connectProps(props => {
  let syntaxErrors = getSyntaxErrors(props)

  if (syntaxErrors.length > 0) {
    return (
      <div className="ErrorPanel">{
        getSyntaxErrors(props).map(e =>
          `${e.error.toString()}\n\n`
          + renderStackInfo(e.error))
          .join('\n\n')
      }</div>
    )
  } else {
    return (
      <div className="ErrorPanel">
        All code loaded successfully.
      </div>
    )
  }
})

const TestResultsPanel = connectProps(props => {
  let testResults = Object.keys(props.testResults)
    .map(k => [k, props.testResults[k]])

  let failures = testResults.filter(_(get(1), isTruthy))

  if (failures.length) {
    return (<div className="TestResultsPanel">
      {testCountString(failures)} found {bugCountString(failures)}!
      {failures.map(renderTestResult).join('\n')}
    </div>)
  } else {
    return (<div className="TestResultsPanel">{passedTestsString(testResults)}</div>)
  }
})

function renderTestResult([name, error]) {
  return `
-------------------------------------------------
${name}

${error}
`
}

function testCountString(failures) {
  return failures.length === 1 ? 'One test'
    : '' + failures.length + ' tests'
}

function bugCountString(failures) {
  return failures.length === 1 ? 'a bug' : 'bugs'
}

function passedTestsString(results) {
  if (results.length === 0) return 'No tests to run.'
  if (results.length === 1) return 'One test ran, and found no issues.'
  return results.length + ' tests ran, and found no issues.'
}

const CrashPanel = connectProps(props => (
  <div className="ErrorPanel">{
    props.crash ? (
      'Crashed! The error was:\n\n'
      + props.crash.message
      + '\n\n'
      + renderStackInfo(props.crash)
    ) : ''

  }</div>
))

function renderStackInfo(error) {
  if (error.verseStack) {
    return 'at function ' +
      error.verseStack.join('()\n  called from ')
      + '()'
  }
  return ''
}

function isInspectingStage(stage, state) {
  return state.currentlyInspectingStage === stage
}

function _(...fns) {
  return function(input) {
    return fns.reduce((v, f) => f(v), input)
  }
}
