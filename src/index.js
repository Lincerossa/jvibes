
import React, { useState, useEffect, useCallback } from 'react'

import Microphone from './utils/Microphone'
import Player from './utils/Player'


export default (status) => {

  const [ tracks, setTracks ] = useState([])
  const [ isRecording, setIsRecording] = useState(null)
  const [ MicrophoneIstance, setMicrophoneIstance ] = useState(null)

  const onStart = () => setIsRecording(true)

  const onStop = useCallback((track) => {
    setTracks([...tracks, track])
    setIsRecording(false)
  }, [tracks, setTracks, setIsRecording])

  useEffect(()=> {
    const MicrophoneIstance = new Microphone(onStart, onStop)
    setMicrophoneIstance(MicrophoneIstance)
  }, [onStop])


  useEffect(() => {
    if(!MicrophoneIstance) return 
    if(status === "start") MicrophoneIstance.startRecording()
    if(status === "stop") MicrophoneIstance.stopRecording()
  }, [status, MicrophoneIstance])


  return {
    tracks,
    isRecording
  }
}