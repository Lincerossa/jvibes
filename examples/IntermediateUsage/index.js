import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { Button, Space } from 'antd'
import { FiPlayCircle, FiPauseCircle, FiStopCircle, FiClock } from 'react-icons/fi'
import jvibes from 'jvibes'
import * as S from './styles'

const Analyser = ({ blobURL }) => {
  const { paintCanvas } = jvibes()
  const myCanvas = useRef()
  const myAudio = useRef()
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setPlaying] = useState(null)
  const [canvasDimesions, setCanvasDimesions] = useState(null)

  const handleTogglePlayer = useCallback(() => {
    setPlaying((prevPlayingState) => !prevPlayingState)
  }, [setPlaying])

  const handleStop = useCallback(() => {
    myAudio.current.currentTime = 0
    setPlaying(false)
    setCurrentTime(0)
  }, [myAudio, setPlaying, setCurrentTime])

  // canvas
  useEffect(() => {
    if (!myCanvas || !myCanvas.current || !blobURL || !canvasDimesions || !paintCanvas) return
    const context = myCanvas.current.getContext('2d')
    paintCanvas({ url: blobURL, context, canvasDimesions })
  }, [myCanvas, blobURL, canvasDimesions, paintCanvas])

  useEffect(() => {
    if (!myCanvas || !myCanvas.current || canvasDimesions) return
    setCanvasDimesions({
      width: myCanvas.current.getBoundingClientRect().width,
      height: 200,
    })
  }, [myCanvas, canvasDimesions])

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
          { isPlaying ? <FiPauseCircle /> : <FiPlayCircle /> }
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
          <S.AudioTracker percentage={currentTime / myAudio.current.duration} />
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

const MemoizedAnalyser = React.memo(Analyser)

export default () => {
  const { tracks, isRecording, startRecording, stopRecording } = jvibes()
  return (
    <S.Recorder>
      <S.CtaWrapper>
        <Space>
          <Button loading={!!isRecording} onClick={startRecording}>record</Button>
          <Button type="danger" onClick={stopRecording}>stop</Button>
        </Space>
      </S.CtaWrapper>
      {
        tracks && tracks.map((track) => <MemoizedAnalyser key={track.blobURL} blobURL={track.blobURL} />)
      }
    </S.Recorder>
  )
}