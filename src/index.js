import { useState, useEffect, useCallback } from 'react'
import Microphone from './utils/Microphone'

export { default as Analyser } from './components/Analyser/index'

export default () => {
  const [tracks, setTracks] = useState([])
  const [isRecording, setIsRecording] = useState(null)
  const [MicrophoneIstance, setMicrophoneIstance] = useState(null)

  const onStop = useCallback((track) => {
    setTracks((e) => [...e, track])
    setIsRecording(false)
  }, [setTracks, setIsRecording])

  useEffect(() => {
    const Instance = new Microphone({ onStart: () => setIsRecording(true), onStop })
    setMicrophoneIstance(Instance)
  }, [onStop, setIsRecording])

  function startRecording() {
    MicrophoneIstance.startRecording()
  }
  function stopRecording() {
    MicrophoneIstance.stopRecording()
  }

  return {
    tracks,
    isRecording,
    startRecording,
    stopRecording,
  }
}
