import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FiPlayCircle, FiPauseCircle, FiStopCircle, FiClock } from "react-icons/fi";
import AudioContext from '../../utils/context'
import * as S from './styles'

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

const Analyser = ({ blobURL }) => {
  const myCanvas = useRef()
  const myAudio = useRef()
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setPlaying] = useState(null)
  const [canvasDimesions, setCanvasDimesions] = useState(null)

  const handleTogglePlayer = useCallback(() => {
    setPlaying((wasPlaying) => !wasPlaying)
  }, [setPlaying])

  const handleStop = useCallback(() => {
    myAudio.current.currentTime = 0
    setPlaying(false)
    setCurrentTime(0)
  }, [myAudio, setPlaying])

  // canvas
  useMemo(() => {
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

      if (myAudio.current.currentTime === myAudio.current.duration) {
        handleStop()
        return
      }
      if (isPlaying) {
        timer = requestAnimationFrame(handleGetCurrentTime)
      }
    }

    if (isPlaying) {
      myAudio.current.play()
      timer = requestAnimationFrame(handleGetCurrentTime)
    }

    if (!isPlaying && myAudio.current) myAudio.current.pause()

    return () => cancelAnimationFrame(timer)
  }, [isPlaying, myAudio, setCurrentTime, handleStop])

  return (

    <S.Analyser>
      <S.Canvas
        ref={myCanvas}
        width={canvasDimesions && canvasDimesions.width}
        height={canvasDimesions && canvasDimesions.height}
      />
      <S.HandlersWrapper>
        <S.IconWrapper onClick={handleStop} marginLeft><FiStopCircle /></S.IconWrapper>
        <S.IconWrapper onClick={handleTogglePlayer}>
          {
            isPlaying
              ? <FiPauseCircle />
              : <FiPlayCircle />
          }
        </S.IconWrapper>
      </S.HandlersWrapper>
      { myAudio.current && currentTime > 0 && (
        <>
          <S.AudioTimer>
            <FiClock />
            {currentTime.toFixed(2)} 
            /
            {myAudio.current.duration.toFixed(2)} 
          </S.AudioTimer>
          <S.AudioTracker percentage={currentTime/myAudio.current.duration} />
        </>
      )}
      <S.Audio ref={myAudio} key={blobURL} src={blobURL} preload="auto">
        Your browser does not support the
        <code>audio</code>
        element.
      </S.Audio>
    </S.Analyser>
  )
}

Analyser.propTypes = {}
Analyser.defaultProps = {}

export default React.memo(Analyser)
