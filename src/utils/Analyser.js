import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Tag } from 'antd'
import PropTypes from 'prop-types'
import AudioContext from './context'
import * as S from '../styles'

const audioContext = AudioContext.getAudioContext()

function updateCanvas({ url, context, canvasDimesions }) {
  const { width, height } = canvasDimesions

  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.responseType = 'arraybuffer'
  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        audioContext.decodeAudioData(req.response, (buffer) => {
          const leftChannel = buffer.getChannelData(0)
          context.save()
          context.fillStyle = '#222'
          context.fillRect(0, 0, width, height)
          context.strokeStyle = '#121'
          context.globalCompositeOperation = 'lighter'
          context.translate(0, height / 2)
          context.globalAlpha = 0.06
          for (let i = 0; i < leftChannel.length; i++) {
            // on which line do we get ?
            const x = Math.floor((width * i) / leftChannel.length)
            const y = (leftChannel[i] * height) / 2
            context.beginPath()
            context.moveTo(x, 0)
            context.lineTo(x + 1, y)
            context.stroke()
          }
          context.restore()
        }, () => console.log('error while decoding your file.'))
      }
      else {
        alert('error during the load.Wrong url or cross origin issue')
      }
    }
  }
  req.send()
}

const Analyser = useMemo({ blobURL }) => {
  const myCanvas = useRef()
  const myAudio = useRef()
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setPlaying] = useState(null)
  const [canvasDimesions, setCanvasDimesions] = useState(null)

  const handlePause = useCallback(() => {
    setPlaying(false)
  }, [setPlaying])

  const handleStop = useCallback(() => {
    myAudio.current.currentTime = 0
    handlePause()
    setCurrentTime(0)
  }, [myAudio, handlePause])

  const handlePlay = useCallback(() => {
    setPlaying(true)
  }, [setPlaying])

  // canvas
  useEffect(() => {
    if (!myCanvas || !myCanvas.current || !blobURL || !canvasDimesions) return
    const context = myCanvas.current.getContext('2d')
    updateCanvas({ url: blobURL, context, canvasDimesions })
  }, [myCanvas, blobURL, canvasDimesions])

  useEffect(() => {
    if (!myCanvas || !myCanvas.current || canvasDimesions) return
    setCanvasDimesions({
      width: myCanvas.current.getBoundingClientRect().width,
      height: 400,
    })
  }, [myCanvas, canvasDimesions])

  // audio
  useEffect(() => {
    let timer = null

    function handleGetCurrentTime() {
      setCurrentTime(myAudio.current.currentTime)
      timer = requestAnimationFrame(handleGetCurrentTime)
    }

    if (isPlaying) {
      myAudio.current.play()
      timer = requestAnimationFrame(handleGetCurrentTime)
    }
    if (!isPlaying && myAudio.current) myAudio.current.pause()

    return () => cancelAnimationFrame(timer)
  }, [isPlaying, myAudio, setCurrentTime])

  return (
    <div>
      <button onClick={handlePlay}>play</button>
      <button onClick={handlePause}>pause</button>
      <button onClick={handleStop}>stop</button>

      <S.CanvasWrapper>
        <S.Canvas
          ref={myCanvas}
          width={canvasDimesions && canvasDimesions.width}
          height={canvasDimesions && canvasDimesions.height}
        />
        <S.AudioTimer>
          <Tag color="magenta">0</Tag>
          {myAudio && myAudio.current && <Tag color="magenta">{myAudio.current.duration}</Tag>}
        </S.AudioTimer>
        {myAudio && myAudio.current && <S.AudioTracker percentage={ currentTime / myAudio.current.duration} />}
      </S.CanvasWrapper>
      <S.Audio ref={myAudio} key={blobURL} src={blobURL} preload="auto">Your browser does not support the <code>audio</code> element. </S.Audio>
    </div>
  )
}

Analyser.propTypes = {}
Analyser.defaultProps = {}

export default Analyser
