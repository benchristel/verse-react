import {eventChannel, buffers} from 'redux-saga';

const FPS = 60
const msPerFrame = 1000 / FPS

export function AnimationFrameTicker() {
  console.log('creating new ticker')
  const channel = eventChannel(listener => {
    console.log('someone subscribed to ticker')
    let lastFrameAt = +new Date()
    function tickFrame() {
      let now = +new Date()
      let dt = now - lastFrameAt
      let framesElapsed = Math.round(dt / msPerFrame)
      lastFrameAt = now
      listener(framesElapsed)
      requestAnimationFrame(tickFrame)
    }
    tickFrame()
    return () => {} // dummy unsubscribe function
  }, buffers.none())

  return channel
}
