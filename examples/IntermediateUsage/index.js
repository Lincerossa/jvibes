import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Button, Space } from 'antd'
import { FiPlayCircle, FiPauseCircle, FiStopCircle, FiClock } from 'react-icons/fi'
import jvibes from 'jvibes'
import * as S from './styles'

const Analyser = ({ blobURL, paintCanvas }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setPlaying] = useState(null)
  const [canvasDimesions, setCanvasDimesions] = useState(null)
  const myCanvas = useRef()
  const myAudio = useRef()

  const handleTogglePlayer = useCallback(() => {
    setPlaying((e) => !e)
  }, [setPlaying])

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

  const handleStop = useCallback(() => {
    myAudio.current.currentTime = 0
    setPlaying(false)
    setCurrentTime(0)
  }, [myAudio, setPlaying, setCurrentTime])

  useEffect(() => {
    let timer = null

    function handleGetCurrentTime() {
      setCurrentTime(myAudio.current.currentTime)
      if (myAudio.current.currentTime === myAudio.current.duration) handleStop()
      timer = requestAnimationFrame(handleGetCurrentTime)
    }

    if (isPlaying) timer = requestAnimationFrame(handleGetCurrentTime)

    return () => cancelAnimationFrame(timer)
  }, [isPlaying, myAudio, setCurrentTime, handleStop])

  useEffect(() => {
    if (isPlaying) myAudio.current.play()
    if (!isPlaying) myAudio.current.pause()
  }, [isPlaying, myAudio])

  const percentage = currentTime / (myAudio && myAudio.current && myAudio.current.duration)

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
      { myAudio.current && myAudio.current.duration > 0 && (
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
  const { tracks, isRecording, startRecording, stopRecording, paintCanvas } = jvibes()
  return (
    <S.Recorder>
      <S.CtaWrapper>
        <Space>
          <Button loading={!!isRecording} onClick={startRecording}>record</Button>
          <Button type="danger" onClick={stopRecording}>stop</Button>
        </Space>
      </S.CtaWrapper>
      {
        tracks && tracks.map(({ blobURL }) => <MemoizedAnalyser key={blobURL} blobURL={blobURL} paintCanvas={paintCanvas} />)
      }
    </S.Recorder>
  )
}
