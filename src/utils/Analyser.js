import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import AudioContext from './context'

const audioContext = AudioContext.getAudioContext()
let currentBuffer = null

const canvasWidth = 512
const canvasHeight = 120

function onDecodeError() { alert('error while decoding your file.')}

function displayBuffer({ buffer, context }) {
  const leftChannel = buffer.getChannelData(0)
  context.save()
  context.fillStyle = '#222'
  context.fillRect(0, 0, canvasWidth, canvasHeight)
  context.strokeStyle = '#121'
  context.globalCompositeOperation = 'lighter'
  context.translate(0,canvasHeight / 2)
  context.globalAlpha = 0.06
  for (let i = 0; i < leftChannel.length; i++) {
    // on which line do we get ?
    const x = Math.floor((canvasWidth * i) / leftChannel.length)
    const y = (leftChannel[i] * canvasHeight) / 2
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x + 1, y)
    context.stroke()
  }
  context.restore()
}

function loadMusic({ url, context }) {
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.responseType = 'arraybuffer'
  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        audioContext.decodeAudioData(req.response, (buffer) => {
          currentBuffer = buffer
          displayBuffer({ buffer, context })
        }, onDecodeError)
      }
      else {
        alert('error during the load.Wrong url or cross origin issue')
      }
    }
  }
  req.send()
}

const Analyser = ({ blobURL }) => {
  const myCanvas = useRef()
  const myAudio = useRef()
  const [ duration, setDuration] = useState(null)
  const [ currentTime, setCurrentTime ] = useState()

  useEffect(() => {
    if (!blobURL || !myCanvas || !myCanvas.current) return
    const context = myCanvas.current.getContext('2d')
    setDuration(myCanvas.current.duration)
    loadMusic({ url: blobURL, context })
  }, [myCanvas, blobURL])

  function handlePlay() {
    myAudio.current.play()
  }
  function handleGetStartData() {
    setCurrentTime(myAudio.current.currentTimeime)
  }

  function handlePause() {
    myAudio.current.pause()
  }

  return (
    <div>
      <button onClick={handlePlay}>play</button>
      <button onClick={handlePause}>pause</button>
      <button onClick={handleGetStartData}>time: {currentTime}</button>
      <canvas ref={myCanvas} width={canvasWidth} height={canvasHeight} />
      <audio ref={myAudio} key={blobURL} src={blobURL} preload="auto">Your browser does not support the <code>audio</code> element. </audio>
    </div>
  )
}

Analyser.propTypes = {}
Analyser.defaultProps = {}

export default Analyser
