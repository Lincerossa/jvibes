import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import AudioContext from './context'

const audioContext = AudioContext.getAudioContext()
let currentBuffer = null

const canvasWidth = 512
const canvasHeight = 120
const newCanvas = createCanvas(canvasWidth, canvasHeight)
let context = null

window.onload = () => {
  document.body.appendChild(newCanvas)
  context = newCanvas.getContext('2d')
}

function onDecodeError() { alert('error while decoding your file.')}

function loadMusic(url) {
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.responseType = 'arraybuffer'
  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        audioContext.decodeAudioData(req.response, (buffer) => {
          currentBuffer = buffer
          displayBuffer(buffer)
        }, onDecodeError)
      }
      else {
        alert('error during the load.Wrong url or cross origin issue')
      }
    }
  }
  req.send()
}

function displayBuffer(buff /* is an AudioBuffer */) {
  const leftChannel = buff.getChannelData(0)
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

function createCanvas(w, h) {
  var newCanvas = document.createElement('canvas')
  newCanvas.width  = w;     newCanvas.height = h
  return newCanvas
}

const Analyser = ({ blobURL }) => {
  useEffect(() => {
    if (!blobURL) return
    loadMusic(blobURL)
  }, [blobURL])

  return (
    <audio key={blobURL} controls src={blobURL} preload="auto">Your browser does not support the <code>audio</code> element. </audio>
  )
}

Analyser.propTypes = {
  blobURL: PropTypes.objectOf(PropTypes.object()).isRequired,
}
Analyser.defaultProps = {}

export default Analyser
